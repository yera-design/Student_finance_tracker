# Student Finance Tracker

This is a web app I built for my Web Development summative at ALU. I chose the Student Finance Tracker theme because it hits a real pain point I actually see in students around me, it's easy to lose track of spending and find yourself broke before the month ends without even knowing why.

The app lets students log their expenses, organize them by category, and track their spending against a budget cap. After every record, you get an instant update on how much you have left, or how much you've gone over. No more surprises at the end of the month.

## Live Demo
[https://yera-design.github.io/Student_finance_tracker/]

## How to Run
1. Clone or download the repo
2. Open `index.html` in your browser
3. No installation needed, built with pure HTML, CSS, and vanilla JavaScript

## Features
- Add, edit, and delete expense records
- Form validation using regex, catches bad input before it gets saved
- Live regex search across your records with match highlighting
- Sort records by date, description, or amount
- Dashboard showing total records, total spent, top spending category, and a 7-day trend chart
- Spending cap with live budget alerts (tells you what's left or how much you've exceeded)
- Import and export your data as JSON
- Currency converter (USD to RWF and USD to EUR) with manual rates
- Light and dark mode toggle that remembers your preference
- Works on mobile, tablet, and desktop
- Keyboard accessible — you can navigate the whole app without a mouse

## Regex Catalog

| Field | Pattern | What it does |
|---|---|---|
| Description | `/^\S(?:.*\S)?$/` | Blocks leading or trailing spaces |
| Amount | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Only valid currency numbers (max 2 decimal places) |
| Date | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Forces YYYY-MM-DD format |
| Category | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, spaces, and hyphens only |
| Advanced | `/\b(\w+)\s+\1\b/` | Back-reference that catches duplicate words like "the the" |
| Search | User types any pattern | Live filtering with try/catch so bad regex doesn't crash the app |

## Keyboard Map

| Key | What happens |
|---|---|
| Tab | Move between buttons, inputs, and links |
| Enter | Submit form or activate a button |
| First Tab on page | Skip link appears — jumps straight to main content |

## Accessibility Notes
- Proper semantic landmarks throughout: header, nav, main, section, footer
- Every input has a label bound to it
- Visible green focus outline on all interactive elements
- ARIA live region on the budget cap message — screen readers announce it automatically
- Skip-to-content link for keyboard users
- Table headers use `scope="col"` so screen readers can match data to its column

## How to Run Tests
Open `tests.html` in your browser. You'll see 15 regex tests, all should show PASS.

## Project Structure
Student_finance_tracker/
├── index.html
├── styles/
│ └── style.css
├── scripts/
│ └── script.js
├── assets/
├── tests.html
├── seed.json
└── README.md


## Seed Data
`seed.json` contains 12 diverse records covering all 6 categories with dates from the last 7 days. Import it via Settings → Import Data (JSON) to see the app with real data.

## Theme
Student Finance Tracker

##  Built by
Promise Yera — ALU Web Development Summative, 2026





