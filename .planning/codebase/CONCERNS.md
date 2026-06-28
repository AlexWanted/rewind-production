# Codebase Concerns

**Analysis Date:** 2026-06-28

## Critical Security Concerns

### Hardcoded Credentials in Source Control
**Issue:** All API keys and service credentials are hardcoded in `.env` file which is committed to version control.
**Files:**
- `.env` - Contains Firebase API key, Supabase service role key, FTP credentials
- `lib/firebase.ts` - Uses hardcoded env vars without validation
- `lib/supabase.ts` - Uses hardcoded env vars without validation
**Impact:** Complete compromise of Firebase, Supabase, and FTP services.
**Fix Approach:** Create `.env.example` and enforce using secret management (HashiCorp Vault, AWS Secrets Manager, or Supabase Secrets).

### Hardcoded Administrative Credentials
**Issue:** Hardcoded email "rewindproductionboss@gmail.com" in security rules for admin bypass.
**Files:**
- `firestore.rules` - Line 57, 87, 110, 126, 135, 140, 149, 165
- `supabase-schema.sql` - Line 87, 110, 165
**Impact:** Admin bypass vulnerability that defeats role-based access control.
**Fix Approach:** Store admin email in database (public.users table) and reference in security rules.

### Missing Input Validation
**Issue:** No server-side input validation for file uploads and user inputs.
**Files:**
- `lib/upload.ts` - Accepts any file without size/type validation
**Impact:** Potential for DoS attacks via large files, malicious file uploads.
**Fix Approach:** Add server-side validation (MIME type checking, file size limits, virus scanning).

### Environment Variable Exposure
**Issue:** Missing validation on startup and no secrets encryption at rest.
**Files:**
- `lib/firebase.ts` - Uses `!` non-null assertion without checking
- `lib/supabase.ts` - Same pattern
**Impact:** Application crashes or crashes with error messages revealing infrastructure.
**Fix Approach:** Implement validation on startup, use runtime environment checks.

## Technical Debt

### Duplicate Schema Definitions
**Issue:** Database schema defined in two locations.
**Files:**
- `supabase-schema.sql` - Complete Supabase schema
- `supabase/schema.sql` - Different/older version
**Impact:** Configuration drift, deployment errors, difficult migrations.
**Fix Approach:** Consolidate to single source of truth.

### No Database Migrations System
**Issue:** No migration framework (e.g., Prisma Migrate, Drizzle ORM) to track schema changes.
**Files:**
- Schema defined directly via SQL
**Impact:** Breaking changes deployed without migration scripts, difficult rollback.
**Fix Approach:** Implement migration framework with version tracking.

### Missing Foreign Key Relationships
**Issue:** Users table foreign key to auth.users but no cascade configuration documented.
**Files:**
- `supabase-schema.sql` - Line 57
**Impact:** Potential orphan records if auth.users are deleted.
**Fix Approach:** Document cascade behavior, consider RESTRICT for user deletion.

### Duplicate Metadata Configuration
**Issue:** Same metadata repeated in layout.tsx and page.tsx.
**Files:**
- `app/layout.tsx` - Metadata defined (lines 4-34)
- `app/page.tsx` - Metadata defined (lines 10-40)
**Impact:** Maintenance burden, potential sync issues.
**Fix Approach:** Extract to shared constants file.

## Performance Concerns

### Unbounded File Uploads
**Issue:** No file size limits in upload handler.
**Files:**
- `lib/upload.ts` - No size validation
**Impact:** Server resource exhaustion via large uploads.
**Fix Approach:** Add size limits (e.g., 50MB max), resize large images.

### No Caching Strategy
**Issue:** No caching configuration for images, API responses, or client-side data.
**Files:**
- No Next.js caching setup
**Impact:** Increased bandwidth, slower page loads.
**Fix Approach:** Configure Next.js Image component optimization, implement client-side caching.

### Missing Image Optimization
**Issue:** No image resizing, compression, or WebP conversion.
**Files:**
- No CDN configuration
- No image transformation pipeline
**Impact:** High bandwidth usage, slower page loads.
**Fix Approach:** Implement image optimization pipeline (Vercel Image, Cloudinary, or Next.js Image).

### No CDN Configuration
**Issue:** No CDN for static assets (images, fonts).
**Files:**
- No CDN configuration in next.config.ts
**Impact:** Global users experience slower loads, higher bandwidth costs.
**Fix Approach:** Configure CDN (Vercel, Cloudflare, or Supabase CDN).

## Maintainability Concerns

### Tight Coupling
**Issue:** All components imported in single page component without separation.
**Files:**
- `app/page.tsx` - Imports 8 components in sequence
**Impact:** Difficult to modify one component without touching entire file.
**Fix Approach:** Consider route-based organization, feature-based folder structure.

### Missing TypeScript Strict Mode
**Issue:** TypeScript may not be running in strict mode.
**Files:**
- `tsconfig.json` - Not examined but may have relaxed settings
**Impact:** Runtime errors due to type safety gaps.
**Fix Approach:** Enable strict mode in tsconfig.json.

### Code Duplication
**Issue:** Similar patterns repeated across components (navigation, modal handling).
**Files:**
- `components/PhotoModal.tsx` - Should be reviewed for duplicates
- `components/VideoModal.tsx` - Similar patterns
**Impact:** Maintenance burden, inconsistent behavior.
**Fix Approach:** Extract common patterns to custom hooks or components.

### No Error Boundaries
**Issue:** No React Error Boundaries implemented.
**Files:**
- No error boundary components
**Impact:** Unhandled errors crash entire application.
**Fix Approach:** Add error boundary components to layout.

