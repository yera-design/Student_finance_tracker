
// this generate a unique ID for each transaction record 
function generateId() {
  return "txn_" + Date.now();
}

// defines the localstorage key used to save and  retrieve data 
const STORAGE_KEY = "financeTrackerData";

// load saved records from localStorage and return an empty array if no data exists
function loadRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// saves the current list of records to localStorage for future use 
function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// Creates a new transaction record with timestamps for tracking changes 
function createRecord(description, amount, category, date) {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    description: description,
    amount: amount,
    category: category,
    date: date,
    createdAt: now,
    updatedAt: now
  };
}
// this Load all existing records when the application starts
let records = loadRecords();

//this adds a new transaction record and save the updated list 
function addRecord(description, amount, category, date) {
  const newRecord = createRecord(description, amount, category, date);
  records.push(newRecord);
  saveRecords(records);
} 
//this defines validation rules to ensure transaction data is entered in the correct format
const descriptionPattern = /^\S(?:.*\S)?$/;
const amountPattern = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const categoryPattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
const duplicateWordPattern = /\b(\w+)\s+\1\b/;

// this validates all user inputs and returns a list of error messages for any invalid inputs.
function validateInputs(description, amount, category, date) {
  const errors = [];

  if (!descriptionPattern.test(description)) {
    errors.push("Description cannot have trailing spaces.");
  }

  if (duplicateWordPattern.test(description)) {
    errors.push("Description contains a duplicate word.");
  }

  if (!amountPattern.test(amount)) {
    errors.push("Amount must be a valid number (e.g. 30.67).");
  }

  if (!categoryPattern.test(category)) {
    errors.push("Category must contain only letters, spaces, or hyphens.");
  }

  if (!datePattern.test(date)) {
    errors.push("Date must be in YYYY-MM-DD format.");
  }

  return errors;
}
//this for getting a reference to the form for adding new records
const form = document.getElementById("record-form");

// this handles form submission and create a new transaction record
form.addEventListener("submit", function(event) {

    //this is for preventing the page from refreshing when the form is submitted 
  event.preventDefault();

  // this is basically for collecting the values entered by the user 
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  // Validate the submitted data and stop the process if any errors are found
  const errors = validateInputs(description, amount, category, date);
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }
  // this is for converting the amount from text input to a numeric value
  const parsedAmount = parseFloat(amount);
  // this adds the new record to the tracker and saves it to localstorage 
  addRecord(description, parsedAmount, category, date);
  renderRecords();
  form.reset();
});
// this gets a reference to the table body where transaction records will be displayed
const tableBody = document.querySelector("#records-table tbody");

// this displays all saved records in the table
function renderRecords() {
  tableBody.innerHTML = "";

  records.forEach(function(record) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${record.description}</td>
      <td>${record.amount.toFixed(2)}</td>
      <td>${record.category}</td>
      <td>${record.date}</td>
      <td>
        <button type="button" class="edit-btn" data-id="${record.id}">Edit</button>
        <button type="button" class="delete-btn" data-id="${record.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}
renderRecords();


