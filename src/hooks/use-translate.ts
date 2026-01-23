import { useTranslator_TranslateMutation } from "@/graphql/generated";
import { I18_NEXT_LANG_KEY, TRANSLATE_SEPARATOR } from "@/utils/constants";
import { getCookie } from "@/utils/storage/cookieStorage";
import { useMemo } from "react";
import { LANGS } from "./use-locales";
import { useUser } from "./use-user";

type TranslateOptions = {
  convert?: boolean;
  language?: string;
  fromLanguage?:string
};

export function useTranslate() {
  const { userData } = useUser();

  const userLang = userData?.language;

  const langStorage = getCookie(I18_NEXT_LANG_KEY);

  const { mutateAsync, isPending } = useTranslator_TranslateMutation();

  const currentLanguage = useMemo(() => {
    const userLangAbbr =
      userLang && LANGS.find((el) => el.value === userData.language)?.value;

    const storageLangAbbr =
      langStorage && LANGS.find((el) => el.value === langStorage)?.value;

    return storageLangAbbr ?? userLangAbbr ?? "en";
  }, [userLang, langStorage]);

  const onTranslate = async (text: string, options?: TranslateOptions) => {
    const convert = options?.convert ?? true;

    if (!text.length) {
      return;
    }

    const res = await mutateAsync({
      input: {
        text,
        fromLanguage: options?.fromLanguage || "en",
        toLanguage: options?.language ?? currentLanguage,
      },
    });

    return convert
      ? (res?.translator_translate?.result?.split(
          TRANSLATE_SEPARATOR
        ) as Array<string>)
      : (res?.translator_translate?.result as string);
  };

  return {
    translate: onTranslate,
    isTranslating: isPending,
  };
}
