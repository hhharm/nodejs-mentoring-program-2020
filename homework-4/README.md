- Extends homework-3.

Add Group entity to already existing REST service with CRUD operations.

Link User records in one table with Group records in another table

Add addUsersToGroup(groupId, userIds) method which will allow adding users to a certain group.Use transactions to save records in DB.

- Extends homework-4

Add express middleware which will log which service method has been invoked and which arguments have been passed to it.

Add errors log + 500 return code, unhandled exception, unhamdled promise rejection

Add error messages in all controller functions

- Extends homework-5

Add jwt authorization.

To get token send "/login" request, example: "/login?username=Olexandr&password=1996-10-20" and then send token in "n-access-token" header.

Add cors, allow all

- Extends homework-6

Add tests for user and group controllers (use Jest)

Store DB connection string in .env and pass it to app using dotenv

Tests can be started with `npm run test` command or `npm run test:watch` for watch mode
