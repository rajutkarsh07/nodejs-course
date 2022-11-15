const random = require("fs");

//synchronous way

const textIn = random.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

const textOut = `This is what we know about he avacado ${textIn} \n Created on : ${Date.now()}`;
//this will make a new file output.txt
random.writeFileSync("./txt/output.txt", textOut);
console.log("file written");

//asynchronous way
random.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("error");
  //first function will return read-this keyword
  random.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    random.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      random.writeFile(
        "./txt/final.txt",
        `${data2}\n${data3}`,
        "utf-8",
        (err) => {
          console.log("your file has been written");
        }
      );
    });
  });
});

console.log("reading file");
