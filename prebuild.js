const fs = require("fs");
const env = process.argv[2]?.replace?.("-", "") || "prd";
const index = fs.readFileSync(`./config/index.${env}.js`, "utf8");

console.log("***");
console.log(`writing config file in ${env} mode`);
console.log("***");

fs.writeFileSync("./config/index.js", index);
