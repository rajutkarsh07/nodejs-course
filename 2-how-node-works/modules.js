// console.log(arguments);
// console.log(require("module").wrapper);

//module.exports
const Calc = require("./test-module-1");
const calc1 = new Calc();
console.log(calc1.add(4, 9));

//exports
// const calc2 = require("./test-module-2");
// console.log(calc2.add(4, 9));
// console.log(calc2.multiply(4, 9));

const { add, multiply, divide } = require("./test-module-2");
console.log(multiply(4, 5));

//caching
// only the code which is exported will run 3 more times
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
