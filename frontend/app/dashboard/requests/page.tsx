"use client";

import { useState } from "react";
import Link from "next/link";
import { CommissionRequest, CommissionStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Inbox,
  ArrowLeft,
  Calendar,
  DollarSign,
  Ruler,
  User,
  Mail,
  Phone,
  FileImage,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BACKEND INTEGRATION NOTE:
 * Target Django REST Framework endpoints for Request Inbox:
 * 1. Fetch commission requests: GET http://localhost:8000/api/commissions/
 * 2. Update request status/quote: PATCH http://localhost:8000/api/commissions/:id/
 *    Body: { status: "Quoted" | "Accepted" | "Declined", quoted_price?: number }
 */

const INITIAL_REQUESTS: CommissionRequest[] = [
  {
    id: "req-201",
    collectorName: "Eleanor Vance",
    collectorEmail: "eleanor.vance@collectors.com",
    collectorPhone: "+1 (555) 389-2041",
    artistId: "artist-1",
    artistName: "Helena Vance",
    title: "Minimalist Red Color Field for Living Pavilion",
    category: "Paintings",
    budgetRange: "$5,000 - $10,000",
    dimensions: "48 x 60 in",
    styleReference: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
    deadline: "2026-11-15",
    description: "Seeking a large format oil painting featuring layered cadmium red, white mineral impasto, and raw linen textures to serve as the focal point of a modern architectural salon.",
    status: "Pending",
    createdAt: "2026-09-21",
  },
  {
    id: "req-202",
    collectorName: "Julian Sterling",
    collectorEmail: "j.sterling@designhouse.de",
    collectorPhone: "+49 30 901820",
    artistId: "artist-1",
    artistName: "Helena Vance",
    title: "Diptych Abstraction in Vermilion",
    category: "Paintings",
    budgetRange: "$2,500 - $5,000",
    quotedPrice: 4200,
    dimensions: "36 x 48 in (Pair)",
    deadline: "2026-12-01",
    description: "Pair of matching vertical canvases with gold leaf highlights for a luxury penthouse dining room.",
    status: "Quoted",
    createdAt: "2026-09-18",
  },
  {
    id: "req-203",
    collectorName: "Sophia Martinez",
    collectorEmail: "sophia@martinez-art.com",
    artistId: "artist-1",
    artistName: "Helena Vance",
    title: "Bronze Monolith Inlay Study",
    category: "Sculpture",
    budgetRange: "$10,000+",
    quotedPrice: 12500,
    dimensions: "24 x 18 x 36 in",
    deadline: "2026-10-30",
    description: "Custom patinated bronze indoor monolith featuring deep red ceramic enamel inlays.",
    status: "Accepted",
    createdAt: "2026-09-10",
  },
  {
    id: "req-204",
    collectorName: "Arthur Pendelton",
    collectorEmail: "arthur@pendelton-holdings.co.uk",
    artistId: "artist-1",
    artistName: "Helena Vance",
    title: "Charcoal Sketch Series on Cotton Rag",
    category: "Drawings",
    budgetRange: "$1,000 - $2,500",
    dimensions: "18 x 24 in",
    deadline: "2026-09-30",
    description: "Series of 3 raw charcoal figurative sketches on heavy weight rag paper.",
    status: "Declined",
    createdAt: "2026-09-05",
  },
];

export default function RequestInboxPage() {
  const [requests, setRequests] = useState<CommissionRequest[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<"All" | CommissionStatus>("All");

  // Quote Dialog Modal State
  const [quoteModalReq, setQuoteModalReq] = useState<CommissionRequest | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState("");

  const handleUpdateStatus = (id: string, newStatus: CommissionStatus, quotedPrice?: number) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: newStatus,
              quotedPrice: quotedPrice !== undefined ? quotedPrice : req.quotedPrice,
            }
          : req
      )
    );
  };

  const handleSendQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteModalReq && quotePriceInput) {
      handleUpdateStatus(quoteModalReq.id, "Quoted", parseFloat(quotePriceInput));
      setQuoteModalReq(null);
      setQuotePriceInput("");
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === "All") return true;
    return req.status === activeTab;
  });

  const getStatusBadge = (status: CommissionStatus) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="border-amber-500/50 text-amber-800 bg-amber-50 text-[10px] uppercase tracking-wider rounded-none font-semibold">
            <Clock className="h-3 w-3 mr-1 text-amber-600" /> Pending Review
          </Badge>
        );
      case "Quoted":
        return (
          <Badge variant="outline" className="border-blue-500/50 text-blue-800 bg-blue-50 text-[10px] uppercase tracking-wider rounded-none font-semibold">
            <DollarSign className="h-3 w-3 mr-0.5 text-blue-600" /> Quote Sent
          </Badge>
        );
      case "Accepted":
        return (
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-800 bg-emerald-50 text-[10px] uppercase tracking-wider rounded-none font-semibold">
            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" /> Accepted
          </Badge>
        );
      case "Declined":
        return (
          <Badge variant="outline" className="border-zinc-400 text-zinc-600 bg-zinc-100 text-[10px] uppercase tracking-wider rounded-none font-semibold">
            <XCircle className="h-3 w-3 mr-1 text-zinc-500" /> Declined
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/60 pb-6 gap-4">
        <div className="space-y-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground p-0 h-auto mb-2"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Return to Studio Dashboard
            </Link>
          </Button>

          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Commission Request Inbox
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Review incoming custom commission inquiries from verified collectors.
          </p>
        </div>

        <Link href="/commission" className="text-xs font-semibold text-primary hover:underline flex items-center">
          Test Collector Form →
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1 overflow-x-auto">
        {(["All", "Pending", "Quoted", "Accepted", "Declined"] as const).map((tab) => {
          const count = tab === "All" ? requests.length : requests.filter((r) => r.status === tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-xs px-4 py-2 uppercase tracking-wider font-semibold transition-all border-b-2 -mb-[2px]",
                isActive
                  ? "border-primary text-primary bg-accent/40"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              )}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Commission Requests Cards List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-background border border-border/80 p-6 space-y-6 shadow-sm transition-all hover:border-primary/40"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/60 pb-4 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-heading text-xl font-bold text-foreground">{req.title}</h3>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    Received: {req.createdAt} • Category: {req.category}
                  </p>
                </div>

                {req.quotedPrice && (
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Quoted Amount</span>
                    <span className="font-heading text-xl font-bold text-primary">${req.quotedPrice.toLocaleString()} USD</span>
                  </div>
                )}
              </div>

              {/* Collector & Specification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border-b border-border/40 pb-4">
                
                {/* Collector Details */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Collector Information
                  </span>
                  <div className="space-y-1 text-foreground font-medium">
                    <div className="flex items-center space-x-2">
                      <User className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{req.collectorName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <a href={`mailto:${req.collectorEmail}`} className="hover:text-primary underline">
                        {req.collectorEmail}
                      </a>
                    </div>
                    {req.collectorPhone && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{req.collectorPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Target Specs & Budget
                  </span>
                  <div className="space-y-1 text-foreground font-medium">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Target Budget: {req.budgetRange}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Dimensions: {req.dimensions}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Deadline: {req.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Reference */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                    Style Reference
                  </span>
                  {req.styleReference ? (
                    <a
                      href={req.styleReference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center space-x-1.5 font-medium truncate"
                    >
                      <FileImage className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{req.styleReference}</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">No link provided</span>
                  )}
                </div>

              </div>

              {/* Vision Description */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                  Collector Vision & Notes
                </span>
                <p className="text-muted-foreground leading-relaxed font-light bg-secondary/20 p-3 border border-border/40">
                  "{req.description}"
                </p>
              </div>

              {/* Interactive Response Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/40">
                <div className="text-[11px] text-muted-foreground">
                  Status: <strong className="text-foreground">{req.status}</strong>
                </div>

                <div className="flex items-center space-x-2">
                  {req.status !== "Quoted" && req.status !== "Accepted" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setQuoteModalReq(req);
                        setQuotePriceInput(req.quotedPrice ? String(req.quotedPrice) : "3500");
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-none h-9 px-4 shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" /> Send Formal Quote
                    </Button>
                  )}

                  {req.status !== "Accepted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(req.id, "Accepted")}
                      className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs uppercase tracking-wider font-semibold rounded-none h-9 px-4"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept Commission
                    </Button>
                  )}

                  {req.status !== "Declined" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateStatus(req.id, "Declined")}
                      className="text-xs text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-none h-9 px-3"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Decline Inquiry
                    </Button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-border bg-secondary/20 p-8 space-y-4">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <h3 className="font-heading text-xl font-semibold text-foreground">
            No commission requests in this view
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You currently have no commission requests matching the selected filter.
          </p>
        </div>
      )}

      {/* Send Quote Modal Dialog */}
      <Dialog open={!!quoteModalReq} onOpenChange={(open) => !open && setQuoteModalReq(null)}>
        <DialogContent className="max-w-md bg-background border-border rounded-none p-6">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Send Price Quote to Collector
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Propose a formal price quote for "{quoteModalReq?.title}".
            </DialogDescription>
          </DialogHeader>

          {quoteModalReq && (
            <form onSubmit={handleSendQuoteSubmit} className="space-y-4 pt-2">
              <div className="bg-secondary/40 p-3 border border-border text-xs space-y-1">
                <div>Collector: <strong>{quoteModalReq.collectorName}</strong></div>
                <div>Target Budget: {quoteModalReq.budgetRange}</div>
                <div>Specs: {quoteModalReq.dimensions} • {quoteModalReq.category}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Formal Quoted Price (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    type="number"
                    placeholder="3500"
                    value={quotePriceInput}
                    onChange={(e) => setQuotePriceInput(e.target.value)}
                    className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary rounded-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-11 rounded-none shadow-md"
              >
                Send Price Quote (${parseFloat(quotePriceInput || "0").toLocaleString()} USD)
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
