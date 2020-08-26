import { Sequelize } from "sequelize";
import { UsersModel } from "../models/users.model";

const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://user:pass@example.com:5432/dbname";

export const sequelize = new Sequelize(POSTGRES_URL);

sequelize.authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch(err => console.error("Unable to connect to the database:", err));

//function because compiler says i cannot use await 
// outside functions if I don't set es version to esnext.
// Not sure if this works like I planned (really awaits)
(async function syncModel() {
    await UsersModel.sync({ alter: true })
})();