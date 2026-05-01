export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
}

export const countries: Country[] = [
  { code: "US", name: "United States", currency: "USD", currencySymbol: "$", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£", flag: "🇬🇧" },
  { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "C$", flag: "🇨🇦" },
  { code: "AU", name: "Australia", currency: "AUD", currencySymbol: "A$", flag: "🇦🇺" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", currencySymbol: "د.إ", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", currencySymbol: "﷼", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", currency: "SGD", currencySymbol: "S$", flag: "🇸🇬" },
  { code: "DE", name: "Germany", currency: "EUR", currencySymbol: "€", flag: "🇩🇪" },
  { code: "FR", name: "France", currency: "EUR", currencySymbol: "€", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", currency: "EUR", currencySymbol: "€", flag: "🇳🇱" },
  { code: "IT", name: "Italy", currency: "EUR", currencySymbol: "€", flag: "🇮🇹" },
  { code: "ES", name: "Spain", currency: "EUR", currencySymbol: "€", flag: "🇪🇸" },
  { code: "CH", name: "Switzerland", currency: "CHF", currencySymbol: "Fr", flag: "🇨🇭" },
  { code: "SE", name: "Sweden", currency: "SEK", currencySymbol: "kr", flag: "🇸🇪" },
  { code: "NO", name: "Norway", currency: "NOK", currencySymbol: "kr", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", currency: "DKK", currencySymbol: "kr", flag: "🇩🇰" },
  { code: "JP", name: "Japan", currency: "JPY", currencySymbol: "¥", flag: "🇯🇵" },
  { code: "MY", name: "Malaysia", currency: "MYR", currencySymbol: "RM", flag: "🇲🇾" },
  { code: "NZ", name: "New Zealand", currency: "NZD", currencySymbol: "NZ$", flag: "🇳🇿" },
  { code: "QA", name: "Qatar", currency: "QAR", currencySymbol: "﷼", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", currency: "KWD", currencySymbol: "د.ك", flag: "🇰🇼" },
  { code: "OM", name: "Oman", currency: "OMR", currencySymbol: "﷼", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain", currency: "BHD", currencySymbol: "د.ب", flag: "🇧🇭" },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find((c) => c.code === code.toUpperCase());
};

export const getCountryByCurrency = (currency: string): Country | undefined => {
  return countries.find((c) => c.currency === currency.toUpperCase());
};
