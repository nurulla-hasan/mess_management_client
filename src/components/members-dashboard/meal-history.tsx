"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MealHistoryProps {
  recentMeals: {
    date: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    guest: number;
  }[];
}

export function MealHistory({ recentMeals }: MealHistoryProps) {
  return (
    <Card className="h-full border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Meal History</CardTitle>
      </CardHeader>
      <CardContent>
        {recentMeals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Breakfast</TableHead>
                <TableHead className="text-center">Lunch</TableHead>
                <TableHead className="text-center">Dinner</TableHead>
                <TableHead className="text-center">Guest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMeals.map((meal, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {format(new Date(meal.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-center">{meal.breakfast}</TableCell>
                  <TableCell className="text-center">{meal.lunch}</TableCell>
                  <TableCell className="text-center">{meal.dinner}</TableCell>
                  <TableCell className="text-center">{meal.guest}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No meal records found for this month.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
