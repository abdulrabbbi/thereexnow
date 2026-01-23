import { I18_NEXT_LANG_KEY } from "@/utils/constants";
import { getCookie } from "@/utils/storage/cookieStorage";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import Afrikaans from "./translations/Afrikaans";
import Albanian from "./translations/Albanian";
import Arabic from "./translations/Arabic";
import Armenian from "./translations/Armenian";
import Azerbaiiani from "./translations/Azerbaiiani";
import Bengali from "./translations/Bengali";
import Bosnian from "./translations/Bosnian";
import Bulgarian from "./translations/Bulgarian";
import Catalan from "./translations/Catalan";
import ChineseS from "./translations/ChineseS";
import ChineseT from "./translations/ChineseT";
import Croatian from "./translations/Croatian";
import Czech from "./translations/Czech";
import Danish from "./translations/Danish";
import Dutch from "./translations/Dutch";
import English from "./translations/English";
import Estonian from "./translations/Estonian";
import Finnish from "./translations/Finnish";
import French from "./translations/French";
import German from "./translations/German";
import Greek from "./translations/Greek";
import Gujarati from "./translations/Gujarati";
import HaitianCreole from "./translations/HaitianCreole";
import Hausa from "./translations/Hausa";
import Hebrew from "./translations/Hebrew";
import Hindi from "./translations/Hindi";
import Hungarian from "./translations/Hungarian";
import Icelandic from "./translations/Icelandic";
import Indonesian from "./translations/Indonesian";
import Irish from "./translations/Irish";
import Italian from "./translations/Italian";
import Japanese from "./translations/Japanese";
import Kazakh from "./translations/Kazakh";
import Korean from "./translations/Korean";
import Latvian from "./translations/Latvian";
import Lithuanian from "./translations/Lithuanian";
import Macedonian from "./translations/Macedonian";
import Malay from "./translations/Malay";
import Maltese from "./translations/Maltese";
import Mongolian from "./translations/Mongolian";
import Norwegian from "./translations/Norwegian";
import Persian from "./translations/Persian";
import Polish from "./translations/Polish";
import Portuguese from "./translations/Portuguese";
import Punjabi from "./translations/Punjabi";
import Romanian from "./translations/Romanian";
import Russian from "./translations/Russian";
import Serbian from "./translations/Serbian";
import Slovak from "./translations/Slovak";
import Slovenian from "./translations/Slovenian";
import Somali from "./translations/Somali";
import Spanish from "./translations/Spanish";
import Swahili from "./translations/Swahili";
import Swedish from "./translations/Swedish";
import TagalogF from "./translations/TagalogF";
import Turkish from "./translations/Turkish";
import Ukrainian from "./translations/Ukrainian";
import Urdu from "./translations/Urdu";
import Uzbek from "./translations/Uzbek";
import Vietnamese from "./translations/Vietnamese";
import Welsh from "./translations/Welsh";

let lng = "English";

lng = getCookie(I18_NEXT_LANG_KEY) || "en";

export const resources = {
  af: { translations: Afrikaans },
  sq: { translations: Albanian },
  ar: { translations: Arabic },
  hy: { translations: Armenian },
  az: { translations: Azerbaiiani },
  bn: { translations: Bengali },
  bs: { translations: Bosnian },
  bg: { translations: Bulgarian },
  ca: { translations: Catalan },
  zh: { translations: ChineseS },
  "zh-TW": { translations: ChineseT },
  hr: { translations: Croatian },
  cs: { translations: Czech },
  da: { translations: Danish },
  nl: { translations: Dutch },
  en: { translations: English },
  et: { translations: Estonian },
  fa: { translations: Persian },
  fi: { translations: Finnish },
  fr: { translations: French },
  de: { translations: German },
  el: { translations: Greek },
  gu: { translations: Gujarati },
  ht: { translations: HaitianCreole },
  ha: { translations: Hausa },
  he: { translations: Hebrew },
  hi: { translations: Hindi },
  hu: { translations: Hungarian },
  is: { translations: Icelandic },
  id: { translations: Indonesian },
  ga: { translations: Irish },
  it: { translations: Italian },
  ja: { translations: Japanese },
  kk: { translations: Kazakh },
  ko: { translations: Korean },
  lv: { translations: Latvian },
  lt: { translations: Lithuanian },
  mk: { translations: Macedonian },
  ms: { translations: Malay },
  mt: { translations: Maltese },
  mn: { translations: Mongolian },
  no: { translations: Norwegian },
  pl: { translations: Polish },
  pt: { translations: Portuguese },
  pa: { translations: Punjabi },
  ro: { translations: Romanian },
  ru: { translations: Russian },
  sr: { translations: Serbian },
  sk: { translations: Slovak },
  sl: { translations: Slovenian },
  so: { translations: Somali },
  es: { translations: Spanish },
  sw: { translations: Swahili },
  sv: { translations: Swedish },
  tl: { translations: TagalogF },
  tr: { translations: Turkish },
  uk: { translations: Ukrainian },
  ur: { translations: Urdu },
  uz: { translations: Uzbek },
  vi: { translations: Vietnamese },
  cy: { translations: Welsh },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng,
    debug: false,
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18n;
