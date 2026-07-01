"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export interface ResultFilters {
  minScore: number
  query: string
}

interface FiltersProps {
  filters: ResultFilters
  onFiltersChange: (filters: ResultFilters) => void
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="candidate-search">Search by name or email</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="candidate-search"
            value={filters.query}
            onChange={(event) =>
              onFiltersChange({ ...filters, query: event.target.value })
            }
            placeholder="e.g. Jane, jane@company.com"
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:max-w-56">
        <Label>
          Minimum ranking score{" "}
          <span className="text-muted-foreground">({filters.minScore}%)</span>
        </Label>
        <Slider
          value={[filters.minScore]}
          min={0}
          max={100}
          step={5}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              minScore: Array.isArray(value) ? value[0] : value,
            })
          }
        />
      </div>
    </div>
  )
}
