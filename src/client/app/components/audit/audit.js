const auditData = [];

const elements = {
    auditForm: document.getElementById('audit-form'),
    addLocationForm: document.getElementById('add-location-form'),
    addLocationModal: document.getElementById('add-location-modal'),
    deleteLocationModal: document.getElementById('delete-location-modal'),
    addLocationBtn: document.getElementById('add-location-btn'),
    deleteLocationBtn: document.getElementById('delete-location-btn'),
    addLocationBtnConfirm: document.getElementById('add-location-btn-confirm'),
    deleteLocationBtnConfirm: document.getElementById('delete-location-btn-confirm'),
    locationSelect: document.getElementById('location-select'),
    deleteLocationSelect: document.getElementById('delete-location-select'),
    generateReportBtn: document.getElementById('generate-report-btn'),
    addLocationText: document.getElementById('add-location-text'),
    questions: document.querySelectorAll('.audit-form-question p')
};

elements.addLocationBtn.addEventListener('click', addLocation);
elements.addLocationBtnConfirm.addEventListener('click', addLocationConfirm);
elements.deleteLocationBtn.addEventListener('click', deleteLocation);
elements.deleteLocationBtnConfirm.addEventListener('click', deleteLocationConfirm);
elements.auditForm.addEventListener('submit', submitAuditForm);
elements.generateReportBtn.addEventListener('click', generateReport);

function submitAuditForm(event) {
    event.preventDefault();

    // Create FormData object from the form
    const formData = new FormData(elements.auditForm);

    // Convert FormData key value pairs to a plain answers object
    const answers = {};
    formData.forEach((value, key) => {
        answers[key] = value;
    })

    // Push the answers object to the data array
    auditData.push(answers);
}

function generateReport() {
    // Set up the worksheet and workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Data');

    // Add headers to the worksheet
    const headers = Array.from(elements.questions).map(question => question.textContent);
    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Location", "Date", ...headers, "Notes"]], { origin: "A1" });

    // Adjust column widths
    const columnWidths = {
        name: data.reduce((w, r) => Math.max(w, r.name.length), 10),
        location: data.reduce((w, r) => Math.max(w, r.location.length), 10),
        questions: headers.map(h => ({ wch: h.length })),
        notes: data.reduce((w, r) => Math.max(w, r.notes.length), 10)
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

function addLocationConfirm() {
    // Do nothing if the input is empty
    if (elements.addLocationText.value === '') {
        return;
    }

    // Add a new location to the select element
    const newLocation = new Option(elements.addLocationText.value, elements.addLocationText.value);
    elements.locationSelect.add(newLocation);

    // Clear the input field
    elements.addLocationForm.reset();

    // Hide the modal
    const modal = bootstrap.Modal.getInstance(elements.addLocationModal);
    modal.hide();
}

function getLocations() {
    // Get all locations
    const locations = Array.from(elements.locationSelect.options).slice(1);
    return locations;
}

function deleteLocation() {
    // Create new modal
    const modal = new bootstrap.Modal(elements.deleteLocationModal);

    // Get all location values
    const locations = getLocations().map(location => location.value);

    // Clear the select element
    elements.deleteLocationSelect.replaceChildren();

    // Add locations to the select element
    const select = new Option('Select', '', true, true);
    select.disabled = true;
    elements.deleteLocationSelect.add(select);
    locations.forEach(location => {
        elements.deleteLocationSelect.add(new Option(location, location));
    });

    // Show the modal
    modal.show();
}

function deleteLocationConfirm() {
    // Get all locations
    const locations = getLocations();

    // Remove the selected location from the select element
    locations.forEach(location => {
        if (location.value === elements.deleteLocationSelect.value) {
            location.remove();
        }
    })

    // Hide the modal
    const modal = bootstrap.Modal.getInstance(elements.deleteLocationModal);
    modal.hide();
}