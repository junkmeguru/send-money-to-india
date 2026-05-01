export interface Provider {
  id: string;
  name: string;
  logo: string;
  website: string;
  affiliateUrl: string;
}

export interface RateInfo {
  providerId: string;
  rate: number;
  fee: number;
  feeType: "fixed" | "percentage";
  speed: string;
  minAmount: number;
  maxAmount: number;
  rating: number;
  recommended?: boolean;
}

export interface Corridor {
  fromCurrency: string;
  toCurrency: string;
  rates: RateInfo[];
  updatedAt: string;
}

// NOTE: Replace the affiliateUrl values below with your actual tracking links.
// Sign up for each provider's affiliate/referral program and paste your unique links here.
export const providers: Provider[] = [
  {
    id: "wise",
    name: "Wise",
    logo: "wise",
    website: "https://wise.com",
    affiliateUrl: "https://wise.com/invite?ref=YOUR_WISE_REF_ID",
  },
  {
    id: "remitly",
    name: "Remitly",
    logo: "remitly",
    website: "https://remitly.com",
    affiliateUrl: "https://remitly.com?referral=YOUR_REMITLY_REF_ID",
  },
  {
    id: "xoom",
    name: "Xoom",
    logo: "xoom",
    website: "https://xoom.com",
    affiliateUrl: "https://xoom.com?referral=YOUR_XOOM_REF_ID",
  },
  {
    id: "westernunion",
    name: "Western Union",
    logo: "wu",
    website: "https://westernunion.com",
    affiliateUrl: "https://westernunion.com?referral=YOUR_WU_REF_ID",
  },
  {
    id: "moneygram",
    name: "MoneyGram",
    logo: "mg",
    website: "https://moneygram.com",
    affiliateUrl: "https://moneygram.com?referral=YOUR_MG_REF_ID",
  },
  {
    id: "instarem",
    name: "Instarem",
    logo: "instarem",
    website: "https://instarem.com",
    affiliateUrl: "https://instarem.com?referral=YOUR_INSTAREM_REF_ID",
  },
  {
    id: "worldremit",
    name: "WorldRemit",
    logo: "wr",
    website: "https://worldremit.com",
    affiliateUrl: "https://worldremit.com?referral=YOUR_WR_REF_ID",
  },
  {
    id: "panda",
    name: "Panda Remit",
    logo: "panda",
    website: "https://pandaremit.com",
    affiliateUrl: "https://pandaremit.com?referral=YOUR_PANDA_REF_ID",
  },
];

// Provider margins (how much worse than mid-market their rate is)
// These are realistic averages based on public data
const providerMargins: Record<
  string,
  { margin: number; fee: number; feeType: "fixed" | "percentage"; speed: string; min: number; max: number; rating: number; recommended?: boolean }
> = {
  wise: { margin: 0.005, fee: 0, feeType: "fixed", speed: "1-2 days", min: 1, max: 1000000, rating: 4.7, recommended: true },
  remitly: { margin: 0.008, fee: 0, feeType: "fixed", speed: "3-5 days", min: 0, max: 999999, rating: 4.5 },
  xoom: { margin: 0.025, fee: 2.99, feeType: "fixed", speed: "Minutes", min: 10, max: 10000, rating: 4.2 },
  westernunion: { margin: 0.02, fee: 0, feeType: "fixed", speed: "Minutes", min: 0, max: 50000, rating: 4.0 },
  moneygram: { margin: 0.03, fee: 1.99, feeType: "fixed", speed: "Minutes", min: 1, max: 10000, rating: 3.9 },
  instarem: { margin: 0.006, fee: 0, feeType: "fixed", speed: "1-2 days", min: 200, max: 50000, rating: 4.4 },
  worldremit: { margin: 0.018, fee: 1.99, feeType: "fixed", speed: "1-3 days", min: 1, max: 50000, rating: 4.1 },
  panda: { margin: 0.007, fee: 0, feeType: "fixed", speed: "1-2 days", min: 100, max: 100000, rating: 4.3 },
};

export function buildCorridor(fromCurrency: string, baseRate: number): Corridor {
  const rates: RateInfo[] = providers.map((provider) => {
    const config = providerMargins[provider.id];
    // Apply provider margin to base rate (worse rate = lower number)
    const rate = baseRate * (1 - config.margin);
    return {
      providerId: provider.id,
      rate,
      fee: config.fee,
      feeType: config.feeType,
      speed: config.speed,
      minAmount: config.min,
      maxAmount: config.max,
      rating: config.rating,
      recommended: config.recommended,
    };
  });

  return {
    fromCurrency: fromCurrency.toUpperCase(),
    toCurrency: "INR",
    rates,
    updatedAt: new Date().toISOString(),
  };
}

export function calculateReceiveAmount(
  sendAmount: number,
  rate: number,
  fee: number,
  feeType: "fixed" | "percentage"
): number {
  const totalFee = feeType === "percentage" ? sendAmount * (fee / 100) : fee;
  const amountAfterFee = Math.max(0, sendAmount - totalFee);
  return amountAfterFee * rate;
}

export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}
