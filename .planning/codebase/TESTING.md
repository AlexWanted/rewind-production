# Testing Patterns

**Analysis Date:** 2026-06-28

## Testing Framework and Setup

### Available Tools
- **Vitest** installed as a dependency (`@vitejs/test` from firebase-tools)
- **Playwright** available as a skill (configured in agent system)
- **TypeScript** with strict mode enables type-safe testing

### Current Configuration
- No project-level Vitest or Jest configuration found
- No `vitest.config.ts` or `jest.config.*` in root
- No testing scripts in `package.json`
- No ESLint rules for tests configured
- Test environment setup not configured

### Available Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "clean": "next clean"
}
```

**Observation:** Testing infrastructure is available but not integrated into the project workflow.

## Testing Patterns

### Current State
- **NO project-level test files found** in:
  - `app/` directory
  - `components/` directory
  - `lib/` directory
  - `hooks/` directory

- Test files found are in `node_modules/` from dependencies (Firebase SDK tests, zod tests, etc.)

### Expected Patterns (based on project structure)

#### Unit Tests (if implemented)
```typescript
// Sample pattern for testing utility functions
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('px-4 py-1');
  });

  it('handles conditional classes', () => {
    expect(cn('px-2', true && 'py-1')).toBe('px-2 py-1');
  });
});
```

#### Component Tests (if implemented)
```typescript
// Sample pattern for testing components
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('PhotoPortfolio', () => {
  it('displays loading state initially', () => {
    render(<PhotoPortfolio />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('renders photos after loading', async () => {
    render(<PhotoPortfolio />);
    // await waitFor(() => {
    //   expect(screen.getByTestId('photo-item')).toBeInTheDocument();
    // });
  });
});
```

#### Hook Tests (if implemented)
```typescript
// Sample pattern for testing hooks
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  it('returns true for mobile viewport', () => {
    // Mock window.innerWidth
    global.innerWidth = 600;
    renderHook(() => useIsMobile());
    // Assert result
  });
});
```

#### Data Utility Tests (if implemented)
```typescript
// Sample pattern for testing data transformations
import { describe, it, expect } from 'vitest';
import { toPhotoData, toVideoData } from '@/lib/supabase';

describe('Data transformations', () => {
  it('converts Supabase photo data correctly', () => {
    const supabasePhoto = {
      id: '1',
      images: ['img1.jpg', 'img2.jpg'],
      alt: 'Test Photo',
      created_at: '2026-01-01T00:00:00Z',
      // ... more fields
    };

    const result = toPhotoData(supabasePhoto);
    expect(result.id).toBe('1');
    expect(result.images).toEqual(['img1.jpg', 'img2.jpg']);
  });
});
```

## Mock/Stub Strategies

### Missing Implementation
- No mocking demonstrated in existing code
- No test helpers or factories
- Supabase calls not mocked (would require environment mocking)

### Recommended Mocking Patterns

#### Supabase Mocking
```typescript
import { describe, it, expect, vi } from 'vitest';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ ascending: vi.fn(() => ({ data: {}, error: null })) })),
      })),
    })),
  })),
}));

import { supabase } from '@/lib/supabase';
```

#### Service Client Mocking
```typescript
// Mock Firebase auth
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({
    auth: vi.fn(() => ({
      signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: {} })),
    })),
  })),
}));
```

#### Network Mocking
```typescript
// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ files: [] }),
  })
) as any;
```

### What to Mock
- **Supabase client**: External database client
- **Firebase SDK**: Authentication and database client
- **HTTP requests**: API calls in admin operations
- **Browser APIs**: `window.matchMedia`, `window.addEventListener`

### What NOT to Mock
- React components (test rendering, not implementations)
- HTML elements (test behavior, not implementation)
- Utility functions that are pure (test logic directly)

## Test Coverage Approach

### Current Coverage
- **ZERO coverage** - No test files in project
- No coverage thresholds configured
- No coverage reporting setup

### Recommended Coverage Strategy
- Target 80%+ for critical paths
- Critical areas for coverage:
  - Data fetching and error handling
  - Authentication flows
  - Form validation
  - Admin operations
  - API route handlers

### Coverage Commands (if implemented)
```bash
# Run tests with coverage
pnpm test:coverage

# View coverage in browser
pnpm test:coverage --reporter=html

