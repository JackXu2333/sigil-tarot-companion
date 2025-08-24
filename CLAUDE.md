# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Phase 1: Pre-Work Planning and Review

Before beginning implementation, follow these planning steps:

1.  **Create a Detailed Plan:** Always start by formulating a clear and comprehensive plan.
2.  **Document the Plan:** The finalized plan must be written to a markdown file in the following directory: `.claude/tasks/TASK_NAME.md`.
3.  **Plan Requirements:** Your plan must include:
    * A detailed strategy for implementation.
    * The reasoning and justification for your chosen approach.
    * A complete breakdown of the work into smaller, manageable sub-tasks.
4.  **Conduct Research:** If the task requires external knowledge or specific software packages, use the designated "Task tool" to research and gather the latest information.
5.  **Focus on MVP:** Adopt a Minimum Viable Product (MVP) mindset to avoid over-planning and focus on core requirements.
6.  **Submit for Approval:** Once the plan is documented, submit it for review. **You must not begin implementation until the plan has been approved.**

---

## Phase 2: Active Implementation and Documentation

While you are working on the task, adhere to the following:

1.  **Maintain a Living Plan:** The plan should be treated as a dynamic document. Update it regularly to reflect your progress and any changes in strategy.
2.  **Document Completed Work:** As you complete each sub-task, update the plan with detailed descriptions of the changes you made. This is crucial for ensuring a smooth handover of future tasks to other engineers.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build` (runs TypeScript compilation then Vite build)
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React + TypeScript + Vite project for a Sigil Tarot Companion application using modern web technologies:

### Core Stack
- **React 19.1.1** with TypeScript for the UI framework
- **Vite 7.1.2** for build tooling and development server  
- **Tailwind CSS v4.1.12** for styling with the new @tailwindcss/vite plugin
- **shadcn/ui** components with "new-york" style variant
- **Supabase** for backend services and authentication
- **TanStack Query 5.85.5** for data fetching and caching
- **React Router DOM 7.8.2** for client-side routing

### Project Structure
```
src/
├── App.tsx                 - Main application component with routing
├── main.tsx               - Application entry point
├── index.css              - Global styles and Tailwind imports
├── components/
│   ├── ui/                - shadcn/ui components (17 components)
│   ├── AuthPage.tsx       - Authentication component
│   ├── Dashboard.tsx      - Main dashboard view
│   ├── ClientChart.tsx    - Client data visualization
│   ├── CopilotInsightsCard.tsx - AI insights component
│   ├── NewClientForm.tsx  - Client creation form
│   ├── ReadingWorkspace.tsx - Tarot reading interface
│   └── NotFound.tsx       - 404 error page
├── hooks/
│   ├── use-auth.tsx       - Authentication hook
│   ├── use-debounce.ts    - Debounce utility hook
│   └── use-mobile.tsx     - Mobile detection hook
├── services/
│   ├── clientService.ts   - Client data operations
│   ├── copilotService.ts  - AI/copilot functionality
│   └── readingService.ts  - Tarot reading operations
├── integrations/supabase/
│   ├── client.ts          - Supabase client configuration
│   └── types.ts           - Database type definitions
├── data/
│   ├── formOptions.ts     - Form configuration data
│   ├── mockData.ts        - Mock data for development
│   └── tarotDeck.ts       - Tarot card definitions
├── lib/
│   ├── utils.ts           - Utility functions (includes `cn` for class merging)
│   └── demoMode.ts        - Demo mode functionality
└── assets/                - Static assets
```

### Key Configurations
- **Path aliases**: `@/*` maps to `./src/*` (configured in both Vite and TypeScript)
- **Component system**: Uses shadcn/ui with Radix UI primitives, class-variance-authority, and Lucide React icons
- **Styling**: Tailwind CSS v4 with CSS variables enabled, neutral base color, oklch color space
- **TypeScript**: Split configuration with separate configs for app and node environments
- **Authentication**: Supabase Auth integration
- **Data fetching**: TanStack Query for server state management
- **Routing**: React Router v7 with BrowserRouter

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

## Additional Dependencies & Features

### UI & Styling
- **next-themes 0.4.6** - Theme switching functionality
- **sonner 2.0.7** - Toast notifications
- **recharts 3.1.2** - Chart and data visualization components
- **tw-animate-css 1.3.7** - Additional CSS animations for Tailwind

### Forms & Validation  
- **react-hook-form 7.62.0** - Form state management
- **@hookform/resolvers 5.2.1** - Form validation resolvers
- **zod 4.1.0** - Schema validation

### Date & Time
- **date-fns 4.1.0** - Date manipulation utilities

### Radix UI Components (v1+ latest)
- Avatar, Checkbox, Dialog, Label, Progress, Select, Slider, Slot, Switch, Tooltip

## Development Notes
- No test framework is currently configured
- ESLint 9.33.0 is set up for code linting with React-specific rules
- Uses React 19.1.1's modern patterns and TypeScript 5.8.3
- Vite 7.1.2 handles hot module replacement and build optimization
- Supabase integration for authentication and data persistence
- TanStack Query for efficient data fetching and caching
- Demo mode functionality available for development/testing