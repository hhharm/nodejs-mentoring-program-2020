/** A program which reads a string from the standard input stdin,
 *  reverses it and then writes it to the standard output stdout. */

const stdinStream = process.stdin;

stdinStream.setEncoding("utf-8");

console.log("Waiting for input...");
stdinStream.on("data", reverseLine);

function reverseLine(str) {
    const stringWithoutLineEnd = str.replace(/[\r\n]/g, "");
    const charArray = stringWithoutLineEnd.split("");

    for (let i = 0; i < charArray.length / 2; i++) {
        swap(charArray, i, charArray.length - i - 1);
    }

    console.log("Reversed line: ", charArray.join(""));
    console.log("\nWaiting for input...");
}

function swap(arr, i, j) {
    const tmp = arr[j];
    arr[j] = arr[i];
    arr[i] = tmp;
}

//question 1: is there better ways to read stdin?
//question 2: am I supposed to write functions myself or usage of libraries (e.g. lodash) is preferable?