# Codebase Structure

**Analysis Date:** 2026-06-28

## Directory Layout

```
C:\rewind production/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries and configurations
├── supabase/               # Supabase-related files and migrations
├── scripts/                # Build and deployment scripts
├── .github/                # GitHub workflow configurations
├── .next/                  # Build output (generated)
├── .planning/              # Documentation and planning (generated)
└── node_modules/           # Dependencies (generated)
```

## Directory Purposes

**app/:**
- Purpose: Next.js App Router route definitions and layout files
- Contains: Page components, layouts, API routes
- Key files: `layout.tsx`, `page.tsx`, `page-client.tsx`, `page-wrapper.tsx`
- Structure: Route groups and segments (admin, api, photography, works)

**components/:**
- Purpose: Reusable UI components and feature components
- Contains: Feature components (`Navbar`, `Hero`, `VideoPortfolio`, etc.) and admin components (`admin/` folder)
- Key files: `Navbar.tsx`, `Hero.tsx`, `VideoPortfolio.tsx`, `components/admin/*`
- Organization: Feature components in root, admin components in subdirectory

**hooks/:**
- Purpose: Custom React hooks for state and logic
- Contains: Single custom hook (`use-mobile.ts`)
- Pattern: Client-side only hooks with `'use client'` directive

**lib/:**
- Purpose: Shared utilities, configuration, and database clients
- Contains: Firebase configuration, Supabase client with types, file upload utilities
- Key files: `firebase.ts`, `supabase.ts`, `upload.ts`, `utils.ts`
- Organization: Database clients, API helpers, utility functions

**supabase/:**
- Purpose: Supabase-related files and configuration
- Contains: Configuration and schema files
- Key files: `supabase-schema.sql` (database schema with tables and RLS policies)

**scripts/:**
- Purpose: Build, deployment, and automation scripts
- Contains: Build and deployment scripts (scripts directory exists but file contents not shown)

**.github/:**
- Purpose: GitHub workflow configurations and CI/CD
- Contains: GitHub Actions workflows for CI/CD

**Public files (root):**
- Purpose: Configuration and documentation
- Key files: `package.json`, `next.config.ts`, `tsconfig.json`, `Dockerfile`
- Additional: `.env`, `.eslintrc.json`, `.gitignore`, `metadata.json`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout with metadata and HTML structure
- `app/page.tsx`: Main landing page with public content components
- `app/admin/page.tsx`: Admin dashboard with authentication and content management

**Configuration:**
- `next.config.ts`: Next.js configuration (image optimization, standalone output, webpack settings)
- `tsconfig.json`: TypeScript configuration with path aliases (`@/*` → `./*`)
- `package.json`: Dependencies and npm scripts
- `supabase-schema.sql`: Database schema with tables and security policies

**API Routes:**
- `app/api/upload/route.ts`: File upload to FTP server
- `app/api/files/route.ts`: File listing from local public uploads directory
- `app/api/uploads/[...path]`: Static file serving for uploaded files

**Data Layer:**
- `lib/supabase.ts`: Supabase client with types, admin client factory
- `lib/firebase.ts`: Firebase auth initialization
- `lib/upload.ts`: File upload utilities
- `lib/utils.ts`: Utility functions

**Admin Components:**
- `components/admin/AdminHeader.tsx`: Admin navigation header
- `components/admin/AdminTabs.tsx`: Tab navigation for different content types
- `components/admin/VideoList.tsx`: Video management UI
- `components/admin/PhotoList.tsx`: Photo management UI
- `components/admin/FileList.tsx`: File management UI
- `components/admin/VideoEditorModal.tsx`: Video edit form modal
- `components/admin/PhotoEditorModal.tsx`: Photo edit form modal
- `components/admin/useAdminState.ts`: Admin state management hook
- `components/admin/useAdminMutations.ts`: Admin mutation hooks
- `components/admin/useAdminData.ts`: Data fetching hook
- `components/admin/useEditorState.ts`: Editor-specific state hook

**Feature Components:**
- `Navbar.tsx`: Navigation bar with links
- `Hero.tsx`: Hero section component
- `VideoPortfolio.tsx`: Video portfolio display
- `PhotoPortfolio.tsx`: Photo portfolio display
- `Services.tsx`: Services section
- `About.tsx`: About section
- `Contact.tsx`: Contact section
- `Footer.tsx`: Page footer

**Custom Hooks:**
- `hooks/use-mobile.ts`: Mobile device detection hook

**Shared UI Components:**
- `components/ui/typography.tsx`: Typography components and utilities

## Naming Conventions

**Files:**
- Server Components: `page.tsx`, `layout.tsx`
- Client Components: `*-client.tsx`, `use*` files
- Admin Components: Grouped in `admin/` subdirectory
- Type definitions: Interface names with `Data` suffix (VideoData, PhotoData)

**Directories:**
- Route groups: `app/admin/`, `app/photography/`, `app/works/`
- Feature components: Organized by feature type (admin, ui, etc.)
- Shared utilities: Organized by purpose (firebase, supabase, upload, utils)

**Module Organization:**
- Client components and hooks marked with `'use client'` directive
- Admin logic split across multiple hooks (state, mutations, data)
- Type definitions colocated with usage or in lib/supabase.ts

## Where to Add New Code

**New Page Route:**
- Create directory in `app/` with route segment
- Create `page.tsx` (Server Component) and `page-client.tsx` (if needed)
- Add metadata to `page.tsx`
- Use client components for interactivity

**New Client Component:**
- Create file in `components/` (non-admin) or `components/admin/` (admin)
- Add `'use client'` directive at top
- Export as named function or const
- Use custom hooks from `hooks/` and `components/admin/*`

**New Admin Feature:**
- Create component in `components/admin/`
- Add hook in `components/admin/useAdminState.ts`, `useAdminMutations.ts`, or `useAdminData.ts`
- Create UI component in `components/admin/*`
- Update admin page to integrate new component

**New Utility:**
- Add to `lib/` with descriptive name
- Export from `lib/` file
- Use relative imports from client components

**New API Route:**
- Create route directory in `app/api/`
- Export async function as `GET` or `POST`
- Return `NextResponse` with JSON data or errors
- Mark `dynamic = 'force-dynamic'` for server-side rendering

**New Database Table:**
- Add schema to `supabase-schema.sql`
- Create TypeScript types in `lib/supabase.ts`
- Add RLS policies for appropriate access
- Create update/delete operations in admin mutations

**New Shared UI Component:**
- Add to `components/ui/` directory
- Use Tailwind CSS for styling
- Follow existing component patterns and class conventions
- Export single component

## Special Directories

**public/ (implicit):**
- Purpose: Static assets served directly by Next.js
- Contains: Uploaded files (managed via `public/uploads/`)
- Access: Served at `/uploads/*` path
- Management: File listing via `app/api/files/route.ts`, deletion via `DELETE` method

**.planning/:**
- Purpose: Codebase documentation and planning (generated)
- Contains: Architecture and structure analysis documents
- Status: Generated by GSD mapping process

**.next/:**
- Purpose: Next.js build output and cache
- Status: Generated, not committed

**node_modules/:**
- Purpose: JavaScript dependencies
- Status: Generated, not committed

**Generated files:**
- `.next/*`: Build artifacts
- `.planning/*`: Documentation artifacts
- `public/uploads/*`: User-uploaded files

---

*Structure analysis: 2026-06-28*