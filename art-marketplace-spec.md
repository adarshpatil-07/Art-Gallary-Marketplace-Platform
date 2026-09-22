# Art Marketplace — MVP Spec

## 1. Core Concept
A premium art marketplace where only real, physical, non-AI art is listed for sale, with a
commission-request feature letting buyers contact artists directly for custom work.

## 2. MVP Feature Scope

### Must work end-to-end
- **Auth** — two roles: Artist, Buyer (email/password)
- **Artist profile + portfolio** — bio, verification badge, list of artworks
- **Artwork listing** — image(s), title, medium, dimensions, price, category, process note
  (artist's description of how the piece was made — this is the trust mechanism instead of
  after-the-fact AI detection)
- **Gallery/browse page** — grid view, filter by category/medium/price, keyword search
- **Artwork detail page** — full view, price, artist info, "Buy" / "Contact Artist" actions
- **Commission request flow** — structured form (budget, size, style references, deadline,
  description) sent to a specific artist or posted as an open request; status tracked
  (Pending → Quoted → Accepted → Declined)
- **Request inbox** — artist sees incoming requests, can quote/accept/decline; buyer sees status
- **Report/moderation** — report button on listings/requests; admin review queue

### Explicitly deferred (not MVP, but designed so they slot in later without a rewrite)
- Real payments — MVP uses "contact to arrange payment"; Stripe Connect planned for later
- Shipping/logistics
- Live chat — request inbox with status is enough for now
- Dedicated search engine — Postgres filtering is enough at MVP scale

## 3. Data Models (Django apps)

**accounts**
- `User` (extends Django's auth user) — role: artist | buyer, verified: bool
- `ArtistProfile` — user (1:1), bio, portfolio links

**artworks**
- `Artwork` — artist (FK), title, description, medium, category, dimensions, price,
  process_note, status (available/sold), extra_attributes (JSONB, for category-specific fields)
- `ArtworkImage` — artwork (FK), image_url (points to Cloudflare R2), is_primary

**commissions**
- `CommissionRequest` — buyer (FK), artist (FK, nullable if open request), budget, size,
  description, reference_images, deadline, status
- `CommissionStatusLog` — request (FK), old_status, new_status, timestamp (audit trail)

**moderation**
- `Report` — reporter (FK), content_type, object_id, reason, status (open/reviewed/actioned)

**orders** (stub for MVP)
- `Order` — buyer (FK), artwork (FK), status, created_at — no real payment processing yet

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js + Tailwind CSS + shadcn/ui |
| Backend | Django + Django REST Framework |
| Database | PostgreSQL (hosted: Neon or Supabase free tier for dev) |
| Image storage | Cloudflare R2 |
| Search | Postgres filtering (MVP) → Meilisearch later |
| Auth | Django built-in auth + JWT (djangorestframework-simplejwt) |
| Payments (future) | Stripe Connect |
| Hosting | Vercel (frontend) + Railway/Render (backend + DB) |

## 5. Repo Structure

```
art-marketplace/
├── frontend/                # Next.js app
│   ├── app/                 # routes, organized by feature
│   ├── components/
│   └── lib/api-client.ts    # single typed layer for all backend calls
└── backend/                 # Django project
    ├── accounts/
    ├── artworks/
    ├── commissions/
    ├── moderation/
    ├── orders/
    └── core/                # shared settings/utilities
```

## 6. Build Order
1. Django models + admin panel (accounts → artworks → commissions → moderation → orders stub)
2. DRF serializers + API endpoints for each app
3. Frontend pages (v0-generated) wired to the API, in this order: browse/gallery → artwork
   detail → auth → artist dashboard/inbox → commission request form
4. Deploy (Vercel + Railway) with hosted Postgres + R2
5. Only after real usage: add Stripe Connect, Meilisearch, live chat

## 7. Tooling
- **v0** — generate frontend UI components/pages
- **Claude Code / Cursor** — write Django backend, wire frontend to API, own overall repo structure
- **Bolt.new** — optional, disposable prototyping only
