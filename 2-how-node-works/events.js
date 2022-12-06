const EventEmitter = require("events");
const http = require("http");

const myEmitter = new EventEmitter();

myEmitter.on("newSale", () => {
  console.log("there was a new sale");
});

myEmitter.on("newSale", () => {
  console.log("utkarsh raj");
});

myEmitter.on("newSale", (hello) => {
  console.log(`this will print the value of hello ${hello} `);
});

myEmitter.emit("newSale", 8);

///////////////////

//on means listening to some events

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received");
  res.end("1st request received");
});

server.on("request", (req, res) => {
  console.log("one more request");
});

server.on("close", () => {
  console.log("server closed");
});

// server.listen(8000);
server.listen(8000, "127.0.0.1", () => {
  console.log("server is starting...");
});
