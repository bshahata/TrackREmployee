const mysql = require('mysql2');
const consoleTablePrinter = require('console-table-printer');
const inquirer = require('./node_modules/inquirer');

require('dotenv').config();

const connection = mysql.createConnection({
host: 'localhost',
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});


function mainMenu() {

inquirer

.prompt([
{

type: "list",
message: "Welcome to the companies content management system, please make a choice from the options below.",
choices: [
"View All Departments",
"View All Roles",
"View All Employees",
"Add A Department",
"Add A Role",
"Add An Employee",
"Remove A Department",
"Remove A Role",
"Remove An Employee",
"Update An Employee Role"
],
name: "options"
}
])
// extracting the chosen answer
.then(answer => {
// switch case statement for the answers
switch (answer.options) {
case "View All Departments":
// querying the connected database
connection.query(
// returns all departments
'SELECT * FROM departments',
(err, results) => {
// console logs a line break for space
console.log("\n");
// prints the departments
consoleTablePrinter(results);
// returns to the main menu upon display of the departments
mainMenu();
}
);

javascript
Copy code
      return;

    case "View All Roles":
    
      connection.query('SELECT * FROM roles', (err, results) => {
        console.log("\n");
        consoleTablePrinter(results);
        mainMenu();
      });
      return;

    case "View All Employees":
      // returns all employees
      connection.query('SELECT * FROM employees', (err, results) => {
        console.log("\n");
        consoleTablePrinter(results);
        mainMenu();
      });
      return;

    case "Add A Department":
      // starts the add department function
      addDepartment();
      return;

    case "Add A Role":
      // starts the add role function
      addRole();
      return;

    case "Add An Employee":
      // starts the add employee function
      addEmployee();
      return;

    case "Remove A Department":
      // starts the delete department function
      deleteDepartments();
      return;

    case "Remove A Role":
      // starts the delete role function
      deleteRole();
      return;

    case "Remove An Employee":
      // starts the delete employee function
      deleteEmployee();
      return;

    case "Update An Employee Role":
      // starts the update employee's role function
      updateRole();
      return;
  }
});
}

// defines the add department function
function addDepartment() {
inquirer
.prompt([
{
type: "input",
message: "Please give the new department a name",
name: "name"
}
])
.then(answer => {
// updates the departments table with a new department
connection.query(
'INSERT INTO departments SET ?',
{
department_name: ${answer.name}
}
);
// logs success message
console.log(\nNew department ${answer.name} added to the database!\n);
mainMenu();
});
}

// defines the add role function
function addRole()




