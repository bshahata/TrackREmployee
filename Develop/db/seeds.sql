INSERT INTO departments (id, department_name)
VALUES
  (001, 'Logistics'),
  (002, 'Accounting'),
  (003, 'Sales'),
  (004, 'Management');

INSERT INTO roles (id, title, salary, department_id)
VALUES
  (001, 'Logistics Coordinator', 55000, 001),
  (002, 'Accounting Specialist', 45000, 002),
  (003, 'Sales Representative', 40000, 003),
  (004, 'Customer Service Associate', 35000, 004),
  (005, 'Human Resources Manager', 50000, 004),
  (006, 'Warehouse Supervisor', 30000, 001),
  (007, 'Warehouse Associate', 20000, 001),
  (008, 'Sales Manager', 55000, 003);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES
  (001, 'Rachel', 'Garcia', 001, NULL),
  (002, 'David', 'Jones', 008, 002),
  (003, 'Brian', 'Lee', 001, 002),
  (004, 'Christine', 'Nguyen', 001, 002),
  (005, 'Melissa', 'Wong', 001, 002),
  (006, 'Andrew', 'Liu', 002, 001),
  (007, 'Oliver', 'Zhang', 002, 006),
  (008, 'Kevin', 'Chen', 002, 006),
  (009, 'Ashley', 'Kim', 004, NULL),
  (010, 'Katie', 'Taylor', 001, 002),
  (011, 'Tony', 'Smith', 005, NULL),
  (012, 'Julia', 'Lee', 005, NULL),
  (013, 'Michael', 'Nguyen', 004, 009),
  (014, 'Emily', 'Johnson', 004, 009),
  (015, 'Jonathan', 'Lopez', 006, NULL),
  (016, 'Sarah', 'Wilson', 007, 015);