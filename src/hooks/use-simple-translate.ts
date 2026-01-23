import { useTranslator_TranslateMutation } from "@/graphql/generated";
import useLocales from "./use-locales";

export default function useSimpleTranslate() {
  const { currentLang } = useLocales();
  const { mutateAsync, isPending } = useTranslator_TranslateMutation();

  const fetchTranslation = async (
    text: string,
    fromLanguage?: string,
    toLanguage?: string
  ) => {
    try {
      if (!text?.trim()) return text;
      const res = await mutateAsync({
        input: {
          text,
          fromLanguage: fromLanguage ?? "en",
          toLanguage: toLanguage ?? currentLang.value,
        },
      });
      return res.translator_translate?.result || text;
    } catch {
      return text;
    }
  };

  const translateAll = async (
    data: string[],
    callback: (data: string[]) => void,
    fromLanguage?: string,
    toLanguage?: string
  ) => {
    try {
      const results = await fetchTranslation(
        data.join(" ********* ") || "",
        fromLanguage,
        toLanguage
      );
      callback?.(results?.split(" ********* ") || data);
    } catch (err) {
      return data;
    }
  };

  return { translateAll, isPending };
}
