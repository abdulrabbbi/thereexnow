import { I18_NEXT_LANG_KEY } from "@/utils/constants";
import { getCookie } from "@/utils/storage/cookieStorage";
import { useTranslation } from "react-i18next";

export const LANGS = [
  { value: "en", label: "English" },
  { value: "af", label: "Afrikaans" },
  { value: "sq", label: "Albanian" },
  { value: "ar", label: "Arabic" },
  { value: "az", label: "Azerbaiiani" },
  { value: "bn", label: "Bengali" },
  { value: "bs", label: "Bosnian" },
  { value: "bg", label: "Bulgarian" },
  { value: "ca", label: "Catalan" },
  { value: "zh-CN", label: "ChineseS" },
  { value: "zh-TW", label: "ChineseT" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "et", label: "Estonian" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "gu", label: "Gujarati" },
  { value: "ht", label: "HaitianCreole" },
  { value: "ha", label: "Hausa" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hu", label: "Hungarian" },
  { value: "is", label: "Icelandic" },
  { value: "id", label: "Indonesian" },
  { value: "ga", label: "Irish" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "kk", label: "Kazakh" },
  { value: "ko", label: "Korean" },
  { value: "lt", label: "Lithuanian" },
  { value: "mk", label: "Macedonian" },
  { value: "ms", label: "Malay" },
  { value: "mt", label: "Maltese" },
  { value: "mn", label: "Mongolian" },
  { value: "no", label: "Norwegian" },
  { value: "fa", label: "Persian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "pa", label: "Punjabi" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "sr", label: "Serbian" },
  { value: "sk", label: "Slovak" },
  { value: "sl", label: "Slovenian" },
  { value: "so", label: "Somali" },
  { value: "es", label: "Spanish" },
  { value: "sw", label: "Swahili" },
  { value: "sv", label: "Swedish" },
  { value: "tl", label: "TagalogF" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "uz", label: "Uzbek" },
  { value: "vi", label: "Vietnamese" },
  { value: "cy", label: "Welsh" },
];

export default function useLocales() {
  const { i18n, t } = useTranslation();

  const langStorage = getCookie(I18_NEXT_LANG_KEY);

  const currentLang =
    LANGS.find((_lang) => _lang.value === langStorage) || LANGS[0];

  const handleChangeLanguage = (newlang: string) => {
    i18n.changeLanguage(newlang);
  };

  return {
    t,
    i18n,
    currentLang,
    allLang: LANGS,
    onChangeLang: handleChangeLanguage,
  };
}
