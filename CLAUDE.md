# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build` (runs TypeScript compilation then Vite build)
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React + TypeScript + Vite project for a tarot companion application using modern web technologies:

### Core Stack
- **React 19** with TypeScript for the UI framework
- **Vite** for build tooling and development server
- **Tailwind CSS v4** for styling with the new @tailwindcss/vite plugin
- **shadcn/ui** components with "new-york" style variant

### Project Structure
- `src/App.tsx` - Main application component
- `src/components/ui/` - Reusable UI components from shadcn/ui
- `src/components/` - Custom application components
- `src/lib/utils.ts` - Utility functions (includes `cn` for class merging)
- `src/index.css` - Global styles and Tailwind imports

### Key Configurations
- **Path aliases**: `@/*` maps to `./src/*` (configured in both Vite and TypeScript)
- **Component system**: Uses shadcn/ui with Radix UI primitives, class-variance-authority, and Lucide React icons
- **Styling**: Tailwind CSS with CSS variables enabled, neutral base color
- **TypeScript**: Split configuration with separate configs for app and node environments

## shadcn/ui Development Guidelines

### Core Principles
- Always use TypeScript + forwardRef
- Accessibility is non-negotiable
- Mobile-first responsive design

### Component Structure Pattern
```typescript
const Component = React.forwardRef<ElementRef, Props>(
  ({ className, ...props }, ref) => (
    <Element
      className={cn(componentVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
)
```

### Variant System (Must use CVA)
```typescript
import { cva } from "class-variance-authority"

const componentVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." }
  },
  defaultVariants: { variant: "default", size: "default" }
})
```

### Styling Rules (Strictly Follow)

#### Color System
- ✅ `bg-primary text-primary-foreground border-border`
- ❌ `bg-blue-500 text-white border-gray-300`

#### Layout Patterns
- Grid: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`
- Spacing: `space-y-4 p-4`
- Class merging: `cn("base", variants(), className)`

#### Responsive Design
- Mobile-first: `text-sm md:text-base lg:text-lg`

### Common Component Patterns

#### Forms
- Must use `react-hook-form + zod`
- Structure: `FormField > FormItem > FormLabel > FormControl > FormMessage`

#### Dialogs
- Structure: `Dialog > DialogTrigger > DialogContent > DialogHeader > DialogFooter`
- Use `asChild` for triggers

#### Data Display
- Card grid: `grid gap-4 md:grid-cols-2`
- Map over data to render component lists

### State Management
- Simple state: `useState`
- Form state: `useForm`
- Complex state: `Context + useContext`

### Accessibility Requirements
- Use semantic HTML elements
- Provide necessary `aria-*` attributes
- Support keyboard navigation

### Absolutely Forbidden ❌
- Hardcoded color values
- Ignoring TypeScript types
- Omitting forwardRef
- Not using design tokens
- Directly modifying shadcn component source code

### Compound Component Exports
```typescript
export { Card, CardHeader, CardTitle, CardContent, CardFooter }
```

## Development Notes
- No test framework is currently configured
- ESLint is set up for code linting
- Uses React 19's modern patterns and TypeScript ~5.8.3
- Vite handles hot module replacement and build optimization