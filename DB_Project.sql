create database DB_Project;
use DB_Project;

#drop database DB_Project;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	cpassword VARCHAR(100) NOT NULL
);

CREATE TABLE project (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  team_lead INT,
  status VARCHAR(255),
  FOREIGN KEY (team_lead) REFERENCES users(id)
);

CREATE TABLE issue (
  issue_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  project_id INT,
  status VARCHAR(255),
  priority VARCHAR(255),
  assignee_id INT,
  reporter_id INT,
  creation_date DATE,
  due_date DATE,
  FOREIGN KEY (project_id) REFERENCES project(id),
  FOREIGN KEY (assignee_id) REFERENCES users(id),
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);


CREATE TABLE sprint (
  sprint_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  start_date DATE,
  end_date DATE,
  goal VARCHAR(255),
  progress_status VARCHAR(255),
  FOREIGN KEY (project_id) REFERENCES project(id)
);


CREATE TABLE team (
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  team_lead_id INT,
  description VARCHAR(255),
  FOREIGN KEY (team_id) REFERENCES users(id)
);

CREATE TABLE team_member (
  team_id INT,
  user_id INT,
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES team(team_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE team_project (
  team_id INT,
  project_id INT,
  PRIMARY KEY (team_id, project_id),
  FOREIGN KEY (team_id) REFERENCES team(team_id),
  FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE workflow (
  workflow_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  project_id INT,
  issue_type VARCHAR(255),
  statuses VARCHAR(255),
  actions VARCHAR(255),
  assignee_id INT,
  creation_date DATE,
  FOREIGN KEY (project_id) REFERENCES project(id),
  FOREIGN KEY (assignee_id) REFERENCES users(id)
);

CREATE TABLE board (
  board_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  project_id INT,
  filters VARCHAR(255),
  columns VARCHAR(255),
  sort_order VARCHAR(255),
  FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE integration (
  integration_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description VARCHAR(255),
  integration_type VARCHAR(255),
  configuration_settings VARCHAR(255),
  status VARCHAR(255)
);

CREATE TABLE integration_project (
  integration_id INT,
  project_id INT,
  PRIMARY KEY (integration_id, project_id),
  FOREIGN KEY (integration_id) REFERENCES integration(integration_id),
  FOREIGN KEY (project_id) REFERENCES project(id)
);


INSERT INTO users (fname, lname, email, password, cpassword)
VALUES ('Admin', 'Bhai', 'admin@gmail.com', '123', '123'),
       ('User', 'Bhai', 'user@gmail.com', '123', '123');

INSERT INTO project (name, description, team_lead, status)
VALUES ('Project1', 'This is project 1', 1, 'active'),
       ('Project2', 'This is project 2', 2, 'inactive');

INSERT INTO issue (title, description, project_id, status, priority, assignee_id, reporter_id, creation_date, due_date)
VALUES ('Issue1', 'This is issue 1', 1, 'open', 'high', 1, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
       ('Issue2', 'This is issue 2', 2, 'closed', 'low', 2, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY));

INSERT INTO sprint (project_id, start_date, end_date, goal, progress_status)
VALUES (1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Goal for sprint 1', 'in progress'),
       (2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Goal for sprint 2', 'completed');

INSERT INTO team (name, team_lead_id, description)
VALUES ('Team1', 1, 'This is team 1'),
       ('Team2', 2, 'This is team 2');

INSERT INTO team_member (team_id, user_id)
VALUES (1, 1),
       (2, 2);

INSERT INTO team_project (team_id, project_id)
VALUES (1, 1),
       (2, 2);

INSERT INTO workflow (name, project_id, issue_type, statuses, actions, assignee_id, creation_date)
VALUES ('Workflow1', 1, 'bug', 'open', 'action1', 1, CURDATE()),
       ('Workflow2', 2, 'feature', 'closed', 'action2', 2, CURDATE());

INSERT INTO board (name, project_id, filters, columns, sort_order)
VALUES ('Board1', 1, 'filter1', 'column1', 'asc'),
       ('Board2', 2, 'filter2', 'column2', 'desc');

INSERT INTO integration (name, description, integration_type, configuration_settings, status)
VALUES ('Integration1', 'This is integration 1', 'type1', 'setting1', 'active'),
       ('Integration2', 'This is integration 2', 'type2', 'setting2', 'inactive');

INSERT INTO integration_project (integration_id, project_id)
VALUES (1, 1),
       (2, 2);

show tables;
select * from `users`;



