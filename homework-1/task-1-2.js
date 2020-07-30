const fs = require("fs");
const csv = require("csvtojson");

main().catch(console.error);

async function main() {
    const csvString = safeRun(fs.readFileSync, "homework-1/csv/nodejs-hw1-ex1.csv", {
        encoding: "utf8"
    });

    if (!csvString) {
        return;
    }

    const jsonArray = await csv().fromString(csvString);

    let fileText = "";
    jsonArray.forEach(entry => {
        fileText += JSON.stringify(entry) + "\n";
    });

    safeRun(fs.writeFileSync, "homework-1/csv/nodejs-hw1-ex2.txt", fileText);
}

function safeRun(func, ...args) {
    try {
        return func(...args);
    } catch (e) {
        console.error(e);
    }
}