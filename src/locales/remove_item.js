import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TARGET_DIR = path.resolve(__dirname, "translations");

//change these
const KEY = "Add_New_Workout";

async function processFile(filePath, selectedLang) {
  let content = fs.readFileSync(filePath, "utf-8");

  const objectRegex = /export\s+default\s+\{([\s\S]*?)\}/m;
  const match = content.match(objectRegex);

  if (!match) {
    console.warn(`No default export object found in: ${filePath}`);
    return;
  }
  let objectBody = match[1];
  const keyRegex = new RegExp(`\\s*${KEY}\\s*:\\s*(".*?"|'.*?'),?\\n?`, "g");

  if (!keyRegex.test(objectBody)) {
    console.log(`Key "${KEY}" not found in: ${filePath}`);
    return;
  }

  // Remove the key from object body
  objectBody = objectBody.replace(keyRegex, "");

  // Clean up possible trailing comma before the closing }
  objectBody = objectBody
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  // Reconstruct the content
  const newContent = `export default {\n${objectBody}\n};\n`;

  // Write back to the file
  fs.writeFileSync(filePath, newContent, "utf-8");
  console.log(`Updated: ${filePath}`);
}
async function modifyAllFilesInDir(dirPath) {
  let files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    processFile(filePath);
  }
}

modifyAllFilesInDir(TARGET_DIR);
