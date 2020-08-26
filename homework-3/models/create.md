# INIT TABLE COMMANDS
To create table execute this (extension is for uuid autogeneration):

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