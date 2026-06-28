# Technology Stack

**Analysis Date:** 2026-06-28

## Languages

**Primary:**
- **TypeScript** 5.9.3 - Type-safe development with Next.js and React 19
- **JavaScript (ES6+)** - React components and client-side code

**Secondary:**
- **SQL** - Supabase database queries and RLS policies

## Runtime

**Environment:**
- **Node.js** 20 (via Alpine Docker image)

**Package Manager:**
- **npm** - Package installation and management
- **Lockfile:** package-lock.json

## Frameworks

**Core:**
- **Next.js** 15.4.9 - React framework with App Router (default)
- **React** 19.2.1 - UI rendering and interactivity
- **React DOM** 19.2.1 - Client-side rendering

**Styling:**
- **Tailwind CSS** 4.2.2 - Utility-first CSS framework (v4 with new PostCSS plugin)
- **PostCSS** 8.5.6 - CSS processing
- **Autoprefixer** 10.4.21 - Automatic vendor prefix injection
- **@tailwindcss/postcss** 4.2.2 - Tailwind v4 PostCSS plugin
- **@tailwindcss/typography** 0.5.19 - Typography plugin for Tailwind

**Animation:**
- **motion** 12.23.24 - Motion animations (Framer Motion wrapper)
- **tw-animate-css** 1.4.0 - Tailwind CSS animation utilities

## Databases & Storage

**Primary Database:**
- **Supabase** (PostgreSQL) - Main database with RLS policies
  - Client: @supabase/supabase-js ^2.45.0
  - Features: Row-level security, authentication, real-time subscriptions (configured)
  - Schema: Videos, Photos, Users tables with triggers and indexes

**Authentication:**
- **Firebase Auth** - Firebase authentication (separate from Supabase auth)
  - Client: firebase ^12.10.0, react-firebase-hooks ^5.1.1

## AI & Machine Learning

**AI Integration:**
- **Google Gemini** - AI model integration
  - SDK: @google/genai ^1.17.0
  - Purpose: AI-powered generation features (implementation details in app code)

## UI Components & Libraries

**Icons:**
- **Lucide React** ^0.553.0 - Icon library

**Utility Libraries:**
- **class-variance-authority** ^0.7.1 - CSS class variance management
- **clsx** ^2.1.1 - Conditional class name utilities
- **tailwind-merge** ^3.3.1 - Tailwind class merging
- **tw-animate-css** ^1.4.0 - Animation utilities

**Form Handling:**
- **react-hook-form** (implied) - Form state management
- **@hookform/resolvers** ^5.2.1 - Form validation integration

## File Upload

**FTP Integration:**
- **ftp** ^0.3.10 - File upload to FTP server

## Build Tools & Configuration

**Build System:**
- **Next.js Build** - npm run build
- **Docker** - Containerized deployment
  - Multi-stage build (builder and runner)
  - Standalone output mode

**Type Checking:**
- **TypeScript** 5.9.3 - Type safety with strict mode enabled

**Linting:**
- **ESLint** 9.39.1 - Code quality checking
- **@next/eslint-config-next** 16.0.8 - Next.js ESLint rules

**Image Optimization:**
- **Next.js Image Optimizer** - Remote image support (Picsum.photos)

**Configuration Files:**
- **next.config.ts** - Next.js configuration (standalone output, transpile motion)
- **tsconfig.json** - TypeScript configuration (strict mode, path aliases)
- **postcss.config.mjs** - PostCSS/Tailwind configuration
- **.eslintrc.json** - ESLint configuration (extends next)

**Scripts:**
- `dev` - Development server
- `build` - Production build
- `start` - Production server
- `lint` - Linting
- `clean` - Clean build artifacts

## Development Environment

**Platform:**
- **Windows** - Development platform
- **Node.js 20** - Runtime

**Setup:**
- Type-safe development with TypeScript strict mode
- Path aliases configured (@/*)
- Strict mode enabled
- Bundler module resolution

---

*Stack analysis: 2026-06-28*