### Missing Logging Infrastructure
**Issue:** No structured logging or error tracking.
**Files:**
- No logging utilities
**Impact:** Difficult to debug production issues.
**Fix Approach:** Implement structured logging (LogRocket, Sentry, or custom logger).

## Testing Gaps

### No Test Framework
**Issue:** No testing framework configured.
**Files:**
- No `package.json` scripts for testing
- No test files in codebase
**Impact:** No safety net for regressions, difficult to validate changes.
**Fix Approach:** Add testing framework (Vitest, Jest) and write tests.

### No CI/CD Testing
**Issue:** Deployment workflow has no testing steps.
**Files:**
- `.github/workflows/deploy.yml` - No test jobs
**Impact:** Broken code deployed to production.
**Fix Approach:** Add linting and testing jobs to CI/CD pipeline.

### No Integration Tests
**Issue:** No integration tests for database or API endpoints.
**Files:**
- No integration test files
**Impact:** Database migrations fail in production, API breaking changes undetected.
**Fix Approach:** Add integration tests for critical paths.

### No E2E Tests
**Issue:** No E2E tests for user workflows.
**Files:**
- No E2E test configuration
**Impact:** User-facing bugs reach production undetected.
**Fix Approach:** Add E2E tests for critical user flows (e.g., contact form submission).

## Infrastructure & Deployment Concerns

### Basic SSH Deployment
**Issue:** SSH deployment without health checks or rollback.
**Files:**
- `.github/workflows/deploy.yml` - Simple git pull without validation
**Impact:** Failed deployments take time to detect and require manual rollback.
**Fix Approach:** Add health check endpoint, deployment rollback mechanism.

### No Environment Specific Configurations
**Issue:** Single configuration for all environments (dev, staging, production).
**Files:**
- `.env` contains all configurations
**Impact:** Risk of credentials leaking to incorrect environments.
**Fix Approach:** Use environment-specific configuration files.

### No Secrets Management
**Issue:** Secrets stored in .env file, not in secrets manager.
**Files:**
- `.env` - All secrets
**Impact:** Secrets leak if .env is committed (already occurred), difficult rotation.
**Fix Approach:** Use cloud secret manager (AWS Secrets Manager, GCP Secret Manager, Supabase Secrets).

### Missing Security Scanning
**Issue:** No security scanning in CI/CD pipeline.
**Files:**
- `.github/workflows/deploy.yml` - No security checks
**Impact:** Vulnerabilities deployed to production.
**Fix Approach:** Add security scanning (Snyk, Dependabot, or OWASP ZAP).

### No Backup Strategy
**Issue:** No database backup strategy documented.
**Files:**
- No backup scripts or configurations
**Impact:** Data loss risk in case of failures.
**Fix Approach:** Implement automated backups with retention policy.

## Configuration Concerns

### Missing .env.example
**Issue:** No template for environment variables.
**Files:**
- No `.env.example` file
**Impact:** New developers don't know required configuration.
**Fix Approach:** Create `.env.example` with all required variables.

### Linting Disabled During Builds
**Issue:** ESLint configured to ignore during builds.
**Files:**
- `next.config.ts` - Lines 5-7: `eslint: { ignoreDuringBuilds: true }`
**Impact:** Errors pushed to production unnoticed.
**Fix Approach:** Run linting during build, fail build on errors.

### Incomplete ESLint Configuration
**Issue:** Minimal ESLint setup with default Next.js config.
**Files:**
- `eslint.config.mjs` - Basic configuration
**Impact:** No custom linting rules for code quality.
**Fix Approach:** Add custom rules for security, performance, best practices.

### No TypeScript Strict Settings
**Issue:** No strict mode or nostrictNullChecks documented.
**Files:**
- `tsconfig.json` - Not examined but may need strict settings
**Impact:** Runtime errors from type safety gaps.
**Fix Approach:** Enable strict mode and all recommended settings.

## API & Integration Concerns

### Inconsistent Data Storage
**Issue:** Both Firebase and Supabase configured but usage unclear.
**Files:**
- `lib/firebase.ts` - Authentication configured
- `lib/supabase.ts` - Database operations configured
- `supabase-schema.sql` - Supabase schema
**Impact:** Confusion about which service to use, resource waste.
**Fix Approach:** Clarify architecture, deprecate unused service or integrate properly.

### Missing API Routes
**Issue:** No backend API routes for server-side logic.
**Files:**
- No `app/api` directory
**Impact:** Server-side logic must run client-side (security risk).
**Fix Approach:** Implement API routes for sensitive operations.

### No Rate Limiting
**Issue:** No rate limiting on public endpoints.
**Files:**
- No rate limiting configuration
**Impact:** Vulnerable to DoS attacks and abuse.
**Fix Approach:** Add rate limiting (Supabase RLS policies, Nginx, or API gateway).

### No CORS Configuration
**Issue:** CORS not configured, may cause API integration issues.
**Files:**
- No CORS middleware configured
**Impact:** Frontend cannot call backend APIs from different domains.
**Fix Approach:** Add CORS configuration for allowed origins.

## Data Migration Concerns

### No Data Migration Scripts
**Issue:** No scripts to migrate data between environments.
**Files:**
- No migration scripts for dev→staging→production
**Impact:** Data inconsistencies between environments.
**Fix Approach:** Implement automated data migration pipeline.

### Schema Change Process Undocumented
**Issue:** No documented process for schema changes.
**Files:**
- No migration documentation
**Impact:** Breaking changes deployed without understanding impact.
**Fix Approach:** Document change process with migration scripts.

---

*Concerns audit: [date]*