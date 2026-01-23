export const ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";

export const ACCEPT_TERMS_KEY = "ACCEPT_TERMS_KEY";

export const CHECKOUT_KEY = "CHECKOUT_KEY";

export const I18_NEXT_LANG_KEY = "i18nextLng";

export const TRANSLATE_SEPARATOR = "|@|";

export const PRINT_PAGE_STYLE = `
    @page {
        size: auto;
        margin: 0;
        padding: 7mm;
    }
    @media print {
        body {
            padding: 10mm;
            margin: 10mm;
            width: 100% !important;
            height: auto !important;
        }
        .print-container {
            padding: 5mm;
        }
        .no-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .page-break {
            page-break-after: always;
            break-after: page;
        }
    }
    body {
        padding:5mm;
        margin: 0;
    }
`;

export const SUBSCRIPTIONS = [
  {
    title: "Warm Up",
    features: [
      "Access to 1,000s of exercises and other educational content",
      "2 Saved routines",
      "Print HEPs",
    ],
  },
  {
    title: "Ready, Set, Go!",
    features: [
      "Access to 1,000s of exercises and other educational content",
      "Unlimited saved routines",
      "Print TherEXnow HEP",
      "Printed TherEXnow to show a QR Code for patient scanning",
      "Email delivery of TherEXnow HEP",
      "SMS text delivery TherEXnow HEP",
      "QR code delivery of TherEXnow HEP via screen display",
    ],
  },
];
