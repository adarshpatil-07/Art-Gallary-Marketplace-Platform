"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork;
  onQuickView: (artwork: Artwork) => void;
}

export function ArtworkCard({ artwork, onQuickView }: ArtworkCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative flex flex-col bg-background border border-border/60 p-3.5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
      {/* Image Container Link */}
      <Link href={`/gallery/${artwork.id}`} className="relative aspect-[4/5] w-full overflow-hidden bg-secondary/30 block">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-700 ease-out group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <Badge
            variant="secondary"
            className="bg-background/90 text-foreground text-[10px] uppercase tracking-wider font-medium backdrop-blur-sm border-border/60 pointer-events-auto rounded-none py-0.5 px-2"
          >
            {artwork.category}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={cn(
              "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto transition-colors shadow-sm",
              isLiked ? "text-primary fill-primary" : "text-foreground/70 hover:text-primary"
            )}
            aria-label="Save to Favorites"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(artwork);
            }}
            className="pointer-events-auto bg-background/95 hover:bg-primary hover:text-primary-foreground text-foreground text-xs uppercase tracking-wider font-semibold shadow-md rounded-none px-4 py-2 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" /> Quick View
          </Button>
        </div>
      </Link>

      {/* Artwork Info Content */}
      <div className="mt-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/gallery/${artwork.id}`}
              className="font-heading text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1"
            >
              {artwork.title}
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {artwork.artist.name} <span className="text-muted-foreground/60">• {artwork.artist.location}</span>
          </p>

          <p className="text-[11px] text-muted-foreground/80 tracking-wide mt-1 italic">
            {artwork.medium} ({artwork.dimensions})
          </p>
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight text-foreground">
            ${artwork.price.toLocaleString("en-US")}
          </span>
          <span className="text-[10px] text-primary uppercase font-semibold tracking-wider bg-accent/60 px-1.5 py-0.5">
            {artwork.edition || "Original"}
          </span>
        </div>
      </div>
    </div>
  );
}
