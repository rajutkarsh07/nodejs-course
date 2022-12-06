const random = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

///////////////////////////////
/////////////Files
///////////////////////////////

//synchronous way

// const textIn = random.readFileSync("./txt/input.txt", "utf-8");
// // console.log(textIn);

// const textOut = `This is what we know about he avacado ${textIn} \n Created on : ${Date.now()}`;
// //this will make a new file output.txt
// random.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

// //asynchronous way
// random.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("error");
//   //first function will return read-this keyword
//   random.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     random.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       random.writeFile(
//         "./txt/final.txt",
//         `${data2}\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("your file has been written");
//         }
//       );
//     });
//   });
// });

// console.log("reading file");

///////////////////
//SERVER
///////////////////

const tempOverview = random.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = random.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = random.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = random.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((e) => slugify(e.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  //console.log(req); //this will print request object
  //res.end("hello i am server"); //to print result

  const { query, pathname } = url.parse(req.url, true);

  //Overview page

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj.map((e) => replaceTemplate(tempCard, e)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    // console.log(cardsHtml)
    // res.end(tempOverview);
    // console.log(output)
    res.end(output);

    //Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    // random.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    // const productData = JSON.parse(data);
    // console.log(productData);
    // res.end(data);
    // });
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      //to add 404 error in the developer tools
      "Content-type-sdfa": "tect/htm",
      "koi-bhi-header": "utkarsh-world",
    });
    res.end("<h1>fuck off, page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000"); //hello i am server will be printed on 127.0.0.1:800 port
});
