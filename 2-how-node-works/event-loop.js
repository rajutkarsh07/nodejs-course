const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();

//Alone this three code will run in any manner
//setTimeout finished
//setTimmediate finished
//I/O finished
// fs.readFile("text-file.txt", () => {
//   console.log("I/O finished");
// });
// setImmediate(() => console.log("setTimmediate finished"), 0);
// setTimeout(() => console.log("setTimeout finished"), 0);

//After putting them in a callback function

fs.readFile("text-file.txt", () => {
  console.log("I/O finished");
  console.log("----------------");
  setTimeout(() => console.log("0sec setTimeout finished"), 0);
  setTimeout(() => console.log("3sec setTimeout finished"), 3000);
  setImmediate(() => console.log("setTimmediate finished"), 0);

  //the below one is synchronous
  crypto.pbkdf2Sync("utkarsh", "raj", 202020, 2000, "sha512", () => {
    console.log(Date.now() - start, "password encrypted");
  });

  crypto.pbkdf2("utkarsh", "raj", 202020, 2000, "sha512", () => {
    console.log(Date.now() - start, "password encrypted");
  });
});

console.log("top level code");
