import { LabelValue } from "@/types";
import useLocales from "./use-locales";

export enum HoldType {
  Min = "MIN",
  Sec = "SEC",
}

export enum PerformType {
  Day = "DAY",
  Hour = "HOUR",
  Week = "WEEK",
}

export const useMockData = () => {
  const { t } = useLocales();

  const HOLD_OPTIONS: Array<LabelValue> = [
    { label: t("MIN"), value: HoldType.Min },
    { label: t("SEC"), value: HoldType.Sec },
  ];

  const PERFORM_OPTIONS: Array<LabelValue> = [
    { label: t("HOUR"), value: PerformType.Hour },
    { label: t("DAY"), value: PerformType.Day },
    { label: t("WEEK"), value: PerformType.Week },
  ];

  return {
    HOLD_OPTIONS,
    PERFORM_OPTIONS,
  };
};
