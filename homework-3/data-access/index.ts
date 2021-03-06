import { Sequelize } from "sequelize";
import { initUserModel } from "../models/users.model";

const POSTGRES_URL =
  process.env.POSTGRES_URL || "postgres://user:Am06iya@localhost:5432/postgres";

let _db: Sequelize;
// returns true on success and false on fail
export async function initDb(): Promise<boolean> {
  if (_db) {
    console.warn("You are trying to init DB again!");
    return true;
  }
  _db = new Sequelize(POSTGRES_URL);
  try {
    await _db.authenticate();
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    return false;
  }
  console.log("Database is successfully connected.");
  initUserModel();
  return true;
}

export function getDb(): Sequelize {
  if (!_db) {
    console.error("DB has not been initialized. Please called init first.");
  }
  return _db;
}
