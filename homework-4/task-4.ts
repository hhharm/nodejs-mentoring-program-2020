import { initDb } from "./data-access/index";
import { startServer } from "./start-server";

async function main() {
  let db = await initDb();
  if (!db) {
    console.warn("DB connect has failed. Trying to init DB again");
    db = await initDb();
    if (!db) {
      console.error("Cannot connect to DB! Exiting");
      return;
    }
  }
  startServer();
}

main();