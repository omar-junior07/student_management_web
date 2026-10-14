const STORAGE_KEY = "student-management-system-records-v1";
const MAX_STUDENTS = 30;

// Example grading boundaries. Change these if your lecturer specifies other ranges.
function getGrade(mark) {
  if (mark >= 80) return "A";
  if (mark >= 75) return "B+";
  if (mark >= 70) return "B";
  if (mark >= 65) return "c+";
  if (mark >= 60) return "C";
  if (mark >= 55) return "D+";
  if (mark >= 50) return "D";
  return "F";
}

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(s =>
      s && typeof s.name === "string" && Number.isFinite(s.mark) &&
      s.mark >= 0 && s.mark <= 100
    ).slice(0, MAX_STUDENTS) : [];
  } catch {
    return [];
  }
}

let students = loadStudents();

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("studentName");
const markInput = document.getElementById("studentMark");
const message = document.getElementById("formMessage");
const resultsBody = document.getElementById("resultsBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleStudents = students
    .map((student, index) => ({ ...student, originalIndex: index }))
    .filter(student => student.name.toLowerCase().includes(query));

  resultsBody.innerHTML = "";
  visibleStudents.forEach((student, visibleIndex) => {
    const grade = getGrade(student.mark);
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(student.originalIndex + 1);

    const nameCell = document.createElement("td");
    nameCell.textContent = student.name;

    const markCell = document.createElement("td");
    markCell.textContent = String(student.mark);

    const gradeCell = document.createElement("td");
    const gradeBadge = document.createElement("span");
    gradeBadge.className = "grade";
    gradeBadge.textContent = grade;
    gradeCell.appendChild(gradeBadge);

    const resultCell = document.createElement("td");
    resultCell.textContent = student.mark >= 50 ? "Pass" : "Fail";
    resultCell.className = student.mark >= 50 ? "status-pass" : "status-fail";

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${student.name}`);
    deleteButton.addEventListener("click", () => {
      const confirmed = window.confirm(`Delete the record for ${student.name}?`);
      if (!confirmed) return;
      students.splice(student.originalIndex, 1);
      saveStudents();
      showMessage(`${student.name}'s record was deleted.`);
      render();
    });
    actionCell.appendChild(deleteButton);

    row.append(numberCell, nameCell, markCell, gradeCell, resultCell, actionCell);
    resultsBody.appendChild(row);
  });

  emptyState.hidden = visibleStudents.length !== 0;
  document.getElementById("totalStudents").textContent = String(students.length);

  if (students.length) {
    const total = students.reduce((sum, student) => sum + student.mark, 0);
    const highest = Math.max(...students.map(student => student.mark));
    const passes = students.filter(student => student.mark >= 50).length;
    document.getElementById("classAverage").textContent = `${(total / students.length).toFixed(1)}%`;
    document.getElementById("highestMark").textContent = `${highest}%`;
    document.getElementById("passRate").textContent = `${Math.round((passes / students.length) * 100)}%`;
  } else {
    document.getElementById("classAverage").textContent = "—";
    document.getElementById("highestMark").textContent = "—";
    document.getElementById("passRate").textContent = "—";
  }

  document.getElementById("recordCount").textContent =
    `Showing ${visibleStudents.length} of ${students.length} student${students.length === 1 ? "" : "s"}`;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const rawMark = markInput.value.trim();
  const mark = Number(rawMark);

  if (!name) {
    showMessage("Please enter a student name.", true);
    nameInput.focus();
    return;
  }
  if (rawMark === "" || !Number.isInteger(mark) || mark < 0 || mark > 100) {
    showMessage("Enter a whole-number mark between 0 and 100.", true);
    markInput.focus();
    return;
  }
  if (students.length >= MAX_STUDENTS) {
    showMessage("The class limit of 30 students has been reached. Delete a record to add another.", true);
    return;
  }

  students.push({ name, mark });
  saveStudents();
  form.reset();
  showMessage(`${name} was added successfully.`);
  render();
  nameInput.focus();
});

searchInput.addEventListener("input", render);

document.getElementById("clearBtn").addEventListener("click", () => {
  if (!students.length) {
    showMessage("There are no records to clear.", true);
    return;
  }
  if (!window.confirm("Delete all student records from this browser? This cannot be undone.")) return;
  students = [];
  saveStudents();
  showMessage("All student records have been cleared.");
  render();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  if (!students.length) {
    showMessage("Add at least one student before exporting.", true);
    return;
  }
  const rows = [["No.", "Student Name", "Mark", "Grade", "Result"]];
  students.forEach((student, index) => {
    rows.push([
      index + 1,
      student.name,
      student.mark,
      getGrade(student.mark),
      student.mark >= 50 ? "Pass" : "Fail"
    ]);
  });
  const csv = rows.map(row => row.map(value =>
    `"${String(value).replaceAll('"', '""')}"`
  ).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-examination-results.csv";
  link.click();
  URL.revokeObjectURL(url);
  showMessage("Results exported as a CSV file.");
});

render();
