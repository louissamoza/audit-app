const data = [];

const form = document.getElementById('audit-form');
const generateButton = document.getElementById('generate-button');
const questions = document.querySelectorAll('.audit-form-question p');


form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const answers = {};
    formData.forEach((value, key) => {
        answers[key] = value;
    })

    data.push(answers);

    console.log(data);
})

generateButton.addEventListener('click', () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Data');

    const questionTitles = Array.from(questions).map(question => question.textContent);

    console.log(questionTitles);

    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Location", "Date", ...questionTitles, "Notes"]], { origin: "A1" });

    console.log(data);


    const nameWidth = data.reduce((w, r) => Math.max(w, r.auditor_name.length), 10);
    const locationWidth = data.reduce((w, r) => Math.max(w, r.location.length), 10);
    const questionsWidth = questionTitles.map(title => ({ wch: title.length }));
    const notesWidth = data.reduce((w, r) => Math.max(w, r.notes.length), 10);

    
    worksheet["!cols"] = [
        { wch: nameWidth },
        { wch: locationWidth },
        { wch: 10 },
        ...questionsWidth,
        { wch: notesWidth },
    ];

    XLSX.writeFile(workbook, 'audit_data.xlsx');
})