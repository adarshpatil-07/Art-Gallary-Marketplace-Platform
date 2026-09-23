"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, ShieldCheck, Truck, Sparkles, Send, ExternalLink } from "lucide-react";

interface ArtworkDialogProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArtworkDialog({ artwork, isOpen, onClose }: ArtworkDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isInquired, setIsInquired] = useState(false);

  if (!artwork) return null;

  const currentImage = selectedImage || artwork.imageUrl;
  const allImages = [artwork.imageUrl, ...(artwork.additionalImages || [])];

  const handleInquire = () => {
    // Backend integration target:
    // POST http://localhost:8000/api/inquiries/ { artwork_id: artwork.id }
    setIsInquired(true);
    setTimeout(() => setIsInquired(false), 4000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border rounded-none sm:rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Gallery Media Gallery Left Column */}
          <div className="bg-secondary/20 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-border">
            <div className="relative aspect-[4/5] w-full max-h-[420px] overflow-hidden bg-background border border-border/40 shadow-sm">
              <Image
                src={currentImage}
                alt={artwork.title}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex items-center space-x-3 mt-4 overflow-x-auto pb-2 w-full justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-14 w-14 border transition-all ${
                      currentImage === img ? "border-primary ring-1 ring-primary" : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artwork Info & Collector Action Right Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-primary border-primary/40 rounded-none px-2 py-0.5">
                  {artwork.edition || "Original Work"}
                </Badge>
                <span className="text-xs text-muted-foreground">{artwork.year}</span>
              </div>

              <DialogTitle className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {artwork.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detailed view of {artwork.title} by {artwork.artist.name}
              </DialogDescription>

              {/* Artist Details */}
              <div className="flex items-center space-x-3 pt-2">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={artwork.artist.avatarUrl} alt={artwork.artist.name} />
                  <AvatarFallback>{artwork.artist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{artwork.artist.name}</h4>
                  <p className="text-xs text-muted-foreground">{artwork.artist.location}</p>
                </div>
              </div>
            </DialogHeader>

            {/* Details Summary */}
            <div className="space-y-3 text-xs text-foreground/80 border-t border-b border-border/60 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Medium</span>
                  <span className="font-medium">{artwork.medium}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Dimensions</span>
                  <span className="font-medium">{artwork.dimensions}</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-2">
                {artwork.description}
              </p>
            </div>

            {/* Price & Primary Acquisition Action */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Acquisition Price</span>
                <span className="font-heading text-2xl font-bold text-foreground">
                  ${artwork.price.toLocaleString("en-US")} <span className="text-xs font-sans font-normal text-muted-foreground">USD</span>
                </span>
              </div>

              {isInquired ? (
                <div className="p-3 bg-accent/80 border border-primary/30 text-primary text-xs font-medium flex items-center justify-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Inquiry sent to gallery curator! We will reach out shortly.</span>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleInquire}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-semibold h-11 rounded-none shadow-md"
                    >
                      <Send className="h-3.5 w-3.5 mr-2" /> Inquire to Acquire
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 border-border hover:border-primary hover:text-primary rounded-none"
                      aria-label="Save to Wishlist"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-primary justify-center"
                    onClick={onClose}
                  >
                    <Link href={`/gallery/${artwork.id}`}>
                      View Full Artwork Page <ExternalLink className="h-3 w-3 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* Provenance & Shipping Badges */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground pt-1">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Certificate of Authenticity</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span>Insured Global Freight</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
