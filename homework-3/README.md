Simple app to keep User data and update it somehow

Folder structure:

(required)
- data-access
Everything connected to Data access (layer between models and services)

- models
DB models

- routes
api highlevel

- routes / controllers
detailed api

- services
business logic

(added by me)
- types
*.d.ts

- configs
all static data

Some architecture highlights:
! Folders are split by functions.
! One layer - one consern. Data handling, work with routing, business logic are separated and as independed as possible 
! Dependency injection is used

