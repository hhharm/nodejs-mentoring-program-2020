"use strict";

var fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// same as task 1-2 but using streams and ES6 modules
const csv = require("csvtojson");

const READ_FILE = "homework-1/csv/nodejs-hw1-ex1.csv";
const WRITE_FILE = "homework-1/csv/nodejs-hw1-ex3.txt";
const rStream = fs.createReadStream(READ_FILE, "utf-8");
const wStream = fs.createWriteStream(WRITE_FILE, "utf-8");
csv().fromStream(rStream).subscribe(writeNextChunk, console.error, endWriteStream).then(() => console.log("Successfully converted")).catch(console.error);

function writeNextChunk(chunk) {
  wStream.write(JSON.stringify(chunk) + "\n", err => err && console.error("error on write: ", err));
}

function endWriteStream() {
  try {
    wStream.end();
  } catch (e) {
    console.error("error on write: ", e);
  }
}