# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo created with Better-T-Stack, built with TypeScript and modern React technologies. It uses Turborepo for monorepo management and Bun as the package manager.

### Tech Stack
- **Frontend**: Next.js 15 with React 19
- **Styling**: TailwindCSS v4 with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Forms**: TanStack Form with Zod validation
- **Monorepo**: Turborepo
- **Package Manager**: Bun
- **Runtime**: Next.js with Turbopack in development

## Development Commands

```bash
# Install dependencies
bun install

# Start all applications in development mode
bun dev

# Start only the web application (runs on port 3001)
bun dev:web

# Build all applications
bun build

# Type checking across all apps
bun check-types

# Lint the web application
cd apps/web && bun lint
```

## Architecture

### Monorepo Structure
```
lovable-type-app-next/
├── apps/
│   └── web/         # Next.js frontend application
├── packages/        # Shared packages (currently empty)
├── turbo.json       # Turborepo configuration
└── package.json     # Root package.json with workspace config
```

### Web Application Structure
```
apps/web/
├── src/
│   ├── app/         # Next.js App Router pages
│   ├── components/  # React components
│   │   ├── ui/      # shadcn/ui components
│   │   └── ...      # Custom components
│   └── lib/         # Utility functions
├── public/          # Static assets
└── package.json     # Web app dependencies
```

## Key Patterns

### Component Architecture
- Uses shadcn/ui for base components with Radix UI primitives
- Custom components built on top of shadcn/ui base components
- Theme system with next-themes for dark/light mode
- Component composition using Radix UI's Slot primitive

### Styling
- TailwindCSS v4 with CSS variables for theming
- Class variance authority (cva) for component variants
- Utility function `cn()` for conditional class merging (clsx + tailwind-merge)
- Custom CSS animations with tw-animate-css

### State Management
- TanStack Query for server state management
- React Context for global UI state (theme, etc.)
- Form state managed by TanStack Form with Zod validation

### TypeScript Configuration
- Strict TypeScript configuration
- Path aliases configured (`@/*` maps to `./src/*`)
- Next.js TypeScript plugin enabled

## Development Notes

- The web application runs on port 3001 by default
- Uses Turbopack for faster development builds
- Geist fonts are used for typography
- Sonner is used for toast notifications
- Icons from Lucide React