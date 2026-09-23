"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Palette,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  Send,
  Upload,
  User,
  Mail,
  Phone,
  Ruler,
  FileImage,
} from "lucide-react";

/**
 * BACKEND INTEGRATION NOTE:
 * Target Django REST Framework endpoint when submitting a commission request:
 * POST http://localhost:8000/api/commissions/
 * Payload: {
 *   artist_id,
 *   collector_name,
 *   collector_email,
 *   collector_phone,
 *   budget_range,
 *   dimensions,
 *   style_reference,
 *   deadline,
 *   description
 * }
 */

const ARTISTS_LIST = [
  { id: "artist-1", name: "Helena Vance", specialty: "Oil & Mineral Pigments on Linen" },
  { id: "artist-2", name: "Marcus Thorne", specialty: "Bronze & Marble Sculpture" },
  { id: "artist-3", name: "Camille Dubois", specialty: "Archival Alpine Photography" },
  { id: "artist-4", name: "Aria Sterling", specialty: "Generative & Digital Composition" },
  { id: "artist-5", name: "Dimitri Rossi", specialty: "Etching & Fine Art Prints" },
  { id: "any", name: "Any Available Gallery Artist", specialty: "Curatory Matching Service" },
];

export default function CommissionPage() {
  const [selectedArtist, setSelectedArtist] = useState("artist-1");
  const [budgetRange, setBudgetRange] = useState("$2,500 - $5,000");
  const [dimensions, setDimensions] = useState("36 x 48 in");
  const [styleReference, setStyleReference] = useState("");
  const [deadline, setDeadline] = useState("2026-11-30");
  const [description, setDescription] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const [collectorEmail, setCollectorEmail] = useState("");
  const [collectorPhone, setCollectorPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setDescription("");
    setStyleReference("");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Commission Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-primary font-semibold bg-accent/60 px-3 py-1 border border-primary/20">
          <Palette className="h-3.5 w-3.5" />
          <span>Bespoke Studio Commissions</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Commission Custom Artwork
        </h1>

        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          Collaborate directly with renowned studio artists to create a tailored original painting, architectural bronze, or fine art installation.
        </p>
      </div>

      {/* Main Commission Form Card */}
      <Card className="border-border shadow-sm rounded-none bg-background">
        <CardContent className="p-6 sm:p-10">
          
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto animate-bounce" />
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Commission Inquiry Received
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your commission proposal has been logged in our gallery ledger and forwarded directly to the artist's studio. You will receive a formal response within 48 hours.
              </p>
              <div className="pt-4 flex items-center justify-center space-x-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-border text-xs uppercase tracking-wider font-semibold rounded-none h-11 px-6"
                >
                  Submit Another Inquiry
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-none h-11 px-6 shadow-md"
                >
                  <Link href="/dashboard/requests">View Request Status in Inbox</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Artist Selection */}
              <div className="space-y-4 border-b border-border/60 pb-6">
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-heading text-lg font-bold text-foreground">Select Preferred Artist</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    Artist Studio
                  </label>
                  <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                    <SelectTrigger className="h-11 text-xs border-border rounded-none focus:ring-primary">
                      <SelectValue placeholder="Choose Studio Artist" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border text-xs">
                      {ARTISTS_LIST.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id} className="text-xs py-2">
                          <span className="font-semibold">{artist.name}</span> — <span className="text-muted-foreground">{artist.specialty}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Section 2: Specifications & Budget */}
              <div className="space-y-4 border-b border-border/60 pb-6">
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="font-heading text-lg font-bold text-foreground">Project Parameters & Budget</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Target Budget Range
                    </label>
                    <Select value={budgetRange} onValueChange={setBudgetRange}>
                      <SelectTrigger className="h-11 text-xs border-border rounded-none focus:ring-primary">
                        <SelectValue placeholder="Select Budget Range" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-border text-xs">
                        <SelectItem value="$1,000 - $2,500">$1,000 - $2,500 USD</SelectItem>
                        <SelectItem value="$2,500 - $5,000">$2,500 - $5,000 USD</SelectItem>
                        <SelectItem value="$5,000 - $10,000">$5,000 - $10,000 USD</SelectItem>
                        <SelectItem value="$10,000+">$10,000+ USD (Major Installation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Size / Dimensions
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        placeholder="e.g. 36 x 48 in / 100 x 120 cm"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Desired Deadline
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Vision & References */}
              <div className="space-y-4 border-b border-border/60 pb-6">
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="font-heading text-lg font-bold text-foreground">Creative Vision & Style References</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Style Reference URL / Moodboard Link
                    </label>
                    <div className="relative">
                      <FileImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="https://pinterest.com/board/art-palette or image reference link"
                        value={styleReference}
                        onChange={(e) => setStyleReference(e.target.value)}
                        className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Detailed Project Vision & Notes
                    </label>
                    <Textarea
                      required
                      rows={5}
                      placeholder="Describe the desired color palette, room placement (e.g. dining room focal wall), subject matter, or mood you wish the artist to capture..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Collector Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">4</span>
                  <h3 className="font-heading text-lg font-bold text-foreground">Collector Contact Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        placeholder="Eleanor Vance"
                        value={collectorName}
                        onChange={(e) => setCollectorName(e.target.value)}
                        className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        type="email"
                        placeholder="eleanor@gallery.com"
                        value={collectorEmail}
                        onChange={(e) => setCollectorEmail(e.target.value)}
                        className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Phone Number <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="+1 (555) 234-5678"
                        value={collectorPhone}
                        onChange={(e) => setCollectorPhone(e.target.value)}
                        className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-12 rounded-none shadow-md mt-6"
              >
                {isLoading ? "Submitting Commission Inquiry..." : "Submit Commission Request to Artist"}
              </Button>

            </form>
          )}

        </CardContent>
      </Card>

    </div>
  );
}
