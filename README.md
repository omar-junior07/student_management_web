# Student Management System (Web App)

A beginner-friendly web version of the C++/Java arrays assignment, built with HTML, CSS, and JavaScript.

## Features
- Add up to 30 student records
- Store student names and marks in JavaScript arrays (an array of student records)
- Validate marks from 0 to 100
- Automatically assign example grades
- Show pass/fail, class average, highest mark, and pass rate
- Search student names
- Delete one record or clear all records
- Export results to CSV
- Save records in the current browser using `localStorage`

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in a modern browser, or open the folder in Visual Studio Code and use the Live Server extension.
3. Add student names and examination marks.

No build tools or server are required for this demo.

## Deploy it free as a static website
You can publish the three app files (`index.html`, `style.css`, `app.js`) to a static hosting service such as GitHub Pages, Netlify, or Cloudflare Pages. The README is for instructions only.

## Important limitation
This is a demonstration/assignment version, not a secure multi-user school system. Records are saved only in the browser and device that created them. They are not shared with other users or devices, and clearing browser storage can remove them. For a real school deployment with accounts, shared records, backups, and access controls, add a backend and database.

## Example grading
- 80–100: A
- 70–79: B
- 60–69: C
- 50–59: D
- 0–49: F

These are sample boundaries; change `getGrade()` in `app.js` to match the grading rules required by your lecturer.
