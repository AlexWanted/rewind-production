# External Service Integrations

**Analysis Date:** 2026-06-28

## Database & Storage

### Supabase (PostgreSQL)

**Connection:**
- Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- Library: `@supabase/supabase-js` ^2.45.0

**Usage Patterns:**
- **Client-side:** Anonymous access with disabled session persistence
  - No auto-refresh token
  - No session persistence
  - Used for data fetching in public-facing pages

- **Server-side:** Admin operations using service role key
  - Full admin privileges
  - Server-side only (never expose service key to client)
  - Used for data mutations (insert/update/delete)

**Database Schema:**
- `public.videos` - Video portfolio data with video URLs, metadata, and ordering
- `public.photos` - Photo portfolio data with multiple images and metadata
- `public.users` - User management for admin roles with foreign key to auth.users
- Triggers for automatic `updated_at` timestamp updates
- Composite indexes on category, order, and created_at

**Security:**
- Row Level Security (RLS) enabled on all tables
- Public SELECT policies on videos and photos
- Admin-only policies for INSERT, UPDATE, DELETE operations
- Admin authentication via `users` table with role = 'admin'
- Special case for `rewindproductionboss@gmail.com` email for admin access
- Trigger-based audit trail with `updated_at` timestamps

### Firebase

**Connection:**
- Environment Variables:
  - `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key (public)
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase Auth domain
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase Storage bucket
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging sender ID
  - `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase App ID
- Libraries: `firebase` ^12.10.0, `react-firebase-hooks` ^5.1.1

**Usage:**
- **Purpose:** Authentication only (database features not configured)
- **Implementation:** `lib/firebase.ts` initializes Firebase app and auth
- **Client:** Used for user authentication integration (implementation details in auth flows)

**Firestore Rules:**
- Rules version 2
- Collect: `videos`, `photos`, `users`
- Public read access for videos and photos (authenticated users only)
- Admin-only writes with validation rules
- Email verification requirement for admin access
- URL validation (HTTP/HTTPS only, max 500 chars)
- Immutable `createdAt` timestamps
- Cannot delete own account

## AI Services

### Google Gemini

**Integration:**
- SDK: `@google/genai` ^1.17.0
- Purpose: AI-powered generation features (implementation details in app components)
- Environment Variables:
  - `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY` - API key for Gemini (required)
- Integration patterns:
  - Client-side AI generation
  - Streaming responses (potential feature)
  - Function calling (potential feature)
  - Image/video understanding (potential use case for photo/video portfolio app)

## File Upload & Storage

### FTP Server

**Integration:**
- Library: `ftp` ^0.3.10
- Environment Variables:
  - FTP server configuration (hostname, credentials)
  - Upload path/permissions

**Usage:**
- `lib/upload.ts` - File upload utility
- Uploads to `/api/upload` endpoint
- Supports file and folder metadata
- Error handling for upload failures

### File Storage Strategy

- **Public assets:** Supabase storage or CDN (external URLs)
- **User uploads:** FTP server integration
- **Video files:** Supabase or external hosting (video_url in database)
- **Photo files:** Supabase or external hosting (image URLs in database)

## API Endpoints

### Public API (Unimplemented)

- `/api/upload` - File upload endpoint (supports FormData)
  - POST method
  - Uploads files to FTP server
  - Returns uploaded file URL

**Directory Structure:**
- `app/api/upload/` - Upload endpoint route
- `app/api/files/` - File management endpoints
- `app/api/uploads/` - Alternative file endpoints

## Environment Configuration

**Required Environment Variables:**

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side service key (admin operations)

### Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase Auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase Storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase App ID

### Google Gemini
- `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY` - Gemini API key

### Other
- FTP configuration (hostname, credentials)
- CORS configuration (if needed)
- API endpoint URLs (if using external services)

**Configuration Files:**
- `.env` - Environment configuration file
- `.gitignore` - Ignores `.env` but includes `.env.example` (template)
- No credentials in git - sensitive data should not be committed

## Webhook & Callbacks

### Incoming
- Not configured - no webhooks or callbacks detected

### Outgoing
- Not configured - no outgoing webhook or callback endpoints detected

**Implementation Notes:**
- File upload pattern uses direct upload to FTP server
- Supabase real-time subscriptions enabled but not utilized in current implementation
- Firebase Auth integration exists but database features not configured

---

*Integration audit: 2026-06-28*