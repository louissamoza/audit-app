import Audit from "./models/Audit.js";
import AuditService from "./services/audit.service.js";

if (!localStorage.getItem('userId')) {
    localStorage.setItem('userId', crypto.randomUUID());
}

const userId = localStorage.getItem('userId');

let audit;
let response = await AuditService.findAudit(userId);
if (response) {
    audit = new Audit(response);
} else {
    audit = new Audit({ userId, locations: [], questions: [] });
}

let deleteQuestionIndex = null;

const auditData = [];

const elements = {
    auditForm: document.getElementById('audit-form'),
    addLocationForm: document.getElementById('add-location-form'),
    addLocationModal: document.getElementById('add-location-modal'),
    deleteLocationModal: document.getElementById('delete-location-modal'),
    addQuestionForm: document.getElementById('add-question-form'),
    addQuestionModal: document.getElementById('add-question-modal'),
    deleteQuestionModal: document.getElementById('delete-question-modal'),
    addLocationBtn: document.getElementById('add-location-btn'),
    addLocationConfirmBtn: document.getElementById('add-location-btn-confirm'),
    deleteLocationBtn: document.getElementById('delete-location-btn'),
    deleteLocationConfirmBtn: document.getElementById('delete-location-btn-confirm'),
    addQuestionBtn: document.getElementById('add-question-btn'),
    addQuestionConfirmBtn: document.getElementById('add-question-btn-confirm'),
    deleteQuestionConfirmBtn: document.getElementById('delete-question-btn-confirm'),
    generateReportBtn: document.getElementById('generate-report-btn'),
    locationList: document.getElementById('location-list'),
    deleteLocationList: document.getElementById('delete-location-list'),
    addLocationName: document.getElementById('add-location-name'),
    addQuestionName: document.getElementById('add-question-name'),
    addQuestionType: document.getElementById('add-question-type'),
    questions: document.querySelectorAll('.audit-form-question p'),
    questionList: document.getElementById('audit-form-questions')
};

elements.auditForm.addEventListener('submit', submitAuditForm);
elements.addLocationBtn.addEventListener('click', addLocation);
elements.addLocationConfirmBtn.addEventListener('click', addLocationConfirm);
elements.deleteLocationBtn.addEventListener('click', deleteLocation);
elements.deleteLocationConfirmBtn.addEventListener('click', deleteLocationConfirm);
elements.generateReportBtn.addEventListener('click', generateReport);
elements.addQuestionBtn.addEventListener('click', addQuestion);
elements.addQuestionConfirmBtn.addEventListener('click', addQuestionConfirm);
elements.deleteQuestionConfirmBtn.addEventListener('click', deleteQuestionConfirm);

renderAudit(audit);

function submitAuditForm(event) {
    event.preventDefault();

    // Create FormData object from the form
    const formData = new FormData(elements.auditForm);

    // Convert FormData key value pairs to a plain answers object
    const answers = {};

    formData.forEach((value, key) => {
        answers[key] = value;
    })

    console.log(answers);

    // Push the answers object to the data array
    auditData.push(answers);
}

