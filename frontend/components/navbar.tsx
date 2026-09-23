"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, ShoppingBag, User, ArrowRight, LayoutDashboard, Inbox, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Browse Gallery", href: "/gallery" },
  { name: "Commission Work", href: "/commission" },
  { name: "Artist Dashboard", href: "/dashboard" },
  { name: "Request Inbox", href: "/dashboard/requests" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/gallery?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-1.5 focus:outline-none">
          <span className="font-heading text-2xl sm:text-3xl font-bold tracking-wider uppercase text-foreground group-hover:text-primary transition-colors">
            Galleria
          </span>
          <span className="h-2 w-2 rounded-full bg-primary transition-transform group-hover:scale-125" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-xs tracking-wide font-medium uppercase transition-colors hover:text-primary relative py-1",
                  isActive ? "text-primary font-semibold" : "text-foreground/80"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in zoom-in-95 duration-200" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Quick Search Input toggle */}
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search artwork or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-60 pl-9 pr-8 h-9 text-xs border-border bg-secondary/30 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                autoFocus
              />
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground/70 hover:text-primary hover:bg-accent/50 h-9 w-9"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs uppercase tracking-wider font-medium hover:text-primary"
          >
            <Link href="/login">
              <User className="h-3.5 w-3.5 mr-1.5" /> Sign In
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-medium shadow-sm transition-all px-4 rounded-none"
          >
            <Link href="/signup">Join Collector</Link>
          </Button>
        </div>

        {/* Mobile Menu Drawer Trigger */}
        <div className="flex md:hidden items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background border-border p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left border-b border-border pb-4 mb-6">
                  <SheetTitle className="font-heading text-2xl uppercase tracking-wider flex items-center gap-1.5">
                    Galleria <span className="h-2 w-2 rounded-full bg-primary" />
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "text-sm uppercase tracking-wider font-medium py-2 transition-colors hover:text-primary flex items-center justify-between border-b border-border/40",
                        pathname === link.href ? "text-primary font-semibold" : "text-foreground"
                      )}
                    >
                      {link.name}
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <Button asChild variant="outline" className="w-full justify-center text-xs uppercase tracking-wider font-medium border-border rounded-none">
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" /> Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-medium rounded-none">
                  <Link href="/signup">Join Collector</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
