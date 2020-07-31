// same as task 1-2 but using streams and ES6 modules
import * as fs from "fs";

const csv = require("csvtojson");
const READ_FILE = "homework-1/csv/nodejs-hw1-ex1.csv";
const WRITE_FILE = "homework-1/csv/nodejs-hw1-ex3.txt";

const rStream = fs.createReadStream(READ_FILE, "utf-8");
const wStream = fs.createWriteStream(WRITE_FILE, "utf-8");

let file = "";
rStream.on("data", async (chunk) => {
    file += chunk;
});

rStream.on("end", async () => {
    const jsonArray = await csv().fromString(file);
    try {
        // Write back something interesting to the user:
        jsonArray.forEach(entry => {
            wStream.write(
                JSON.stringify(entry) + "\n",
                err => err && console.error("error on write: ", err)
            );
        });
        wStream.end();
    } catch (err) {
        console.error("error on write: ", err);
    }
});

rStream.on("error", err => console.error("error on read: ", err));