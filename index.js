const mysql = require('mysql');
const { printTable } = require('console-table-printer');
const inquirer = require ('inquirer');
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
        message: "welcome to the companies content management system, please make a choice from the options below.",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "remove a department", "remove a role", "remove an employee", "update an employee role"],
        name: "options"
      },
    ]).then((answer) => {
      switch (answer.options) {
        case "view all departments":
          connection.query(
            'SELECT * FROM `departments`', function (err, results) {
              console.log("\n")
              printTable(results); 
              mainMenu();
            }
          );

          return

        case "view all roles":
          connection.query('SELECT * FROM roles', function (err, results) {
            console.log("\n")
            printTable(results);
            mainMenu();
          });
          return;

        case "view all employees":
          connection.query('SELECT * FROM employees', function (err, results) {
            console.log("\n")
            printTable(results);
            mainMenu();
          });
          return;

        case "add a department":
          addDepartment();
          return;

        case "add a role":
          addRole();
          return;

        case "add an employee":
          addEmployee();
          return;

          case "remove a department":
          deleteDepartments();
          return;

          case "remove a role":
          deleteRole();
          return;

          case "remove an employee":
          deleteEmployee();
          return;

        case "update an employee role":
          //starts the update employee's role function
          updateRole();
          return;

      }
    });
}
//defines the add department function
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "please give the new department a name",
        name: "name"
      },
    ]).then((answer) => {
      //updates the departments table with a new department
      connection.query('INSERT INTO departments SET ?',
      {
        department_name: `${answer.name}`
      })
      mainMenu()
    })
}

function addRole() {
  //gets the departments to choose from within the prompt
  connection.query('SELECT * FROM departments', function (err, departments) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "please give the new role a title",
          name: "title"
        },{
          type: "number",
          message: "please enter the salary for the new role",
          name: "salary"
        },{
          type: "list",
          message: "which department would you like to assign the role to?",
          //maps over the array of departments to display the name, with a value of the id
          choices: departments.map(department => ({ name: department.department_name, value: department.id })),
          name: "department_id"
        },
      ]).then(answers => {
        connection.query(
          //inserts the new role into the department dependent on which department was chosen, based on department id
          'INSERT INTO roles SET ?',
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.department_id,
          },
          function (err, res) {
            if (err) throw err;
            //success log
            console.log(`\nNew role ${answers.title} added to the database!\n`);
            mainMenu();
          }
        );
      });
  });
};

function addEmployee() {
  //gets the roles to choose from within the prompt
  connection.query('SELECT * FROM roles', function (err, roles) {
    if (err) throw err;
    //gets the managers to choose from within the prompt
    connection.query('SELECT * FROM employees', function (err, employees) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            message: "Please enter the first name of the new employee:",
            name: "firstName"
          },
          {
            type: "input",
            message: "Please enter the last name of the new employee:",
            name: "lastName"
          },
          {
            type: "list",
            message: "Please select the role for the new employee:",
            //maps over the array of roles to display the title of the role, with a value of the id
            choices: roles.map(role => ({ name: role.title, value: role.id })),
            name: "roleId"
          },
          {
            type: "list",
            message: "Please select the manager for the new employee:",
            //maps over the array of employees to display the names of potential managers, with a value of the id
            choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
            name: "managerId"
          }
        ])
        .then(answers => {
          connection.query(
            //updates the employee database with the new employee
            'INSERT INTO employees SET ?',
            {
              first_name: answers.firstName,
              last_name: answers.lastName,
              role_id: answers.roleId,
              manager_id: answers.managerId
            },
            function (err, res) {
              if (err) throw err;
              //success log
              console.log(`\nNew employee ${answers.firstName} ${answers.lastName} added to the database!\n`);
              mainMenu();
            }
          );
        });
    });
  });
}



function deleteDepartments() {
  //gets the departments to choose from within the prompt
  connection.query('SELECT * FROM departments', function (err, departments) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message: "which department would you like to remove??",
          //maps over the array of departments to display the name, with a value of the id
          choices: departments.map(department => ({ name: department.department_name, value: department.id })),
          name: "department_id"
        },
      ]).then(answers => {
        connection.query(
          //deletes the department dependent on which department was chosen, based on department id
          `DELETE FROM departments WHERE id = "${answers.department_id}"`,
          function (err, res) {
            if (err) throw err;
            //success log
            console.log(`\n Department removed \n`);
            mainMenu();
          }
        );
      });
  });
};


function deleteRole() {
  //gets the roles to choose from within the prompt
  connection.query('SELECT * FROM roles', function (err, roles) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message: "which role would you like to remove??",
          //maps over the array of roles to display the name, with a value of the id
          choices: roles.map(role => ({ name: role.title, value: role.id })),
          name: "role_id"
        },
      ]).then(answers => {
        connection.query(
          //deletes the role dependent on which role was chosen, based on role id
          `DELETE FROM roles WHERE id = "${answers.role_id}"`,
          function (err, res) {
            if (err) throw err;
            //success log
            console.log(`\n role removed \n`);
            mainMenu();
          }
        );
      });
  });
};


function deleteEmployee() {
  //gets the employees to choose from within the prompt
  connection.query('SELECT * FROM employees', function (err, employees) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          message: "which employee would you like to remove?",
          //maps over the array of employees to display the name, with a value of the id
          choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
          name: "employee_id"
        },
      ]).then(answers => {
        connection.query(
          //deletes the employee dependent on which employee was chosen, based on employee id
          `DELETE FROM employees WHERE id = "${answers.employee_id}"`,
          function (err, res) {
            if (err) throw err;
            //success log
            console.log(`\n employee removed \n`);
            mainMenu();
          }
        );
      });
  })
};

function updateRole() {
  //gets the employees to choose from within the prompt
  connection.query('SELECT * FROM employees', function (err, employees) {
    if (err) throw err;
    //gets the roles to choose from within the prompt
  connection.query('SELECT * FROM roles', function (err, roles) {
    if (err) throw err;
    
      inquirer
        .prompt([
          {
            type: "list",
            message: "Please select the emplyoee you'd like to update:",
            //maps over the array of employees to display choices, with a value of the employees  first name
            choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.first_name })),
            name: "employeeId"
          },
          {
            type: "list",
            message: "Please select the role for the new employee:",
            //maps over the array of roles to display potential roles, with a value of the id
            choices: roles.map(role => ({ name: role.title, value: role.id })),
            name: "roleId"
          }
          
        ])
        .then(answers => {
          connection.query(
            //updates the employees database to give an employee his new role
            `UPDATE employees SET role_id = "${answers.roleId}" WHERE first_name = "${answers.employeeId}"`,
            {
              first_name: answers.employeeId,
              role_id: answers.roleId,
            },
            function (err, res) {
              if (err) throw err;
              //success log
              console.log(`\n${answers.employeeId}'s role was updated!\n`);
              mainMenu();
            }
          );
        });
    });
  });
}
//starts the main menu function on script load
mainMenu();