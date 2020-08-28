import { initDb } from "./data-access/index";
import { startServer } from "./routes/start-server";

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

//Question: 

// how to organize DI (orm model + controller)? 
// I tried to pass UsersModel into constructor but it did not work

// how to write errors handling? now it looks terrible =( (look in user.routes)

// did I lose data mapping ? Shouldn't I map UsersModel -> User somewhere?

// did I get the meaning of folders properly? (data-access, routes, services, models, etc)
