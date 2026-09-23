"use client";

import { ArtworkCategory, ArtworkMedium, FilterState } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GalleryFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
}

const CATEGORIES: ArtworkCategory[] = [
  "All",
  "Paintings",
  "Photography",
  "Sculpture",
  "Digital Art",
  "Printmaking",
];

const MEDIUMS: ArtworkMedium[] = [
  "All",
  "Oil on Canvas",
  "Acrylic on Canvas",
  "Fine Art Print",
  "Bronze Sculpture",
  "Archival Inkjet Print",
  "Digital Composition",
];

export function GalleryFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}: GalleryFiltersProps) {
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.category !== "All" ||
    filters.medium !== "All" ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 15000 ||
    filters.sortBy !== "featured";

  return (
    <div className="w-full space-y-6 bg-background border border-border/70 p-4 sm:p-6 mb-10 shadow-sm">
      
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by artwork title, artist, or keyword..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="pl-9 pr-8 h-10 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Medium Select */}
        <div className="w-full md:w-52">
          <Select
            value={filters.medium}
            onValueChange={(val) => onFilterChange({ medium: val as ArtworkMedium })}
          >
            <SelectTrigger className="h-10 text-xs border-border bg-background rounded-none focus:ring-primary">
              <SelectValue placeholder="Filter by Medium" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border text-xs">
              {MEDIUMS.map((m) => (
                <SelectItem key={m} value={m} className="text-xs">
                  {m === "All" ? "All Mediums" : m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Select */}
        <div className="w-full md:w-52">
          <Select
            value={filters.sortBy}
            onValueChange={(val) => onFilterChange({ sortBy: val as FilterState["sortBy"] })}
          >
            <SelectTrigger className="h-10 text-xs border-border bg-background rounded-none focus:ring-primary">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border text-xs">
              <SelectItem value="featured" className="text-xs">Featured Curation</SelectItem>
              <SelectItem value="price-asc" className="text-xs">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="text-xs">Price: High to Low</SelectItem>
              <SelectItem value="newest" className="text-xs">Newest Acquisitions</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center justify-between border-t border-border/40 pt-4 overflow-x-auto gap-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat })}
                className={`text-xs px-3 py-1.5 uppercase tracking-wider transition-colors shrink-0 font-medium ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-secondary/60 text-foreground/80 hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Price Slider Dropdown / Indicator */}
        <div className="hidden lg:flex items-center space-x-4 shrink-0 pl-4 border-l border-border/40">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Price: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
          </span>
          <div className="w-36">
            <Slider
              min={0}
              max={15000}
              step={500}
              value={filters.priceRange}
              onValueChange={(val) => onFilterChange({ priceRange: val as [number, number] })}
              className="py-1"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Tags & Count Bar */}
      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-xs font-light">
            Showing <strong className="text-foreground font-semibold">{totalCount}</strong> artworks
          </span>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-6 text-[11px] text-primary hover:text-primary/80 hover:bg-accent/40 px-2 rounded-none"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset Filters
            </Button>
          )}
        </div>

        {/* Selected Active Badges */}
        {isFiltered && (
          <div className="hidden sm:flex items-center space-x-2">
            {filters.category !== "All" && (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-accent/40 rounded-none">
                Category: {filters.category}
              </Badge>
            )}
            {filters.medium !== "All" && (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-accent/40 rounded-none">
                Medium: {filters.medium}
              </Badge>
            )}
            {filters.searchQuery && (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-accent/40 rounded-none">
                Query: "{filters.searchQuery}"
              </Badge>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
