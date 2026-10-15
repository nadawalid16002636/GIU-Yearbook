# Lab Answers

### 1. Which fields are displayed on the card?
The card displays photo, name, faculty, classYear and quote.

### 2. Which field builds the link to the student's story?
The id field builds the link. For example, student 3 has the link /students/3.

### 3. Which field controls "Featured first" sorting?
The featured field controls this sorting. Students marked true appear first.

## Numbered Questions

### Question 1: Why does the selector start with app-?
The app- prefix identifies components belonging to our application.
It helps avoid naming conflicts with HTML elements and other components.

### Question 2: If the parent passes a different student, will the card update automatically?
Yes. The student is received through a signal-based input.
Angular updates the displayed information when the input changes.

### Question 3: Why is the arrow red?
The SVG uses stroke="currentColor", which takes its color from CSS.
The card__arrow CSS rule sets the color to var(--color-red).

### Question 4: Why use computed for photoSrc instead of assigning it in the constructor?
computed updates the photo path when the reactive values it reads change.
A constructor assignment runs only once and would not automatically update when the image fails.

## Reflection Questions

### 1. Why does the card receive the student through an input instead of loading it from StudentService itself?
The parent page loads the students and passes one student to each card.
This keeps the card focused on displaying information and avoids separate requests for every card.

### 2. What is the advantage of a separate card component?
We can reuse the same component for every student.
Changing the card in one place updates all cards and makes the page easier to maintain.

### 3. If the backend adds graduationDate, which files would you change to display it?
I would add graduationDate to student.model.ts and display it in student-card.html.
I would also update students.json for mock data and change student-card.css if styling is needed.

### 4. Which step was hardest, and what did you do to get unstuck?
The hardest part was fixing the build error for the student-story route.
With help, I changed students/:id to RenderMode.Client in app.routes.server.ts and ran the build again successfully.