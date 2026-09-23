"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_ARTWORKS } from "@/lib/mock-artworks";
import { Artwork, ArtworkCategory, ArtworkMedium } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Palette,
  DollarSign,
  Inbox,
  Eye,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

/**
 * BACKEND INTEGRATION NOTE:
 * Target Django REST Framework endpoints for Artist Dashboard:
 * 1. Fetch artist's artworks: GET http://localhost:8000/api/artist/artworks/
 * 2. Create new artwork: POST http://localhost:8000/api/artworks/
 * 3. Update artwork: PATCH http://localhost:8000/api/artworks/:id/
 * 4. Delete artwork: DELETE http://localhost:8000/api/artworks/:id/
 */

export default function ArtistDashboardPage() {
  const [artworks, setArtworks] = useState<Artwork[]>(MOCK_ARTWORKS.slice(0, 5));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state for adding new artwork
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ArtworkCategory>("Paintings");
  const [newMedium, setNewMedium] = useState<ArtworkMedium>("Oil on Canvas");
  const [newDimensions, setNewDimensions] = useState("36 x 48 in");
  const [newPrice, setNewPrice] = useState("4500");
  const [newEdition, setNewEdition] = useState("Original 1 of 1");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddArtwork = (e: React.FormEvent) => {
    e.preventDefault();

    const createdArtwork: Artwork = {
      id: `art-custom-${Date.now()}`,
      title: newTitle || "Untitled Studio Composition",
      slug: (newTitle || "untitled").toLowerCase().replace(/\s+/g, "-"),
      artist: {
        id: "artist-1",
        name: "Helena Vance",
        location: "Paris, France",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        bio: "Helena Vance explores atmospheric abstraction using raw mineral pigments strictly layered on Belgian linen.",
      },
      price: parseFloat(newPrice) || 3500,
      category: newCategory,
      medium: newMedium,
      dimensions: newDimensions,
      year: new Date().getFullYear(),
      imageUrl:
        newImageUrl ||
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
      description: newDescription || "A newly listed original studio artwork.",
      isAvailable: true,
      isFeatured: true,
      edition: newEdition,
    };

    setArtworks([createdArtwork, ...artworks]);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setIsAddModalOpen(false);
      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewImageUrl("");
    }, 1500);
  };

  const handleToggleAvailability = (id: string) => {
    setArtworks((prev) =>
      prev.map((art) => (art.id === id ? { ...art, isAvailable: !art.isAvailable } : art))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to archive/remove this artwork listing?")) {
      setArtworks((prev) => prev.filter((art) => art.id !== id));
    }
  };

  const totalValue = artworks.reduce((acc, art) => acc + art.price, 0);

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Studio Header & Profile Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/60 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-primary font-semibold bg-accent/60 px-2.5 py-1 border border-primary/20">
            <Palette className="h-3.5 w-3.5" />
            <span>Artist Studio Dashboard</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Helena Vance Studio
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Paris, France • Studio Member since 2023 • Inventory Management
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-border text-xs uppercase tracking-wider font-semibold rounded-none h-10 px-4"
          >
            <Link href="/dashboard/requests">
              <Inbox className="h-4 w-4 mr-2 text-primary" /> Commission Inbox (3)
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-none h-10 px-5 shadow-md"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add Artwork
          </Button>
        </div>
      </div>

      {/* Artist Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-background border border-border/80 p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider font-medium">
            <span>Active Listings</span>
            <Palette className="h-4 w-4 text-primary" />
          </div>
          <p className="font-heading text-3xl font-bold text-foreground">{artworks.length}</p>
          <p className="text-[11px] text-muted-foreground">Original works exhibited in gallery</p>
        </div>

        <div className="bg-background border border-border/80 p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider font-medium">
            <span>Inventory Valuation</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className="font-heading text-3xl font-bold text-foreground">
            ${totalValue.toLocaleString()} <span className="text-xs font-sans font-normal text-muted-foreground">USD</span>
          </p>
          <p className="text-[11px] text-muted-foreground">Total list value of active pieces</p>
        </div>

        <div className="bg-background border border-border/80 p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider font-medium">
            <span>Commission Inquiries</span>
            <Inbox className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-heading text-3xl font-bold text-foreground">3</p>
            <Link href="/dashboard/requests" className="text-xs text-primary font-semibold hover:underline flex items-center">
              View Inbox <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground">2 pending review, 1 quoted</p>
        </div>
      </div>

      {/* Listed Artworks Table & Inventory Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Studio Portfolio Listings ({artworks.length})
          </h2>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-none"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add New Work
          </Button>
        </div>

        {/* Artworks List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <div
              key={art.id}
              className="bg-background border border-border/80 p-4 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex space-x-4 items-start">
                <div className="relative h-24 w-24 shrink-0 bg-secondary/30 border border-border overflow-hidden">
                  <Image src={art.imageUrl} alt={art.title} fill className="object-cover" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-[9px] uppercase tracking-wider rounded-none ${
                        art.isAvailable
                          ? "border-emerald-500/40 text-emerald-700 bg-emerald-50"
                          : "border-amber-500/40 text-amber-700 bg-amber-50"
                      }`}
                    >
                      {art.isAvailable ? "Available" : "Reserved"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{art.year}</span>
                  </div>

                  <h3 className="font-heading text-base font-semibold text-foreground truncate">
                    {art.title}
                  </h3>

                  <p className="text-xs text-muted-foreground italic truncate">{art.medium}</p>

                  <p className="text-xs font-bold text-foreground pt-1">
                    ${art.price.toLocaleString("en-US")} USD
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground hover:text-primary rounded-none px-2"
                >
                  <Link href={`/gallery/${art.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Listing
                  </Link>
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAvailability(art.id)}
                    className="h-8 text-[11px] border-border rounded-none px-2"
                  >
                    {art.isAvailable ? "Mark Reserved" : "Mark Available"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(art.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-none"
                    aria-label="Archive artwork"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Artwork Dialog Form Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg bg-background border-border rounded-none p-6 sm:p-8">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Add Artwork to Gallery
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              List a new original artwork, sculpture, or fine art print for global collectors.
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto animate-bounce" />
              <h3 className="font-heading text-xl font-bold text-foreground">Artwork Listed!</h3>
              <p className="text-xs text-muted-foreground">
                "{newTitle || "Untitled Work"}" is now live in your studio catalog.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAddArtwork} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Artwork Title
                </label>
                <Input
                  required
                  placeholder="e.g. Celestial Reflection in Ochre"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 text-xs border-border rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    Category
                  </label>
                  <Select
                    value={newCategory}
                    onValueChange={(val) => setNewCategory(val as ArtworkCategory)}
                  >
                    <SelectTrigger className="h-10 text-xs border-border rounded-none">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border text-xs">
                      <SelectItem value="Paintings">Paintings</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Sculpture">Sculpture</SelectItem>
                      <SelectItem value="Digital Art">Digital Art</SelectItem>
                      <SelectItem value="Printmaking">Printmaking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    Medium
                  </label>
                  <Input
                    required
                    placeholder="e.g. Oil on Linen"
                    value={newMedium}
                    onChange={(e) => setNewMedium(e.target.value as ArtworkMedium)}
                    className="h-10 text-xs border-border rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    Dimensions
                  </label>
                  <Input
                    required
                    placeholder="e.g. 40 x 50 in"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="h-10 text-xs border-border rounded-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    Price (USD)
                  </label>
                  <Input
                    required
                    type="number"
                    placeholder="4500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="h-10 text-xs border-border rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Edition / Provenance Tag
                </label>
                <Input
                  placeholder="e.g. Original 1 of 1 / Edition 3 of 10"
                  value={newEdition}
                  onChange={(e) => setNewEdition(e.target.value)}
                  className="h-10 text-xs border-border rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Image URL
                </label>
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="h-10 text-xs border-border rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Artwork Curatorial Notes
                </label>
                <Textarea
                  rows={3}
                  placeholder="Describe the conceptual background, pigment composition, or inspiration..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="text-xs border-border rounded-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-11 rounded-none shadow-md mt-4"
              >
                Publish Listing to Gallery
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
