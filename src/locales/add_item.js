import * as fs from "fs";
import * as path from "path";
import { translate } from "@vitalets/google-translate-api";
import { fileURLToPath } from "url";
import { HttpProxyAgent } from "http-proxy-agent";

/* https://free-proxy-list.net/ */
const agent = new HttpProxyAgent("http://108.141.130.146:80");

export const resources = {
  af: "Afrikaans",
  sq: "Albanian",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaiiani",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  zh: "ChineseS",
  "zh-TW": "ChineseT",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  et: "Estonian",
  fa: "Persian",
  fi: "Finnish",
  fr: "French",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "HaitianCreole",
  ha: "Hausa",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  is: "Icelandic",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  kk: "Kazakh",
  ko: "Korean",
  lv: "Latvian",
  lt: "Lithuanian",
  mk: "Macedonian",
  ms: "Malay",
  mt: "Maltese",
  mn: "Mongolian",
  no: "Norwegian",
  pl: "Polish",
  pt: "Portuguese",
  pa: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sr: "Serbian",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  sw: "Swahili",
  sv: "Swedish",
  tl: "TagalogF",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TARGET_DIR = path.resolve(__dirname, "translations");

//change these
const NEW_KEY = "REMOVE_FROM_HEP";
const ENGLISH_TEXT = "Remove from HEP";

async function processFile(filePath, selectedLang) {
  let content = fs.readFileSync(filePath, "utf-8");

  const objectRegex = /export\s+default\s+\{([\s\S]*?)\}/m;
  const match = content.match(objectRegex);

  if (!match) {
    console.warn(`No default export object found in: ${filePath}`);
    return;
  }

  const objectBody = match[1].trim();

  // If key already exists, skip
  if (new RegExp(`${NEW_KEY}\\s*:`).test(objectBody)) {
    console.log(`Key '${NEW_KEY}' already exists in: ${filePath}`);
    return;
  }

  // Insert new key before closing }
  try {
    const NEW_VALUE = await translate(ENGLISH_TEXT, {
      to: selectedLang,
      fetchOptions: { agent },
    });
    const updatedBody =
      objectBody.endsWith(",") || objectBody === ""
        ? `${objectBody}\n  ${NEW_KEY}: "${NEW_VALUE.text}",\n`
        : `${objectBody},\n  ${NEW_KEY}: "${NEW_VALUE.text}",\n`;

    const newExport = `export default {\n  ${updatedBody}}`;

    const newContent = content.replace(objectRegex, newExport);
    fs.writeFileSync(filePath, newContent, "utf-8");
    console.log(`✅ Updated: ${filePath}`);
  } catch(err) {
    console.log(`❌ error to update: ${filePath}`, err);
  }
}
async function modifyAllFilesInDir(dirPath) {
  for (const lng in resources) {
    const filePath = path.join(dirPath, resources[lng] + ".ts");
    processFile(filePath, lng);
  }
}

modifyAllFilesInDir(TARGET_DIR);
