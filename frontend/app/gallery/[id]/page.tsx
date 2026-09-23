"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MOCK_ARTWORKS } from "@/lib/mock-artworks";
import { Artwork } from "@/lib/types";
import { ArtworkCard } from "@/components/artwork-card";
import { ArtworkDialog } from "@/components/artwork-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Mail,
  ShoppingBag,
  CheckCircle2,
  Share2,
  HelpCircle,
  Eye,
} from "lucide-react";

/**
 * BACKEND INTEGRATION NOTE:
 * Target Django REST Framework endpoint when fetching artwork details:
 * GET http://localhost:8000/api/artworks/:id/
 *
 * For purchasing or inquiries:
 * POST http://localhost:8000/api/orders/checkout/
 * POST http://localhost:8000/api/artworks/:id/contact/
 */

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const artworkId = params.id as string;

  // Find matching artwork or fallback to first artwork
  const artwork: Artwork =
    MOCK_ARTWORKS.find((a) => a.id === artworkId || a.slug === artworkId) ||
    MOCK_ARTWORKS[0];

  const [selectedImage, setSelectedImage] = useState<string>(artwork.imageUrl);
  const [isLiked, setIsLiked] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Quick View dialog state for related works
  const [quickViewArtwork, setQuickViewArtwork] = useState<Artwork | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Contact artist form state
  const [contactMessage, setContactMessage] = useState("");
  const [collectorEmail, setCollectorEmail] = useState("");

  const allImages = [artwork.imageUrl, ...(artwork.additionalImages || [])];

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPurchased(true);
    setTimeout(() => {
      setIsPurchased(false);
      setIsBuyModalOpen(false);
    }, 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMessageSent(true);
    setTimeout(() => {
      setIsMessageSent(false);
      setIsContactModalOpen(false);
      setContactMessage("");
    }, 3000);
  };

  const relatedArtworks = MOCK_ARTWORKS.filter(
    (a) => a.id !== artwork.id && (a.category === artwork.category || a.artist.id === artwork.artist.id)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Back Navigation Bar */}
      <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
        </Button>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-primary border-primary/30 rounded-none">
            {artwork.category}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLiked(!isLiked)}
            className={`h-8 w-8 rounded-full ${isLiked ? "text-primary fill-primary" : "text-muted-foreground hover:text-primary"}`}
            aria-label="Wishlist"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: artwork.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Artwork link copied to clipboard!");
              }
            }}
            aria-label="Share Artwork"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Artwork Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        
        {/* Left Column: High-Res Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] w-full bg-secondary/20 border border-border/70 p-4 shadow-sm">
            <div className="relative w-full h-full overflow-hidden bg-background">
              <Image
                src={selectedImage}
                alt={artwork.title}
                fill
                priority
                className="object-contain p-2 transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 border transition-all ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/40 shadow-sm"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Artwork Spec & Buying Actions */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary font-bold bg-accent/60 px-2.5 py-1 inline-block border border-primary/20">
              {artwork.edition || "Original 1 of 1"}
            </span>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {artwork.title}
            </h1>

            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold pt-1">
              Acquisition Year: {artwork.year}
            </p>
          </div>

          {/* Artist Card */}
          <div className="flex items-center space-x-4 p-4 bg-secondary/30 border border-border">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarImage src={artwork.artist.avatarUrl} alt={artwork.artist.name} />
              <AvatarFallback>{artwork.artist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-foreground">{artwork.artist.name}</h3>
              <p className="text-xs text-muted-foreground">{artwork.artist.location}</p>
              {artwork.artist.bio && (
                <p className="text-[11px] text-muted-foreground/80 line-clamp-1 italic font-light">
                  "{artwork.artist.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Price & Purchase Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Acquisition Price</span>
              <span className="font-heading text-3xl font-bold text-foreground">
                ${artwork.price.toLocaleString("en-US")} <span className="text-xs font-sans font-normal text-muted-foreground">USD</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => setIsBuyModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-12 rounded-none shadow-md"
              >
                <ShoppingBag className="h-4 w-4 mr-2" /> Buy Artwork
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsContactModalOpen(true)}
                className="border-primary/60 text-primary hover:bg-accent/60 hover:border-primary text-xs uppercase tracking-widest font-semibold h-12 rounded-none"
              >
                <Mail className="h-4 w-4 mr-2" /> Contact Artist
              </Button>
            </div>
          </div>

          {/* Technical Specifications List */}
          <div className="border-t border-border pt-6 space-y-3">
            <h4 className="font-heading text-sm uppercase tracking-widest font-semibold text-foreground">
              Artwork Specifications
            </h4>

            <div className="grid grid-cols-2 gap-y-3 text-xs text-foreground/80">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Medium</span>
                <span className="font-medium">{artwork.medium}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Dimensions</span>
                <span className="font-medium">{artwork.dimensions}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Category</span>
                <span className="font-medium">{artwork.category}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Status</span>
                <span className="font-medium text-emerald-700">Original Available</span>
              </div>
            </div>
          </div>

          {/* Curatorial Description */}
          <div className="border-t border-border pt-6 space-y-2">
            <h4 className="font-heading text-sm uppercase tracking-widest font-semibold text-foreground">
              Curator's Notes
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              {artwork.description}
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60 text-[11px] text-muted-foreground">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Signed Certificate of Authenticity</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>Insured Climate-Controlled Shipping</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Artworks Discovery Section */}
      {relatedArtworks.length > 0 && (
        <div className="border-t border-border pt-16 mt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Curator's Related Selections
            </h2>
            <Link href="/gallery" className="text-xs text-primary font-semibold uppercase tracking-wider hover:underline">
              View All Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArtworks.map((item) => (
              <ArtworkCard
                key={item.id}
                artwork={item}
                onQuickView={(art) => {
                  setQuickViewArtwork(art);
                  setIsQuickViewOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick View Dialog for Related Works */}
      <ArtworkDialog
        artwork={quickViewArtwork}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      {/* Buy Artwork Checkout Modal */}
      <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
        <DialogContent className="max-w-md bg-background border-border rounded-none p-6">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="font-heading text-xl font-bold text-foreground">
              Acquire "{artwork.title}"
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Complete your acquisition inquiry. Our art advisory team will reserve this artwork immediately.
            </DialogDescription>
          </DialogHeader>

          {isPurchased ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-heading text-lg font-bold text-foreground">Acquisition Reserved!</h3>
              <p className="text-xs text-muted-foreground">
                Your order has been registered in our gallery ledger. An advisory officer will contact you regarding private transport.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBuySubmit} className="space-y-4 pt-2">
              <div className="bg-secondary/40 p-3 border border-border text-xs space-y-1">
                <div className="flex justify-between font-medium">
                  <span>{artwork.title}</span>
                  <span>${artwork.price.toLocaleString()} USD</span>
                </div>
                <div className="text-muted-foreground text-[11px]">{artwork.artist.name} • {artwork.medium}</div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Collector Full Name
                </label>
                <Input required placeholder="Eleanor Vance" className="h-10 text-xs border-border rounded-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Collector Email Address
                </label>
                <Input required type="email" placeholder="eleanor@gallery.com" className="h-10 text-xs border-border rounded-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Delivery Destination
                </label>
                <Input required placeholder="Paris, France / New York, NY" className="h-10 text-xs border-border rounded-none" />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-11 rounded-none shadow-md mt-4"
              >
                Confirm Acquisition Order (${artwork.price.toLocaleString()} USD)
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Artist Drawer/Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-md bg-background border-border rounded-none p-6">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="font-heading text-xl font-bold text-foreground">
              Contact {artwork.artist.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send a direct inquiry regarding "{artwork.title}", custom commissions, or studio visits.
            </DialogDescription>
          </DialogHeader>

          {isMessageSent ? (
            <div className="py-8 text-center space-y-3">
              <Sparkles className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-heading text-lg font-bold text-foreground">Inquiry Sent to Artist!</h3>
              <p className="text-xs text-muted-foreground">
                Your message has been forwarded directly to {artwork.artist.name}'s studio manager.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Your Email
                </label>
                <Input
                  required
                  type="email"
                  placeholder="collector@domain.com"
                  value={collectorEmail}
                  onChange={(e) => setCollectorEmail(e.target.value)}
                  className="h-10 text-xs border-border rounded-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Message to Artist
                </label>
                <Textarea
                  required
                  rows={4}
                  placeholder={`Dear ${artwork.artist.name},\nI am interested in acquiring "${artwork.title}" or inquiring about your upcoming studio series...`}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="text-xs border-border rounded-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-11 rounded-none shadow-md"
              >
                Send Message to Artist Studio
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
