import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

import en from "../locales/en/common.json";
import de from "../locales/de/common.json";

const translations = { en, de };

export const useTranslation = () => {
  const { lang } = useContext(LanguageContext);

  const t = (key) => {
    return key
      .split(".")
      .reduce((obj, i) => obj?.[i], translations[lang]) || key;
  };

  return { t };
};