# Generate coverage reports
pnpm test:coverage --coverage
```

## E2E Testing Setup

### Available Tools
- **Playwright** configured in agent skills
- No Playwright configuration in project
- No Playwright tests implemented

### Recommended E2E Test Structure
```typescript
// playwright.config.ts (if implemented)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Sample E2E Tests (if implemented)
```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('displays navigation and hero section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Rewind');
    await expect(page.getByRole('link', { name: 'Фото' })).toBeVisible();
  });

  test('navigates to photo gallery', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/#photos"]');
    await expect(page.locator('#photos')).toBeVisible();
  });

  test('displays loading state', async ({ page }) => {
    // Mock slow response
    await page.goto('/');
    await expect(page.getByText('Загрузка...')).toBeVisible();
    await page.waitForSelector('.photo-grid');
  });
});
```

### Admin E2E Tests
```typescript
// e2e/admin.spec.ts
test.describe('Admin Dashboard', () => {
  test('requires authentication', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/login/);
  });

  test('loads admin data', async ({ page }) => {
    // Navigate after login...
    await expect(page.getByTestId('videos-table')).toBeVisible();
    await expect(page.getByTestId('photos-table')).toBeVisible();
  });
});
```

## Integration Testing Patterns

### API Route Tests
```typescript
// app/api/files/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../route';

describe('GET /api/files', () => {
  beforeEach(() => {
    // Setup mock environment
  });

  it('returns file list', async () => {
    const response = await POST({
      json: () => Promise.resolve({ files: ['file1.jpg', 'file2.jpg'] }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      files: ['file1.jpg', 'file2.jpg'],
    });
  });
});
```

### Service Integration Tests
```typescript
// lib/supabase.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { supabase } from './supabase';

describe('Supabase integration', () => {
  it('handles successful query', async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .limit(10);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('handles query error', async () => {
    const { data, error } = await supabase
      .from('nonexistent-table')
      .select('*');

    expect(data).toBeNull();
    expect(error).toBeDefined();
  });
});
```

### Component Integration Tests
```typescript
// components/PhotoModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { PhotoModal } from './PhotoModal';

describe('PhotoModal integration', () => {
  it('closes when clicking overlay', async () => {
    const handleClose = vi.fn();

    render(<PhotoModal photo={mockPhoto} onClose={handleClose} />);

    await fireEvent.click(screen.getByText(''));
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('prevents overlay click when clicking content', async () => {
    // Test event propagation
  });
});
```

## Test Configuration

### Recommended Vitest Setup
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    cover: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'e2e/', '*.config.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### Test Setup File
```typescript
// vitest.setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Global matchers
expect.extend({
  toBeValidUrl(received: string) {
    const isValid = /^https?:\/\/.+\..+$/.test(received);
    return {
      pass: isValid,
      message: () => `${received} is not a valid URL`,
    };
  },
});
```

### ESLint Config for Tests
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "plugin:testing-library/react", "plugin:jest-dom/recommended"],
  "rules": {
    "testing-library/no-unnecessary-act": "warn",
    "testing-library/render-result-naming-convention": "off"
  }
}
```

## Testing Best Practices (Recommended)

### Test Organization
```
tests/
├── unit/           # Unit tests for utilities and utilities
│   ├── lib/
│   ├── hooks/
│   └── utils/
├── component/      # Component tests
│   ├── admin/
│   ├── photography/
│   └── ui/
├── integration/    # Integration tests
│   ├── api/
│   └── services/
└── e2e/            # End-to-end tests
    ├── home.spec.ts
    └── admin.spec.ts
```

### Test Naming
- Use descriptive names: `describe` and `it` blocks
- Follow pattern: "should [behavior] when [condition]"
- Be specific: `useAdminData fetches videos and photos`

### Test Isolation
- Each test should be independent
- Mock external dependencies
- Cleanup after each test

### Asynchronous Testing
```typescript
// Wait for async operations
await waitFor(() => {
  expect(screen.getByTestId('loaded')).toBeInTheDocument();
});

// Timeout configuration
await waitFor(
  () => expect(screen.getByText('Loaded!')).toBeInTheDocument(),
  { timeout: 5000 }
);
```

### Error Testing
```typescript
test('handles API error gracefully', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: false, status: 500, statusText: 'Server Error' })
  );

  // Assert error handling behavior
});
```

---

*Testing analysis: 2026-06-28*