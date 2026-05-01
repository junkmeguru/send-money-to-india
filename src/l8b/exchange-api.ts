const API_BASE = "https://api.exchangerate-api.com/v4/latest";

export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function fetchRates(baseCurrency: string): Promise<ExchangeRateResponse> {
  const res = await fetch(`${API_BASE}/${baseCurrency.toUpperCase()}`, {
    next: { revalidate: 300 }, // revalidate every 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch exchange rates: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchRateToINR(baseCurrency: string): Promise<number> {
  const data = await fetchRates(baseCurrency);
  const rate = data.rates["INR"];
  if (!rate) {
    throw new Error(`No INR rate found for ${baseCurrency}`);
  }
  return rate;
}

export async function fetchAllSupportedRates(): Promise<Record<string, number>> {
  const data = await fetchRates("USD");
  const supported = [
    "USD", "GBP", "EUR", "CAD", "AUD", "AED", "SAR", "SGD",
    "CHF", "SEK", "NOK", "DKK", "JPY", "MYR", "NZD", "QAR",
    "KWD", "OMR", "BHD",
  ];

  const usdToInr = data.rates["INR"];
  const result: Record<string, number> = {};

  for (const curr of supported) {
    if (curr === "USD") {
      result[curr] = usdToInr;
    } else {
      const usdToCurr = data.rates[curr];
      if (usdToCurr) {
        result[curr] = usdToInr / usdToCurr;
      }
    }
  }

  return result;
}
