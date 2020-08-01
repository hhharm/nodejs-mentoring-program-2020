// same as task 1-2 but using streams and ES6 modules
import * as fs from "fs";

const csv = require("csvtojson");
const READ_FILE = "homework-1/csv/nodejs-hw1-ex1.csv";
const WRITE_FILE = "homework-1/csv/nodejs-hw1-ex3.txt";

const rStream = fs.createReadStream(READ_FILE, "utf-8");
const wStream = fs.createWriteStream(WRITE_FILE, "utf-8");

csv().fromStream(rStream)
    .subscribe(
        writeNextChunk,
        console.error,
        endWriteStream
    )
    .then(() => console.log("Successfully converted"))
    .catch(console.error);

function writeNextChunk(chunk) {
    wStream.write(
        JSON.stringify(chunk) + "\n",
        err => err && console.error("error on write: ", err)
    );
}

function endWriteStream() {
    try {
        wStream.end();
    } catch (e) {
        console.error("error on write: ", e);
    }
}