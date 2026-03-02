
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ReportMonthSelectorProps {
  currentMonth: number;
  currentYear: number;
}

export function ReportMonthSelector({ currentMonth, currentYear }: ReportMonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(`${currentYear}-${currentMonth}`);

  // Generate last 12 months options
  const options = [];
  const date = new Date();
  for (let i = 0; i < 12; i++) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    const val = `${year}-${month}`;
    options.push({ label, value: val });
    date.setMonth(date.getMonth() - 1);
  }

  useEffect(() => {
    setValue(`${currentYear}-${currentMonth}`);
  }, [currentMonth, currentYear]);

  const handleValueChange = (val: string) => {
    setValue(val);
    const [year, month] = val.split("-");
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    params.set("year", year);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-45 bg-background">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
