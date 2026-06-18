
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
let editingId = null;

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
  if (editingId) {
  updateRecord(editingId, description, parsedAmount, category, date);
  editingId = null;
} else {
  addRecord(description, parsedAmount, category, date);
}
  renderRecords();
  updateDashboard()
  form.reset();
});
// this gets a reference to the table body where transaction records will be displayed
const tableBody = document.querySelector("#records-table tbody");

const searchInput = document.getElementById("search-records");

// this filters the table live as the user types a search pattern
searchInput.addEventListener("input", function() {
  renderRecords();
});

// this sorts buttons, reorders the records array and refreshes the table
document.getElementById("sort-date").addEventListener("click", function() {
  records.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
  renderRecords();
});

document.getElementById("sort-description").addEventListener("click", function() {
  records.sort(function(a, b) { return a.description.localeCompare(b.description); });
  renderRecords();
});

document.getElementById("sort-amount").addEventListener("click", function() {
  records.sort(function(a, b) { return a.amount - b.amount; });
  renderRecords();
});

// this displays all saved records in the table
function renderRecords() {
  tableBody.innerHTML = "";

  const searchValue = searchInput.value;
  let regex = null;

  try {
    regex = searchValue ? new RegExp(searchValue, "i") : null;
  } catch {
    regex = null;
  }

  const filteredRecords = records.filter(function(record) {
    if (!regex) return true;
    return regex.test(record.description);
  });

  filteredRecords.forEach(function(record) {
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
updateDashboard();

tableBody.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;
    deleteRecord(id);
  }

  if (event.target.classList.contains("edit-btn")) {
    const id = event.target.dataset.id;
    startEdit(id);
  }
});

// this loads the selected record into the form so it can be updated
function startEdit(id) {
  const record = records.find(function(r) {
    return r.id === id;
  });

  document.getElementById("description").value = record.description;
  document.getElementById("amount").value = record.amount;
  document.getElementById("category").value = record.category;
  document.getElementById("date").value = record.date;

  editingId = id;
}
// this updates an existing record's fields and refreshes its updatedAt timestamp
function updateRecord(id, description, amount, category, date) {
  records = records.map(function(record) {
    if (record.id === id) {
      record.description = description;
      record.amount = amount;
      record.category = category;
      record.date = date;
      record.updatedAt = new Date().toISOString();
    }
    return record;
  });

  saveRecords(records);
}
// this removes a record from storage and updates the table display
function deleteRecord(id) {
  records = records.filter(function(record) {
    return record.id !== id;
  });
  saveRecords(records);
  renderRecords();
  updateDashboard();
}

// this recalculates and displays total records, total spent, and top category
function updateDashboard() {
  document.getElementById("total-records").textContent = records.length;

  const totalSpent = records.reduce(function(sum, record) {
    return sum + record.amount;
  }, 0);
  document.getElementById("total-expenses").textContent = totalSpent.toFixed(2);

  const categoryTotals = {};
  records.forEach(function(record) {
    if (!categoryTotals[record.category]) {
      categoryTotals[record.category] = 0;
    }
    categoryTotals[record.category] += record.amount;
  });

  let topCategory = "None";
  let topAmount = 0;
  for (const category in categoryTotals) {
    if (categoryTotals[category] > topAmount) {
      topAmount = categoryTotals[category];
      topCategory = category;
    }
  }
  document.getElementById("top-category").textContent = topCategory;
}