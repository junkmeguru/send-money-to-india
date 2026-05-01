import { headers } from "next/headers";
import { Calculator } from "@/components/forex/calculator";
import { Globe, Shield, TrendingUp } from "lucide-react";
import { fetchAllSupportedRates } from "@/lib/exchange-api";
import { buildCorridor, type Corridor } from "@/lib/rates";
import { countries } from "@/lib/countries";

async function detectCountryCode(): Promise<string | undefined> {
  const h = await headers();
  const countryHeader =
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    h.get("x-country-code");

  if (countryHeader) {
    return countryHeader.toUpperCase();
  }

  const acceptLang = h.get("accept-language");
  if (acceptLang) {
    const primary = acceptLang.split(",")[0];
    const region = primary.split("-")[1];
    if (region) return region.toUpperCase();
  }

  return undefined;
}

export default async function Home() {
  const countryCode = await detectCountryCode();

  let corridors: Record<string, Corridor> = {};
  let lastUpdated = new Date().toISOString();

  try {
    const rates = await fetchAllSupportedRates();
    lastUpdated = new Date().toISOString();

    for (const country of countries) {
      const baseRate = rates[country.currency];
      if (baseRate) {
        corridors[country.currency] = buildCorridor(country.currency, baseRate);
      }
    }
  } catch {
    // If API fails, fall back to empty — Calculator will show a message
    corridors = {};
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">SendMoneyToIndia</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#compare" className="hover:text-foreground transition-colors">Compare</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Send More to India.
            <br />
            <span className="text-primary">Pay Less in Fees.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare real-time exchange rates and fees from trusted remittance
            providers. Find the best way to transfer money to India in seconds.
          </p>
        </section>

        <section id="compare" className="mb-16 md:mb-24">
          <Calculator
            initialCountryCode={countryCode}
            corridors={corridors}
            lastUpdated={lastUpdated}
          />
        </section>

        <section id="how-it-works" className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-10">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Select Your Country</h3>
              <p className="text-muted-foreground">
                We auto-detect your location so you see rates in your local
                currency instantly.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Compare Providers</h3>
              <p className="text-muted-foreground">
                See exchange rates, fees, and transfer times side by side from
                8+ trusted services.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Send with Confidence</h3>
              <p className="text-muted-foreground">
                Choose the best deal and send money securely through licensed,
                regulated providers.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Are these exchange rates real-time?",
                a: "Yes. We pull live mid-market exchange rates from open exchange rate APIs and apply each provider's typical margin. Rates refresh every 5 minutes. The exact rate you get may vary slightly at the time of transfer.",
              },
              {
                q: "Is it free to compare on this site?",
                a: "Yes, SendMoneyToIndia is completely free to use. We earn a small commission from some providers when you choose to send through them, at no extra cost to you.",
              },
              {
                q: "Which countries and currencies are supported?",
                a: "We currently support major corridors including USD, GBP, EUR, CAD, AUD, AED, SAR, SGD and more to Indian Rupees (INR). We're constantly adding new corridors.",
              },
              {
                q: "How do you determine the 'best rate'?",
                a: "The best rate is calculated based on the total amount the recipient receives after all fees. This includes both exchange rate margins and transfer fees.",
              },
            ].map((item, i) => (
              <div key={i} className="border rounded-lg p-5">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-muted-foreground text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-medium">SendMoneyToIndia</span>
          </div>
          <p>Compare forex rates. Save on every transfer.</p>
        </div>
      </footer>
    </div>
  );
}
