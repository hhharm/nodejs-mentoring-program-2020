import { initDb } from "./data-access/index";
import { startServer } from "./start-server";
import { logger } from "./utils/logger.util";
import dotenv from "dotenv";

dotenv.config()

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

// task 5.2, p.2
process.on('uncaughtException', (err: any, origin: any) => {
  logger.error(`Caught exception: ${err}\n` +
  `Exception origin: ${origin}`);
});

// task 5.2, p.3
process.on('unhandledRejection', (error: any) => {
  logger.error('unhandledRejection', error.message);
});

main();