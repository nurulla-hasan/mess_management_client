"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSmartFilter } from "@/hooks/useSmartFilter";
import { Suspense } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  filterKey?: string;
}

function SearchInputContent({
  placeholder = "Search...",
  className = "max-w-64",
  filterKey = "search",
}: SearchInputProps) {
  const { updateFilter, getFilter } = useSmartFilter();
  const searchParam = getFilter(filterKey);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 rounded-full max-w-64"
        defaultValue={searchParam}
        onChange={(e) => updateFilter(filterKey, e.target.value, 300)}
      />
    </div>
  );
}

export function SearchInput(props: SearchInputProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`animate-pulse rounded-md ${
            props.className
          }`}
        />
      }
    >
      <SearchInputContent {...props} />
    </Suspense>
  );
}
