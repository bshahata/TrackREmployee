const mysql = require("mysql2");
const { printTable } = require("console-table-printer");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "personnel_db",
  },
  console.log(`Connected to the personnel_db database.`)
);
db.connect(() => {
  homeMenu();
});

function homeMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "home",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then(({ home }) => {
      switch (home) {
        case "view all departments":
          viewDept();
          return;

        case "view all roles":
          viewRole();
          return;

        case "view all employees":
          viewEmployee();
          return;

        case "add a department":
          addDept();
          return;

        case "add an employee":
          addEmployee();
          return;

        case "add a role":
          addRole();
          return;

        case "update an employee role":
          updateRole();
          return;
      }
    });
}

function viewDept() {
  db.query("select * from department", function (err, res) {
    if (err) throw err;
    printTable(res);
    homeMenu();
  });
}

function viewRole() {
  db.query("select * from role", function (err, res) {
    if (err) throw err;
    printTable(res);
    homeMenu();
  });
}

function viewEmployee() {
  db.query("select * from employee", function (err, res) {
    if (err) throw err;
    printTable(res);
    homeMenu();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "add a first name: ",
        name: "first_name",
      },
      {
        type: "input",
        message: "add a last name: ",
        name: "last_name",
      },
      {
        type: "input",
        message: "add a role: ",
        name: "role_id",
      },
      {
        type: "input",
        message: "add a manager: ",
        name: "manager_id",
      },
    ])
    .then(({ first_name, last_name, role_id, manager_id }) => {
      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
        [first_name, last_name, role_id, manager_id],
        function (err) {
          if (err) throw err;
          console.log("Employee added!");
          homeMenu();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "add a department id: ",
        name: "dep_id",
      },
      {
        type: "input",
        message: "add a title for the role: ",
        name: "title",
      },
      {
        type: "input",
        message: "Enter a salary: ",
        name: "salary",
      },
    ])
    .then(({ dep_id, title, salary }) => {
      db.query(
        "INSERT INTO role (dep_id, title, salary) VALUES (?,?,?)",
        [dep_id, title, salary],
        function (err) {
          if (err) throw err;
          console.log("Role added!");
          homeMenu();
        }
      );
    });
}

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "add a new department name: ",
        name: "dep_name",
      },
    ])
    .then(({ dep_name }) => {
      db.query(
        "INSERT INTO department (dep_name) VALUES (?)",
        [dep_name],
        function (err) {
          if (err) throw err;
          console.log("department added!");
          homeMenu();
        }
      );
    });
}

function updateRole() {

  db.query("select * from employee", function (err, res) {
    let employees = res;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    console.log(employeeChoices);
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeID",
          message: "Select an employee by ID to update their role: ",

          choices: employeeChoices,
        },
      ])
      .then((res) => {
        let employeeID = res.employeeID;

        db.query("select * from role", function (err, res) {
          let role = res;
          const roleChoices = role.map(({ id, title }) => ({
            name: `${title}`,
            value: id,
          }));

          console.log(roleChoices);

          inquirer
            .prompt([
              {
                type: "list",
                name: "roleID",
                message: "Select an role by ID to update their role: ",
                choices: roleChoices,
              },
            ])

            .then((res) => {
              db.query(
                "update employee set role_id =? where id =?",
                [res.roleID, employeeID],
                function (err) {
                  if (err) throw err;
                  console.log("Employee role updated!");
                  homeMenu();
                }
              );
            });
        });
      });
  });
};