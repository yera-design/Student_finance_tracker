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

  // this adds the new record to the tracker and saves it to localstorage 
  addRecord(description, amount, category, date);

  form.reset();
});