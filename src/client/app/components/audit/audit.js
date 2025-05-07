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

    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Location", "Date", ...questionTitles, "Notes"]], { origin: "A1" });

    const nameWidth = data.reduce((w, r) => Math.max(w, r.name.length), 10);
    const locationWidth = data.reduce((w, r) => Math.max(w, r.location.length), 10);
    
    worksheet["!cols"] = [
        { wch: nameWidth },
        { wch: locationWidth },
        { wch: 10 }
    ];

    XLSX.writeFile(workbook, 'audit_data.xlsx');
})