function generateReport() {
    // Set up the worksheet and workbook
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(auditData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Data');

    // Add headers to the worksheet
    const headers = Array.from(elements.questions).map(question => question.textContent);

    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Location", "Date", ...headers, "Notes"]], { origin: "A1" });

    // Adjust column widths
    const columnWidths = {
        name: auditData.reduce((w, r) => Math.max(w, r.name.length), 10),
        location: auditData.reduce((w, r) => Math.max(w, r.location.length), 10),
        questions: headers.map(h => ({ wch: h.length })),
        notes: auditData.reduce((w, r) => Math.max(w, r.notes.length), 10)
    };

    worksheet["!cols"] = [
        { wch: columnWidths.name },
        { wch: columnWidths.location },
        { wch: 10 },
        ...columnWidths.questions,
        { wch: columnWidths.notes },
    ];

    // Write the workbook to a file
    XLSX.writeFile(workbook, 'audit_data.xlsx');
}

function addLocation() {
    // Show the modal
    const modal = new bootstrap.Modal(elements.addLocationModal)
    modal.show();
}

async function addLocationConfirm() {
    // Do nothing if the input is empty
    if (elements.addLocationName.value === '') {
        return;
    }

    // Add a new location to the select element
    const newLocation = new Option(elements.addLocationName.value, elements.addLocationName.value);

    elements.locationList.add(newLocation);

    audit.locations.push(elements.addLocationName.value);

    // Clear the input field
    elements.addLocationForm.reset();

    await saveAudit();

    await renderAudit(audit);

    // Hide the modal
    const modal = bootstrap.Modal.getInstance(elements.addLocationModal);
    modal.hide();
}

function deleteLocation() {
    // Reset the select element
    elements.deleteLocationList.replaceChildren();

    // Add locations to the select element
    const select = new Option('Select', '', true, true);
    select.disabled = true;

    elements.deleteLocationList.add(select);

    audit.locations.forEach(location => {
        elements.deleteLocationList.add(new Option(location, location));
    });

    // Show the modal
    const modal = new bootstrap.Modal(elements.deleteLocationModal);
    modal.show();
}

async function deleteLocationConfirm() {
    // Remove the selected location from the select element
    audit.locations.forEach((location, index) => {
        if (location === elements.deleteLocationList.value) {
            audit.locations.splice(index, 1);
        }
    })

    await saveAudit();

    await renderAudit(audit);

    // Hide the modal
    const modal = bootstrap.Modal.getInstance(elements.deleteLocationModal);
    modal.hide();
}

function addQuestion() {
    const modal = new bootstrap.Modal(elements.addQuestionModal);
    modal.show();
}

async function addQuestionConfirm() {
    console.log("addQuestionConfirm called");
    console.log("audit.questions before:", audit.questions, Array.isArray(audit.questions));
    const question = elements.addQuestionName.value;
    const type = elements.addQuestionType.value;

    console.log("question:", question, "type:", type);

    if (!question || !type) {
        return;
    }

    let options = [];
    if (type === "Yes/No") {
        options = [
            { text: "Yes", points: 1 },
            { text: "No", points: 0 }
        ]
    } else if (type === "Rating") {
        options = [
            { text: "Poor", points: 0 },
            { text: "Fair", points: 1 },
            { text: "Good", points: 2 },
            { text: "Very Good", points: 3 },
            { text: "Excellent", points: 4 }
        ];
    }

    const questionObject = {
        question: question,
        options
    };

    audit.questions.push(questionObject);

    elements.addQuestionForm.reset();

    await saveAudit();

    await renderAudit(audit);

    const modal = bootstrap.Modal.getInstance(elements.addQuestionModal);
    modal.hide();
}

function deleteQuestion(index) {
    deleteQuestionIndex = index;
    const modal = new bootstrap.Modal(elements.deleteQuestionModal)
    modal.show();
}

async function deleteQuestionConfirm() {
    audit.questions.splice(deleteQuestionIndex, 1);

    deleteQuestionIndex = null;

    await saveAudit();

    await renderAudit(audit);

    const modal = bootstrap.Modal.getInstance(elements.deleteQuestionModal);
    modal.hide();
}

async function saveAudit() {
    if (response) {
        await AuditService.updateAudit(audit);
    } else {
        await AuditService.createAudit(audit);
    }
}

async function renderAudit(audit) {
    elements.locationList.replaceChildren();
    elements.questionList.replaceChildren();

    const { locations, questions } = audit;

    const select = new Option('Select', '', true, true);
    select.disabled = true;
    elements.locationList.add(select);

    locations.forEach(location => {
        const locationOption = document.createElement('option');
        locationOption.setAttribute('value', location);
        locationOption.textContent = location;
        elements.locationList.append(locationOption);
    })

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('audit-form-question');

        const questionGroupDiv = document.createElement('div');
        questionGroupDiv.classList.add('question-group');

        const questionText = document.createElement('p');
        questionText.textContent = q.question;

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.classList.add('btn');
        deleteBtn.setAttribute('id', 'delete-question-btn');
        deleteBtn.addEventListener('click', () => deleteQuestion(index));

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash');

        deleteBtn.append(deleteIcon);
        questionGroupDiv.append(questionText, deleteBtn);
        questionDiv.append(questionGroupDiv);

        q.options.forEach(option => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');
            optionLabel.textContent = option.text
            optionInput.type = "radio";
            optionInput.name = `question_${index + 1}`;
            optionInput.value = option.text;

            optionLabel.prepend(optionInput);
            questionDiv.append(optionLabel);
        })
        elements.questionList.append(questionDiv);
    })
}