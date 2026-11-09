// CommonJS: require() of built-ins goes through the same registry as import.
const path = require("path");
const { format } = require("node:util");

module.exports = {
  join: (...parts) => path.join(...parts),
  describe: (n) => format("%d items", n),
};
