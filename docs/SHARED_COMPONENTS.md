# Shared Components

## Overview

All reusable UI components are organized in `src/components/shared/` for better maintainability and discoverability.

## Directory Structure

```
src/components/shared/
├── CTAButton/          # Call-to-action button variants
├── ErrorBoundary/      # React error boundary wrapper
├── ErrorState/         # Error display component
├── EmptyState/         # Empty data state component
├── InfoBadge/          # Badge component with variants
├── LoadingState/       # Loading spinner component
├── PageContainer/      # Consistent page layout wrapper
├── StatItem/           # Statistics display item
├── StatsCard/          # Statistics card container
└── index.ts            # Barrel export
```

## Components

### LoadingState
Reusable loading spinner with optional message.

```tsx
import { LoadingState } from '@/src/components/shared';

<LoadingState message="Loading..." fullPage />
```

**Props:**
- `message?: string` - Loading message
- `fullPage?: boolean` - Use full viewport height (default: false)
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Spinner size (default: 'xl')

### ErrorState
Consistent error display with action button.

```tsx
import { ErrorState } from '@/src/components/shared';

<ErrorState 
  message="Something went wrong"
  actionLabel="Go Back"
  actionRoute="/dashboard"
  fullPage
/>
```

**Props:**
- `message: string` - Error message
- `actionLabel?: string` - Button label (default: 'Go Back')
- `onAction?: () => void` - Custom action handler
- `actionRoute?: string` - Route to navigate to
- `fullPage?: boolean` - Use full viewport height (default: false)

### EmptyState
Empty data state with optional action.

```tsx
import { EmptyState } from '@/src/components/shared';

<EmptyState
  title="No data found"
  message="Start by creating your first item"
  actionLabel="Create Item"
  actionRoute="/create"
/>
```

**Props:**
- `title: string` - Title text
- `message?: string` - Description text
- `actionLabel?: string` - Button label
- `onAction?: () => void` - Custom action handler
- `actionRoute?: string` - Route to navigate to
- `fullPage?: boolean` - Use full viewport height (default: false)
- `icon?: ReactNode` - Optional icon component

### PageContainer
Consistent page layout wrapper.

```tsx
import { PageContainer } from '@/src/components/shared';

<PageContainer maxW="container.xl" fullHeight>
  {children}
</PageContainer>
```

**Props:**
- `children: ReactNode`
- `maxW?: string` - Container max width (default: 'container.xl')
- `py?: number | object` - Vertical padding (default: responsive)
- `px?: number | object` - Horizontal padding (default: responsive)
- `fullHeight?: boolean` - Use full viewport height (default: false)

### CTAButton
Call-to-action button with variants.

```tsx
import { CTAButton } from '@/src/components/shared';

<CTAButton variant="primary" onClick={handleClick}>
  Get Started
</CTAButton>
```

**Props:**
- `children: ReactNode`
- `variant?: 'primary' | 'secondary'` - Button style (default: 'primary')
- `onClick?: () => void` - Click handler

### InfoBadge
Badge component with variants.

```tsx
import { InfoBadge } from '@/src/components/shared';

<InfoBadge variant="live">Live & Automated</InfoBadge>
```

**Props:**
- `children: ReactNode`
- `variant?: 'primary' | 'live'` - Badge style (default: 'primary')

### StatItem
Statistics display item.

```tsx
import { StatItem } from '@/src/components/shared';

<StatItem
  icon="📈"
  label="Traffic Growth"
  value="+247%"
  iconBg="orange.100"
  valueColor="brand.orange"
/>
```

**Props:**
- `icon: string` - Emoji or icon
- `label: string` - Stat label
- `value: string` - Stat value
- `iconBg: string` - Icon background color
- `valueColor: string` - Value text color

### StatsCard
Statistics card container (uses StatItem internally).

```tsx
import { StatsCard } from '@/src/components/shared';

<StatsCard />
```

### ErrorBoundary
React error boundary for catching component errors.

```tsx
import { ErrorBoundary } from '@/src/components/shared';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Migration Guide

### Before
```tsx
// Multiple implementations of loading state
<Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
  <Spinner size="xl" color="brand.orange" />
</Box>
```

### After
```tsx
import { LoadingState } from '@/src/components/shared';

<LoadingState message="Loading..." />
```

### Before
```tsx
// Inline error display
<Alert status="error" borderRadius="md">
  <AlertIcon />
  {error}
</Alert>
<Button onClick={handleBack}>Go Back</Button>
```

### After
```tsx
import { ErrorState } from '@/src/components/shared';

<ErrorState message={error} actionRoute="/dashboard" />
```

## Benefits

1. **Consistency**: All pages use the same loading/error/empty patterns
2. **Maintainability**: Update styles/behavior in one place
3. **Discoverability**: Easy to find reusable components
4. **Type Safety**: Shared components have consistent TypeScript types
5. **DRY Principle**: No code duplication across pages

## Usage Best Practices

1. **Import from barrel export**: `import { LoadingState } from '@/src/components/shared'`
2. **Use shared components**: Don't recreate loading/error/empty states
3. **Customize via props**: Extend components via props rather than duplicating
4. **Consistent styling**: All shared components follow brand guidelines

## Adding New Shared Components

1. Create component in `src/components/shared/[ComponentName]/index.tsx`
2. Export from `src/components/shared/index.ts`
3. Follow existing patterns for props and styling
4. Add to this documentation

