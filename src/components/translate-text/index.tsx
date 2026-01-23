import { useTranslator_TranslateMutation } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { Skeleton } from "@mui/material";
import { ReactNode, useEffect } from "react";

export default function TranslateText({ children }: { children: ReactNode  }) {
  const { currentLang } = useLocales();
  const text = typeof children === "string" ? children : String(children);

  const { mutate, isPending, data } = useTranslator_TranslateMutation();

  useEffect(() => {
    if (currentLang.value !== "en" && !!text)
      mutate({
        input: {
          fromLanguage: "en",
          text: text,
          toLanguage: currentLang.value,
        },
      });
  }, [currentLang, text]);

  return (
    <>
      {currentLang.value === "en"
        ? text
        : isPending
          ? <Skeleton  />
          : data?.translator_translate?.result || text}
    </>
  );
}
