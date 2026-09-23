"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Globe, Compass, Camera, Share2 } from "lucide-react";

export function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing to Galleria Private View.");
  };

  return (
    <footer className="w-full bg-secondary/40 border-t border-border/80 text-foreground pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-border/60">
          
          {/* Brand & Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1.5 focus:outline-none">
              <span className="font-heading text-2xl font-bold tracking-wider uppercase text-foreground">
                Galleria
              </span>
              <span className="h-2 w-2 rounded-full bg-primary" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-light">
              Connecting passionate collectors with visionary artists. Curated original paintings, sculptures, and fine photography presented with absolute provenance.
            </p>
            <div className="pt-2 flex items-center space-x-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Social Media">
                <Camera className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Share">
                <Share2 className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Arts Network">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Directory">
                <Compass className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm uppercase tracking-widest font-semibold text-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  All Artworks
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Paintings" className="hover:text-primary transition-colors">
                  Original Paintings
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Sculpture" className="hover:text-primary transition-colors">
                  Sculpture & Bronzes
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Photography" className="hover:text-primary transition-colors">
                  Fine Art Photography
                </Link>
              </li>
              <li>
                <Link href="/gallery?category=Digital+Art" className="hover:text-primary transition-colors">
                  Digital & Generative
                </Link>
              </li>
            </ul>
          </div>

          {/* Gallery Services Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm uppercase tracking-widest font-semibold text-foreground">
              Advisory
            </h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Art Advisory Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Collector Authentication
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Curator Submissions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Private Sales & Commissions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Shipping & Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm uppercase tracking-widest font-semibold text-foreground">
              Private View Newsletter
            </h4>
            <p className="text-xs text-muted-foreground font-light leading-normal">
              Subscribe for exclusive preview invitations, art market insights, and new artist acquisitions.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2 pt-1">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Collector email..."
                  required
                  className="bg-background border-border text-xs h-9 pr-9 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4 font-light">
          <p>© {new Date().getFullYear()} Galleria Fine Art Marketplace. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Sales
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Preferences
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
