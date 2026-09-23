export type ArtworkCategory = 
  | "All"
  | "Paintings"
  | "Photography"
  | "Sculpture"
  | "Digital Art"
  | "Printmaking"
  | "Drawings";

export type ArtworkMedium = 
  | "All"
  | "Oil on Canvas"
  | "Acrylic on Canvas"
  | "Fine Art Print"
  | "Bronze Sculpture"
  | "Archival Inkjet Print"
  | "Digital Composition"
  | "Charcoal on Paper"
  | "Mixed Media";

export interface Artist {
  id: string;
  name: string;
  location: string;
  avatarUrl: string;
  bio?: string;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  artist: Artist;
  price: number; // in USD
  category: ArtworkCategory;
  medium: ArtworkMedium;
  dimensions: string; // e.g. "36 x 48 in"
  year: number;
  imageUrl: string;
  additionalImages?: string[];
  description: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  edition?: string; // e.g. "Original 1 of 1" or "Edition of 25"
}

export interface FilterState {
  searchQuery: string;
  category: ArtworkCategory;
  medium: ArtworkMedium;
  priceRange: [number, number];
  sortBy: "featured" | "price-asc" | "price-desc" | "newest" | "title";
}

export type CommissionStatus = "Pending" | "Quoted" | "Accepted" | "Declined";

export interface CommissionRequest {
  id: string;
  collectorName: string;
  collectorEmail: string;
  collectorPhone?: string;
  artistId: string;
  artistName: string;
  title: string;
  category: ArtworkCategory;
  budgetRange: string; // e.g. "$2,500 - $5,000"
  quotedPrice?: number;
  dimensions: string; // e.g. "36 x 48 in"
  styleReference?: string; // URL or reference description
  deadline: string; // YYYY-MM-DD
  description: string;
  status: CommissionStatus;
  createdAt: string;
}
