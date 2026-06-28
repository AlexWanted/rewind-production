# Coding Conventions

**Analysis Date:** 2026-06-28

## TypeScript Typing Patterns

### Strict Mode Configuration
- Strict mode enabled in `tsconfig.json` (target: ES2017)
- No "any" types allowed
- Required environment variables using non-null assertion operator (`!`)

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
```

### Type Definitions
- Interface definitions for component props and data shapes
- Separate type export alongside component export
- Optional properties using `?` modifier

```typescript
export type PhotoData = {
  id: string;
  images: string[];
  src?: string;
  alt: string;
  photographer?: string;
  location?: string;
  date?: string;
  camera?: string;
  order?: number;
};

interface PhotoModalProps {
  photo: PhotoData;
  onClose: () => void;
}
```

### Local Type Imports
- Type imports from `@/` alias for local modules
- Data transformation functions with typed parameters and return values

```typescript
import { supabase, toPhotoData } from '@/lib/supabase';

export function toPhotoData(data: any): PhotoData {
  return {
    id: data.id,
    images: data.images || [],
    alt: data.alt,
    // ... mapping logic
  };
}
```

## React Component Patterns

### Client Components
- All interactive components use `'use client'` directive
- Separation of server and client components where appropriate
- Server components for metadata-only pages

```typescript
'use client';

import React from 'react';
```

### Component Structure
- Functional components with props interfaces
- State management using hooks
- Side effects in `useEffect` with cleanup

```typescript
export default function PhotoPortfolio() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Logic here
    return () => {
      // Cleanup here
    };
  }, []);
}
```

### State Management Patterns
- `useState` for component-level state
- `useEffect` for data fetching and side effects
- Parallel data fetching using `Promise.all`

```typescript
const [videosData, photosData, filesResponse] = await Promise.all([
  supabase.from('videos').select('*'),
  supabase.from('photos').select('*'),
  fetch('/api/files'),
]);
```

### Custom Hooks
- Reusable custom hooks in `hooks/` directory
- React hooks with proper TypeScript typing
- Hook parameters and return types exported

```typescript
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

### Component Composition
- Component composition over complex state lifting
- Children prop for composability
- Modal/sheet components with controlled behavior

```typescript
interface HomeClientProps {
  children: React.ReactNode;
}

export default function HomeClient({ children }: HomeClientProps) {
  return <>{children}</>;
}
```

## Error Handling Patterns

### Try-Catch-Finally
- Error handling wrapped in try-catch-finally blocks
- Fallback values provided on error
- Console.error for debugging
- Silent handling for non-critical errors

```typescript
try {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('"order"', { ascending: true });

  if (error) throw error;

  if (data && data.length > 0) {
    const fetchedPhotos = data.map(toPhotoData);
    setPhotos(fetchedPhotos.slice(0, 4));
  } else {
    setPhotos(fallbackPhotos);
  }
} catch (error) {
  console.error("Error fetching photos:", error);
  setPhotos(fallbackPhotos);
} finally {
  setLoading(false);
}
```

### Graceful Degradation
- Fallback data structures for error cases
- Null checks before accessing data
- Optional chaining for safe property access

```typescript
const photos = photo.images?.length > 0 ? photo.images : (photo.src ? [photo.src] : []);
```

### Environment Variable Validation
- Validation at module level with immediate error throw
- Clear error messages for missing configuration

```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local');
}
```

## Async/Await and Promise Patterns

### Data Fetching
- Async functions for data operations
- Proper error propagation with `throw error`
- Loading state management during async operations

```typescript
const fetchPhotos = async () => {
  try {
    setLoading(true);
    // Fetch logic
    setPhotos(fetchedPhotos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    setPhotos(fallbackPhotos);
  } finally {
    setLoading(false);
  }
};
```

### Error Propagation
- Errors thrown in async operations
- Caught and logged in parent components

```typescript
if (videosData.error) throw videosData.error;
```

### State Consistency
- State updates after error handling
- Loading states synchronized with async operations

```typescript
finally {
  setLoading(false);
}
```

## Component Composition Patterns

### Modals and Overlays
- Fixed positioning with `z-index`
- Body scroll locking/unlocking
- Click-outside-to-close behavior

```typescript
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = 'unset';
  };
}, []);

const wrapper = (
  <m.div
    onClick={onClose}
    className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/95"
  >
    {/* Modal content */}
  </m.div>
);
```

### Conditional Rendering
- Loading states before data display
- Empty state handling
- Lazy motion for animations

```typescript
{loading ? (
  <div className="h-64 flex items-center justify-center">Загрузка...</div>
) : (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {photos.map((photo, index) => (
      <m.div key={photo.id} ... >
        {/* Photo content */}
      </m.div>
    ))}
  </div>
)}
```

### Wrapper Components
- Layout wrapper for consistent structure
- Service client wrappers for external APIs

## Naming Conventions

### Files
- PascalCase for components: `PhotoModal.tsx`, `Navbar.tsx`
- camelCase for hooks: `useMobile.ts`, `useAdminData.ts`
- kebab-case for utility functions: `cn.ts` (className utility)
- SCREAMING_SNAKE_CASE for constants: `const navLinks = [...]`

### Components
- PascalCase: `PhotoPortfolio`, `Services`, `Hero`
- Props interfaces: `PhotoModalProps`, `HomeClientProps`
- Export pattern: default component + named type exports

### Functions and Variables
- camelCase: `fetchPhotos`, `setIsScrolled`, `handleScroll`
- Function names describing what they do
- Boolean names with `is/has` prefix: `isMobile`, `isScrolled`, `loading`

### Constants
- camelCase for reusable values
- SCREAMING_SNAKE_CASE for environment-like constants

```typescript
const navLinks = [
  { name: 'Работы', href: '/#work' },
  { name: 'Фото', href: '/#photos' },
];
```

## File Organization Patterns

### Directory Structure
```
app/
├── admin/           # Admin pages
├── api/             # API routes
├── photography/     # Photography pages
├── works/           # Works pages
├── page-client.tsx  # Client wrapper
├── page-wrapper.tsx # Layout wrapper
├── page.tsx         # Main page component
├── layout.tsx       # Root layout
└── layout-wrapper.tsx # Layout wrapper
```

### Component Organization
```
components/
├── admin/          # Admin-specific components
├── ui/             # Reusable UI components
└── *.tsx           # Page-level components
```

### Hook Organization
```
hooks/
└── *.ts           # Custom React hooks
```

### Library Organization
```
lib/
├── supabase.ts    # Supabase client setup
├── firebase.ts    # Firebase client setup
├── utils.ts       # Utility functions
└── upload.ts      # File upload helpers
```

### Path Aliases
- `@/*` mapped to root directory for imports
- Import style: `import { cn } from '@/lib/utils'`

## Import/Export Patterns

### Import Ordering
1. React imports (if any)
2. Third-party library imports
3. Next.js imports
4. Local imports starting with `@/`
5. Local imports without alias

```typescript
import { useState, useEffect } from 'react';
import { AnimatePresence, LazyMotion, m } from 'motion/react';
import Image from 'next/image';
import { supabase, toPhotoData } from '@/lib/supabase';
```

### Export Patterns
- Default export for components
- Named export for types and utilities
- Named export for utility functions

```typescript
export type PhotoData = { /* ... */ };
export function toPhotoData(data: any): PhotoData { /* ... */ }
export default function PhotoModal({ photo, onClose }: PhotoModalProps) { /* ... */ }
```

### Dependency Declaration
- Import only what's used
- Group related imports together
- Avoid wildcard imports when possible

---

*Convention analysis: 2026-06-28*