"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_ARTWORKS } from "@/lib/mock-artworks";
import { Artwork, FilterState } from "@/lib/types";
import { ArtworkCard } from "@/components/artwork-card";
import { ArtworkDialog } from "@/components/artwork-dialog";
import { GalleryFilters } from "@/components/gallery-filters";
import { Button } from "@/components/ui/button";
import { Sparkles, SlidersHorizontal } from "lucide-react";

/**
 * BACKEND INTEGRATION NOTE:
 * When connecting to the Django REST Framework backend:
 * 1. Fetch artworks from GET http://localhost:8000/api/artworks/
 * 2. Pass query parameters for filtering:
 *    GET http://localhost:8000/api/artworks/?search=${searchQuery}&category=${category}&medium=${medium}&ordering=${sortBy}
 */

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("category") as FilterState["category"]) || "All";

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialQuery,
    category: initialCategory,
    medium: "All",
    priceRange: [0, 15000],
    sortBy: "featured",
  });

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      category: "All",
      medium: "All",
      priceRange: [0, 15000],
      sortBy: "featured",
    });
  };

  const handleQuickView = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsDialogOpen(true);
  };

  // Filter & Sort Logic
  const filteredArtworks = useMemo(() => {
    return MOCK_ARTWORKS.filter((art) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchArtist = art.artist.name.toLowerCase().includes(q);
        const matchMedium = art.medium.toLowerCase().includes(q);
        if (!matchTitle && !matchArtist && !matchMedium) return false;
      }

      // Category
      if (filters.category !== "All" && art.category !== filters.category) {
        return false;
      }

      // Medium
      if (filters.medium !== "All" && art.medium !== filters.medium) {
        return false;
      }

      // Price Range
      if (art.price < filters.priceRange[0] || art.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "newest") return b.year - a.year;
      if (filters.sortBy === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Gallery Header Hero */}
      <div className="text-center space-y-4 mb-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-primary font-semibold bg-accent/60 px-3 py-1 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated Private Collection</span>
        </div>
        
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          The Gallery Collection
        </h1>
        
        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
          Discover museum-grade original paintings, fine art photography, modern sculptures, and generative masterworks directly from acclaimed global studios.
        </p>
      </div>

      {/* Filter Control Bar */}
      <GalleryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalCount={filteredArtworks.length}
      />

      {/* Responsive Artwork Grid */}
      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-border bg-secondary/20 p-8 space-y-4">
          <SlidersHorizontal className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <h3 className="font-heading text-xl font-semibold text-foreground">
            No artworks match your search parameters
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Try adjusting your search terms, broadening price filters, or clearing category selections to view more works in our inventory.
          </p>
          <Button
            onClick={handleResetFilters}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-none px-6 py-2"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Quick View Dialog Modal */}
      <ArtworkDialog
        artwork={selectedArtwork}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Loading gallery artworks...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
