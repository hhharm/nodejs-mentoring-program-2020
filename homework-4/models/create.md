# INIT USERS TABLE COMMANDS
To create users table execute this (extension is for uuid autogeneration):

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  login VARCHAR(50) NOT NULL,
  "password"  VARCHAR(50) NOT NULL,
  age INT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (id),
  UNIQUE(login)
);

INSERT INTO users 
    (login, "password", age, is_deleted) 
VALUES 
    ('Olga', '1995-09-25', 24, false),
    ('Olexandr', '1996-10-20',23, false),
    ('Ameliya', '2012-02-06', 8, false),
	('Valeriy', '1965-11-12', 55, false),
	('Alla', '1972-09-06', 48, false),
	('Svetlana', '1994-12-03', 25, false),
	('Marina', '1999-07-09', 21, false),
    ('Tatiana', 'geo11B', 65, true);

# INIT GROUP TABLE COMMANGS

CREATE TABLE groups (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  permissions jsonb not null default '[]'::jsonb,
  PRIMARY KEY (id),
  UNIQUE(name)
);

INSERT INTO groups 
    (id, name, permissions) 
VALUES 
    ('e335940c-0816-462f-90d1-06de3c08cb8f', 'user', '["READ","WRITE","SHARE"]'),
    ('bc616c26-4e76-4c44-813f-9cb4e925ed34', 'administrator', '["READ","WRITE","DELETE","SHARE","UPLOAD_FILES"]'),
    ('9f09ed80-094e-45ce-98b0-285668d4e913', 'spy', '["READ"]'),
    ('176dcb3d-5de4-4b76-abe8-30382d7195d5', 'tester', '["READ","WRITE","DELETE","SHARE","UPLOAD_FILES"]'),
    ('181829cc-4c35-4ea8-981d-4ecb99025b24', 'bot', '["READ","UPLOAD_FILES"]');