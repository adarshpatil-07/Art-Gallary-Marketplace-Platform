import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ARTWORKS } from "@/lib/mock-artworks";
import { ArrowRight, Sparkles, ShieldCheck, Award, Eye, Heart } from "lucide-react";

export default function Home() {
  const featuredArtworks = MOCK_ARTWORKS.filter((art) => art.isFeatured).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Gallery Hero Banner */}
      <section className="relative w-full border-b border-border/80 bg-secondary/30 py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-primary font-semibold bg-accent/80 px-3 py-1 border border-primary/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>International Art Marketplace</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Artistry Beyond <span className="italic font-normal text-primary">Boundaries</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
              An uncompromised digital pavilion showcasing original paintings, contemporary bronzes, and fine photography. Curated for discerning collectors worldwide.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-12 px-8 rounded-none shadow-md"
              >
                <Link href="/gallery">
                  Explore Gallery Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-secondary text-xs uppercase tracking-widest font-semibold h-12 px-8 rounded-none"
              >
                <Link href="/#artists">Featured Artists</Link>
              </Button>
            </div>

            {/* Gallery Trust Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/60 text-xs">
              <div>
                <span className="font-heading text-2xl font-bold text-foreground block">100%</span>
                <span className="text-muted-foreground text-[11px] uppercase tracking-wider">Authenticated Provenance</span>
              </div>
              <div>
                <span className="font-heading text-2xl font-bold text-foreground block">120+</span>
                <span className="text-muted-foreground text-[11px] uppercase tracking-wider">Master Artists</span>
              </div>
              <div>
                <span className="font-heading text-2xl font-bold text-foreground block">Global</span>
                <span className="text-muted-foreground text-[11px] uppercase tracking-wider">Insured Freight</span>
              </div>
            </div>
          </div>

          {/* Hero Featured Artwork Card Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full bg-background border border-border p-4 shadow-2xl">
              <div className="relative w-full h-full overflow-hidden bg-secondary/40">
                <Image
                  src={MOCK_ARTWORKS[0].imageUrl}
                  alt={MOCK_ARTWORKS[0].title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-md p-4 border border-border shadow-md">
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest">Featured Acquisition</p>
                <h3 className="font-heading text-lg font-semibold text-foreground">{MOCK_ARTWORKS[0].title}</h3>
                <p className="text-xs text-muted-foreground">{MOCK_ARTWORKS[0].artist.name} • ${MOCK_ARTWORKS[0].price.toLocaleString()} USD</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Curations Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-border pb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">Current Exhibition</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-1">
              Curator's Highlights
            </h2>
          </div>

          <Button
            asChild
            variant="ghost"
            className="text-xs uppercase tracking-wider font-semibold text-primary hover:text-primary/80 hover:bg-accent/40"
          >
            <Link href="/gallery">
              View All Artworks ({MOCK_ARTWORKS.length}) <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* 4 Featured Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredArtworks.map((art) => (
            <div key={art.id} className="group flex flex-col bg-background border border-border/60 p-3.5 transition-all hover:border-primary/40 hover:shadow-lg">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary/30">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/90 text-foreground text-[10px] uppercase tracking-wider font-medium rounded-none">
                    {art.category}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex flex-col justify-between space-y-2 flex-1">
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{art.artist.name}</p>
                </div>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">${art.price.toLocaleString()}</span>
                  <Link href="/gallery" className="text-xs text-primary font-medium hover:underline flex items-center">
                    Inspect <Eye className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Call to Action Banner */}
      <section className="bg-secondary/40 border-t border-b border-border py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Looking for a specific medium or custom commission?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Our gallery advisory team works directly with individual collectors, interior architects, and institutional curators to source rare pieces.
          </p>
          <div className="pt-2">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-11 px-8 rounded-none"
            >
              <Link href="/gallery">Browse Full Gallery Inventory</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
