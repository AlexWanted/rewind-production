# Architecture

**Analysis Date:** 2026-06-28

## Pattern Overview

**Overall:** Full-stack Next.js 15 application with App Router architecture, Supabase as primary data store, Firebase for authentication, and FTP for video file management.

**Key Characteristics:**
- Server-side rendering with App Router
- Client-side state management via React hooks
- Supabase + Firebase hybrid authentication
- RLS-enforced row-level security
- Client-side image upload handling

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Location: `app/` (Server Components) + client components
- Contains: Layouts, pages, and route segments
- Depends on: `@/components/*`, `@/lib/*`, Firebase/Supabase clients
- Used by: Browser

**Client Components:**
- Purpose: Interactive UI with local state
- Location: Components ending with `-client.tsx`
- Contains: Forms, modals, client-side hooks
- Pattern: `'use client'` directive with client hooks
- Example: `page-client.tsx`, `Navbar.tsx`, admin modals

**Data Layer:**
- Purpose: Data fetching, storage, and mutations
- Location: `lib/` (database clients) + `app/api/*` (API routes)
- Contains: Supabase client, Firebase auth, API handlers
- Depends on: Environment variables, external services
- Used by: Client components and API routes

**Domain Layer:**
- Purpose: Business logic and data models
- Location: `lib/supabase.ts`, database schema
- Contains: Type definitions, data transformations
- Pattern: Separate types per entity (VideoData, PhotoData)
- Example: `toVideoData()`, `toPhotoData()` conversion functions

## Data Flow

**Public Content Retrieval:**
```
Browser → app/page.tsx → Server Component → Client Components
                                     ↓
                            Public Supabase tables (videos, photos)
                                     ↓
                            Frontend display with loading states
```

**Admin Authentication:**
```
Browser → app/admin/page.tsx → Google OAuth (Firebase)
                             ↓
                   Supabase users table (role check)
                             ↓
                   Admin dashboard access granted
```

**Content Management (Create/Update):**
```
Admin Client → useAdminMutations → Supabase direct operations
     ↓
  For videos/photos: Local state + order management
     ↓
  Order updates via batch updates on supabase
     ↓
  Client polls for new data on changes
```

**File Upload:**
```
Client → app/api/upload/route.ts → FTP server
    ↓
  FormData parsing → Buffer conversion
    ↓
  FTP upload with directory structure
    ↓
  Returns public URL for asset management
```

**State Management:**
- React `useState` for client-side state
- `useEffect` for data fetching and side effects
- Context-like pattern via `useAdminState` hook
- Order sorting managed locally before batch server update
- Supabase as source of truth, not client cache

## Key Abstractions

**Supabase Client:**
- Purpose: Database and authentication client
- Examples: `lib/supabase.ts`, `components/admin/useAdminData.ts`
- Pattern: Separate client for admin (service role key)
- Features: Type-safe queries, row-level security enforcement

**Admin State Management:**
- Purpose: Centralized admin state and mutations
- Examples: `components/admin/useAdminState.ts`, `useAdminMutations.ts`, `useAdminData.ts`
- Pattern: Separate hooks for state, mutations, and data fetching
- Features: Order management, form state, file upload handling

**Type Definitions:**
- Purpose: TypeScript interfaces matching database schema
- Location: `lib/supabase.ts` (exported interfaces)
- Pattern: Explicit VideoData, PhotoData types
- Features: Runtime validation, type inference

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Initial HTML render
- Responsibilities: Metadata configuration, root HTML structure
- Key configurations: SEO metadata, Open Graph, custom fonts (via CSS)

**Main Page:**
- Location: `app/page.tsx`
- Triggers: Home route access
- Responsibilities: Page metadata, component composition
- Components: Navbar, Hero, VideoPortfolio, PhotoPortfolio, Services, About, Contact, Footer

**Admin Dashboard:**
- Location: `app/admin/page.tsx`
- Triggers: `/admin` route access (requires authentication)
- Responsibilities: Admin authentication, content management UI
- Features: Google OAuth login, video/photo management, file upload

**API Routes:**
- Location: `app/api/*`
- Triggers: API requests from client or server
- Responsibilities: File upload (FTP), file listing/deletion (local), endpoint handlers
- Examples: `/api/upload`, `/api/files`, `/api/uploads/[...path]`

## Error Handling

**Strategy:** Try-catch blocks with console.error, NextResponse with status codes

**Patterns:**
- API routes return JSON errors with descriptive messages
- Client components use loading/error states from hooks
- Supabase errors logged to console, UI shows loading states
- Form errors handled via client-side validation (not shown in current code)

**Example:**
```typescript
try {
  await supabase.from('videos').select('*');
} catch (error) {
  console.error("Error fetching data:", error);
  // Don't alert - let the UI handle it
}
```

## Cross-Cutting Concerns

**Authentication:**
- Provider: Google OAuth via Firebase Auth
- Location: `lib/firebase.ts`, `app/admin/page.tsx`
- Admin check: Supabase users table (role='admin')
- Public access: Supabase RLS policies allow read access for all users

**Validation:**
- Database-level: NOT NULL constraints, length checks, URL patterns
- Frontend: Not implemented (placeholder mutations show proper intent)
- Example: `CHECK (char_length(title) > 0 AND char_length(title) <= 100)`

**File Management:**
- Upload: Client-side file selection → FTP API route → remote server
- Storage: Public uploads directory on filesystem (not Supabase Storage)
- Access: File listing via recursive directory scanner, served via public path

**Performance:**
- Supabase queries with indexes on category, order, created_at
- Batch order updates via client-side sorting before batch server calls
- Image rendering via optimized Supabase queries
- Next.js image optimization disabled (still standard optimization via `<img>`)

---

*Architecture analysis: 2026-06-28*