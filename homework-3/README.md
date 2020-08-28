Simple app to keep User data and update it somehow.

Folder structure:

- data-access

connection with DB, etc

- models

DB models (scheme, model creation)

- routes

api highlevel

- routes / controllers

detailed request processing

- services

business logic (used in controller, uses DB models)

- types

*.d.ts

Some architecture highlights:
! Folders are split by functions.
! One layer - one consern. Data handling, work with routing, business logic are separated and as independed as possible

And there is very dumb mistakes handling, only req verification and not found are checked. Everything else return 500