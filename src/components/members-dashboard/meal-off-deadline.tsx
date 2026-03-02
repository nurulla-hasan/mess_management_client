"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function MealOffDeadline() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Meal Off Deadline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-amber-700">
          Remember to update your meal status before <span className="font-bold">10:00 PM</span> for the next day.
        </p>
      </CardContent>
    </Card>
  );
}
