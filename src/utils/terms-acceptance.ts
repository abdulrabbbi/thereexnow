import { ACCEPT_TERMS_KEY } from "./constants";

const LEGACY_ACCEPT_TERMS_KEYS = ["termsAccepted:v1", "ACCEPT_TERMS_KEY"];
const ACCEPTED_VALUES = new Set(["1", "true"]);
const ACCEPTED_STORAGE_VALUE = "1";

function isClient() {
  return typeof window !== "undefined";
}

function isAcceptedValue(value: string | null) {
  return !!value && ACCEPTED_VALUES.has(value);
}

function writeAccepted() {
  localStorage.setItem(ACCEPT_TERMS_KEY, ACCEPTED_STORAGE_VALUE);
}

export function getTermsAccepted() {
  if (!isClient()) {
    return false;
  }

  const currentValue = localStorage.getItem(ACCEPT_TERMS_KEY);

  if (isAcceptedValue(currentValue)) {
    if (currentValue !== ACCEPTED_STORAGE_VALUE) {
      writeAccepted();
    }
    return true;
  }

  for (const key of LEGACY_ACCEPT_TERMS_KEYS) {
    const legacyValue = localStorage.getItem(key);

    if (!isAcceptedValue(legacyValue)) {
      continue;
    }

    writeAccepted();
    return true;
  }

  return false;
}

export function setTermsAccepted() {
  if (!isClient()) {
    return;
  }

  writeAccepted();
}
