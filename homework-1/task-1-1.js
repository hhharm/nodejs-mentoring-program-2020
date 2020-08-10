/** A program which reads a string from the standard input stdin,
 *  reverses it and then writes it to the standard output stdout. */

const stdinStream = process.stdin;

stdinStream.setEncoding("utf-8");

console.log("Waiting for input...");
stdinStream.on("data", (str) => {
    console.log("Reversed line: ", str.split("").reverse().join(""));
    console.log("\nWaiting for input...");
});