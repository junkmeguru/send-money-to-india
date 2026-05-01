"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Wallet } from "lucide-react";
import { calculateReceiveAmount, type Corridor } from "@/lib/rates";
import { countries, getCountryByCode } from "@/lib/countries";
import { ProviderList } from "./provider-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Calculator({
  initialCountryCode,
  corridors,
  lastUpdated,
}: {
  initialCountryCode?: string;
  corridors: Record<string, Corridor>;
  lastUpdated: string;
}) {
  const [amount, setAmount] = useState<string>("1000");
  const [selectedCountry, setSelectedCountry] = useState(
    getCountryByCode(initialCountryCode || "US")
  );

  const corridor = useMemo(() => {
    if (!selectedCountry) return undefined;
    return corridors[selectedCountry.currency];
  }, [corridors, selectedCountry]);

  const numericAmount = parseFloat(amount) || 0;

  const sortedRates = useMemo(() => {
    if (!corridor) return [];
    return [...corridor.rates].sort((a, b) => {
      const aTotal = calculateReceiveAmount(numericAmount, a.rate, a.fee, a.feeType);
      const bTotal = calculateReceiveAmount(numericAmount, b.rate, b.fee, b.feeType);
      return bTotal - aTotal;
    });
  }, [corridor, numericAmount]);

  const bestRate = sortedRates[0];
  const bestTotal = bestRate
    ? calculateReceiveAmount(numericAmount, bestRate.rate, bestRate.fee, bestRate.feeType)
    : 0;

  return (
    <div className="space-y-8">
      {Object.keys(corridors).length === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load live rates</AlertTitle>
          <AlertDescription>
            We're having trouble fetching real-time exchange rates. Please refresh the page to try again.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-2 border-primary/10 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">
                Sending from
              </Label>
              <div className="relative">
                <select
                  id="country"
                  value={selectedCountry?.code || ""}
                  onChange={(e) => setSelectedCountry(getCountryByCode(e.target.value))}
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                You send
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {selectedCountry?.currencySymbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 text-lg font-semibold"
                  placeholder="1000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                  {selectedCountry?.currency}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Recipient gets</Label>
              <div className="flex items-center gap-3 h-10 px-3 rounded-md bg-primary/5 border border-primary/10">
                <span className="text-primary font-bold text-lg">
                  ₹{bestTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">INR</span>
              </div>
            </div>
          </div>

          {bestRate && (
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>
                  Best rate: <strong className="text-foreground">{bestRate.rate.toFixed(4)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-blue-500" />
                <span>
                  Fee: <strong className="text-foreground">
                    {bestRate.fee === 0
                      ? "Free"
                      : bestRate.feeType === "percentage"
                        ? `${bestRate.fee}%`
                        : `${selectedCountry?.currencySymbol}${bestRate.fee}`}
                  </strong>
                </span>
              </div>
              <div className="ml-auto text-xs">
                Rates updated {new Date(lastUpdated).toLocaleString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Provider Comparison
        </h2>
        <ProviderList
          rates={sortedRates}
          amount={numericAmount}
          currencySymbol={selectedCountry?.currencySymbol || "$"}
          bestTotal={bestTotal}
        />
      </div>
    </div>
  );
}
