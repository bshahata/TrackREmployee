const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const { printTable } = require('console-table-printer');
const chalk = require('chalk');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const schemaSql = fs.readFileSync('./db/schema.sql').toString().split(';');
const seedSql = fs.readFileSync('./db/seeds.sql').toString().split(';');

const updateQuery = [
    'SELECT department_name FROM department',
    'SELECT title FROM role',
    'SELECT first_name, last_name FROM employee',
    'SELECT distinct e1.first_name, e1.last_name FROM employee e1 INNER JOIN employee e2 ON e1.id = e2.manager_id'
];

app.get('/', (req, res) => {
    res.sendFile('./public/index.html');
});

app.get('*', (req, res) => {
    res.sendFile('./public/pages/404.html');
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});

async function init() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password'
    });

    const isRebuildDatabase = confirm('Do you want to rebuild the database?');
    if (isRebuildDatabase) {
        for (let element of schemaSql) {
            if (element.trim()) {
                await db.query(element.trim());
            }
        }
        console.log('Database has been rebuilt');

        const isSeedDatabase = confirm('Do you want to seed the database?');
        if (isSeedDatabase) {
            for (let element of seedSql) {
                if (element.trim()) {
                    await db.query(element.trim());
                }
            }
            console.log('Database has been seeded');
        }
    }

    await db.query('use workforce_db');

    while (true) {
        const mainMenuOption = prompt('What do you want to do?');

        if (mainMenuOption === 'Exit') {
            break;
        }

        let query;
        let isUpdate = false;

        switch (mainMenuOption) {
            case 'View all employees':
                query = 'SELECT * FROM employee';
                break;
            case 'View all employees by department':
                const department = prompt('Enter department name:');
                query = `SELECT * FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.department_name = '${department}'`;
                break;
            case 'View all employees by manager':
                const manager = prompt('Enter manager name:');
                query = `SELECT * FROM employee JOIN employee manager ON employee.manager_id = manager.id WHERE manager.first_name = '${manager.split(' ')[0]}' AND manager.last_name = '${manager.split(' ')[1]}'`;
                break;
            case 'Add employee':
                const firstName = prompt('Enter first name:');
                const lastName = prompt('Enter last name:');
                const role = prompt('Enter role:');
                const managerName = prompt('Enter manager name (leave blank if none):');

                let roleId;
                const [roleResult] = await db.query(`SELECT id FROM role WHERE title = '${role}'`);
                if (roleResult.length > 0) {
                    roleId = roleResult[0].id;
                } else {
                    console.log(chalk.red('Invalid role'));
                    break;
                }

                let managerId;
                if (managerName) {
                    const [managerResult] = await db.query(`SELECT id FROM employee WHERE first_name = '${managerName.split(' ')[0]}'