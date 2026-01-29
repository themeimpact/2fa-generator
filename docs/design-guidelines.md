# Design Guidelines

## Overview
This document outlines design system, tokens, patterns, and guidelines for VideoImpact application.

## Design Principles
- **Mobile-First**: Start with mobile designs, scale up
- **Accessibility**: WCAG 2.1 AA minimum (4.5:1 contrast for normal text, 3:1 for large text)
- **Consistency**: Maintain design system coherence
- **Performance**: Optimize animations and interactions
- **Clarity**: Prioritize clear communication
- **Delight**: Add thoughtful micro-interactions

## Color System

### Primary Colors
- Primary: `hsl(var(--primary))` - Main brand color
- Primary Foreground: `hsl(var(--primary-foreground))`

### Semantic Colors
- Success: `#22c55e` (green-600)
- Warning: `#f59e0b` (amber-500)
- Error: `#ef4444` (red-500)
- Info: `#3b82f6` (blue-500)

### Neutral Colors (Light Mode)
- Gray 50: `#f9fafb`
- Gray 100: `#f3f4f6`
- Gray 200: `#e5e7eb`
- Gray 300: `#d1d5db`
- Gray 400: `#9ca3af`
- Gray 500: `#6b7280`
- Gray 600: `#4b5563`
- Gray 700: `#374151`
- Gray 800: `#1f2937`
- Gray 900: `#111827`

## Typography

### Font Families
Primary: System font stack with Vietnamese support
- `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

### Type Scale
- Display: 3.5rem (56px) / Bold
- H1: 2.5rem (40px) / Bold
- H2: 2rem (32px) / Bold
- H3: 1.5rem (24px) / Semibold
- H4: 1.25rem (20px) / Semibold
- Body Large: 1.125rem (18px) / Regular
- Body: 1rem (16px) / Regular
- Body Small: 0.875rem (14px) / Regular
- Caption: 0.75rem (12px) / Regular

### Line Heights
- Body Text: 1.5-1.6
- Headings: 1.2-1.3

## Spacing Scale
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 5: 1.25rem (20px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 10: 2.5rem (40px)
- 12: 3rem (48px)

## Component Patterns

### Card Component
**Variants:**
- `default`: Standard card with background
- `elevated`: Card with shadow
- `outlined`: Card with border
- `gradient`: Card with gradient background (new)

**Visual Properties:**
- Border Radius: 0.75rem (12px)
- Padding: 1rem-1.5rem (16-24px)
- Shadow (elevated): `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- Transition: `all 0.2s ease-in-out`

**Hover States:**
- Transform: `translateY(-2px)`
- Shadow: Enhanced shadow on hover
- Border: Subtle color shift

**Card Sections:**
- Header: 1rem padding, border-bottom
- Body: 1rem padding
- Footer: 1rem padding, border-top

### Tab Navigation
**Design Pattern: Pill/Segment Control**
- Background: Muted background (gray-100/gray-800)
- Active State: White/Dark background with shadow
- Border Radius: 0.5rem (8px)
- Padding: 0.5rem-1rem (8-16px)
- Transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`

**With Icons:**
- Icon Size: 20px
- Icon + Label layout with gap: 0.5rem (8px)
- Vertical alignment: center

**Visual Indicators:**
- Underline (alternative): 2px solid primary color
- Background shift for active state
- Smooth transition animation

### Button Component
**Sizes:**
- Small: py-1.5 px-3, text-sm
- Medium: py-2 px-4, text-base
- Large: py-3 px-6, text-lg

**Variants:**
- Primary: Brand color, white text
- Secondary: Gray background
- Outline: Transparent with border
- Ghost: Transparent, subtle hover

**States:**
- Hover: Brightness/opacity change
- Active: Slightly pressed effect
- Disabled: 50% opacity, no pointer events
- Loading: Spinner icon, disabled interaction

### Badge Component
**Variants:**
- Success: Green background
- Warning: Amber background
- Error: Red background
- Info: Blue background
- Default: Gray background

**Sizes:**
- Small: text-xs, px-2 py-0.5
- Medium: text-sm, px-2.5 py-1
- Large: text-base, px-3 py-1.5

## Micro-interactions

### Hover Effects
- Scale transform: `scale(1.02)`
- Shadow enhancement
- Color transitions: 200ms ease
- Border color shifts

### Focus States
- Ring: 2px offset, primary color
- Outline: visible for keyboard navigation
- High contrast for accessibility

### Loading States
- Skeleton screens with pulse animation
- Spinner for button loading
- Progressive content loading

## Responsive Breakpoints
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Wide: 1280px+

## Accessibility Standards

### Touch Targets
- Minimum: 44x44px for mobile
- Spacing: 8px between targets

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Motion
- Respect `prefers-reduced-motion`
- Provide animation toggle options
- Keep animations under 300ms

### Focus Management
- Visible focus indicators
- Logical tab order
- Skip links for navigation

## Credits Page Design Patterns

### Stats Cards (Overview)
**Layout:** 3-column grid (1 column on mobile)
**Visual Style:**
- Gradient backgrounds (subtle)
- Large number display (4xl font)
- Icon with background glow effect
- Hover: lift effect with enhanced shadow

**Color Mapping:**
- Total Credits: Primary gradient
- Subscription: Blue/Info gradient
- Top-up: Green/Success gradient

### Package Cards (Top-up)
**Layout:** 3-column grid
**Visual Style:**
- Border highlight for popular package
- Badge for "Most Popular"
- Price prominence (4xl bold)
- Feature list with checkmarks
- Full-card clickable area
- Hover: border color + shadow change

### Pricing Cards (Subscriptions)
**Layout:** 3-column grid
**Visual Style:**
- Recommended badge positioning
- Current plan indicator
- Feature comparison list
- Clear CTA button
- Pricing display with period
- Visual hierarchy: name → price → features → CTA

## Animation Tokens
- Duration Fast: 150ms
- Duration Normal: 200ms
- Duration Slow: 300ms
- Easing Default: cubic-bezier(0.4, 0, 0.2, 1)
- Easing In: cubic-bezier(0.4, 0, 1, 1)
- Easing Out: cubic-bezier(0, 0, 0.2, 1)

## Credits Page Tab Icons
- Overview: `dashboard` or `grid_view`
- Top-up: `add_circle` or `account_balance_wallet`
- Subscriptions: `star` or `workspace_premium`
- History: `history` or `receipt_long`
