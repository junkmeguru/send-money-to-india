"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Clock, Star, TrendingDown, Zap } from "lucide-react";
import { calculateReceiveAmount, getProviderById, type RateInfo } from "@/lib/rates";

interface ProviderListProps {
  rates: RateInfo[];
  amount: number;
  currencySymbol: string;
  bestTotal: number;
}

export function ProviderList({ rates, amount, currencySymbol, bestTotal }: ProviderListProps) {
  if (rates.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No providers available for this corridor.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {rates.map((rate, index) => {
        const provider = getProviderById(rate.providerId);
        if (!provider) return null;

        const total = calculateReceiveAmount(amount, rate.rate, rate.fee, rate.feeType);
        const diff = bestTotal > 0 ? ((total - bestTotal) / bestTotal) * 100 : 0;
        const isBest = index === 0;

        return (
          <Card
            key={rate.providerId}
            className={`overflow-hidden transition-all hover:shadow-md ${
              isBest ? "border-green-500/50 ring-1 ring-green-500/20" : ""
            }`}
          >
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isBest
                        ? "bg-green-500 text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{provider.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{rate.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Exchange Rate</div>
                    <div className="font-semibold">{rate.rate.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Transfer Fee</div>
                    <div className="font-semibold">
                      {rate.fee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : rate.feeType === "percentage" ? (
                        `${rate.fee}%`
                      ) : (
                        `${currencySymbol}${rate.fee}`
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Transfer Time</div>
                    <div className="flex items-center gap-1 font-semibold">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {rate.speed}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Recipient gets</div>
                    <div className={`font-bold text-lg ${isBest ? "text-green-600" : ""}`}>
                      ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 min-w-[140px] justify-end">
                  {isBest && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      <Zap className="h-3 w-3 mr-1" /> Best Rate
                    </Badge>
                  )}
                  {!isBest && diff !== 0 && (
                    <Badge variant="outline" className="text-amber-600 border-amber-200">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {Math.abs(diff).toFixed(1)}% less
                    </Badge>
                  )}
                  <Button size="sm" className="shrink-0" asChild>
                    <a
                      href={provider.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      Send
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
