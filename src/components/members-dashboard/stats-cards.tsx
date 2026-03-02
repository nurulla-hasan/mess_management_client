"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Wallet, CreditCard, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    mealStats: {
      totalMeals: number;
      mealRate: number;
      estimatedCost: number;
    };
    financials: {
      totalDeposited: number;
      currentBalance: number;
    };
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { mealStats, financials } = stats;

  const cards = [
    {
      title: "Total Meals",
      value: mealStats.totalMeals.toString(),
      description: "This month",
      icon: Utensils,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Meal Rate",
      value: formatCurrency(mealStats.mealRate),
      description: "Current rate",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Deposited",
      value: formatCurrency(financials.totalDeposited),
      description: "Total deposits",
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Current Balance",
      value: formatCurrency(financials.currentBalance),
      description: financials.currentBalance >= 0 ? "Safe" : "Due",
      icon: Wallet,
      color: financials.currentBalance >= 0 ? "text-emerald-600" : "text-red-600",
      bg: financials.currentBalance >= 0 ? "bg-emerald-50" : "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.title === "Current Balance" ? card.color : ""}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
