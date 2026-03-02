"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Meal } from "@/services/meal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface MealCalendarProps {
  meals: Meal[] | null;
  currentDate: Date;
}

export function MealCalendar({ meals, currentDate }: MealCalendarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Process meals into a map for easy lookup
  const mealMap: Record<string, { breakfast: number; lunch: number; dinner: number }> = {};
  if (meals) {
    meals.forEach((meal) => {
      const dateKey = format(new Date(meal.date), "yyyy-MM-dd");
      const dayTotals = meal.entries.reduce(
        (acc, entry) => ({
          breakfast: acc.breakfast + (entry.breakfast || 0),
          lunch: acc.lunch + entry.lunch,
          dinner: acc.dinner + entry.dinner,
        }),
        { breakfast: 0, lunch: 0, dinner: 0 }
      );
      mealMap[dateKey] = dayTotals;
    });
  }

  // Update URL when month changes
  const updateUrl = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", (date.getMonth() + 1).toString());
    params.set("year", date.getFullYear().toString());
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  const startDayOfWeek = getDay(firstDay); // 0 = Sunday

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1);
    updateUrl(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    updateUrl(newDate);
  };

  const handleGoToToday = () => {
    const newDate = new Date();
    updateUrl(newDate);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            {format(currentDate, "MMMM yyyy")}
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            View and manage daily meal logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={handlePreviousMonth} disabled={isPending}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm" onClick={handleGoToToday} disabled={isPending}>
            Today
          </Button>
          <Button variant="outline" size="icon-sm" onClick={handleNextMonth} disabled={isPending}>
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {/* Legend */}
        <div className="flex gap-4 px-6 pb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"></div>
            <span>Breakfast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"></div>
            <span>Lunch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800"></div>
            <span>Dinner</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-t border-l">
          {/* Weekday Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-muted-foreground border-b border-r bg-muted/30"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for start of month */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-24 border-b border-r bg-muted/5"
            />
          ))}

          {/* Days */}
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const data = mealMap[dateKey];
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-24 p-2 border-b border-r relative group transition-colors hover:bg-muted/50",
                  !isSameMonth(day, currentDate) && "text-muted-foreground bg-muted/10",
                  isTodayDate && "ring-1 ring-inset ring-green-500 bg-green-50/10"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={cn(
                      "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                      isTodayDate
                        ? "bg-green-500 text-white"
                        : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {isTodayDate && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                      Today
                    </span>
                  )}
                </div>

                {/* Meal Data */}
                <div className="flex flex-col gap-1">
                  {data ? (
                    <>
                      {data.breakfast > 0 && (
                        <div className="flex justify-between text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <span className="font-semibold">B</span>
                          <span>{data.breakfast}</span>
                        </div>
                      )}
                      {data.lunch > 0 && (
                        <div className="flex justify-between text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <span className="font-semibold">L</span>
                          <span>{data.lunch}</span>
                        </div>
                      )}
                      {data.dinner > 0 && (
                        <div className="flex justify-between text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                          <span className="font-semibold">D</span>
                          <span>{data.dinner}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    // Placeholder for hover effect or empty state
                    <div className="h-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-xs text-muted-foreground border border-dashed rounded px-2 py-1">Add entry</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
           {/* Empty cells to fill the last row */}
           {Array.from({ length: (7 - (getDay(lastDay) + 1)) % 7 }).map((_, i) => (
             <div key={`empty-end-${i}`} className="min-h-24 border-b border-r bg-muted/5" />
           ))}
        </div>
      </CardContent>
    </Card>
  );
}
