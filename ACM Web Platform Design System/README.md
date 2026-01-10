# ACM Web Platform Design System

A modern agricultural management platform built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript 5.6.0
- **State Management**: Redux Toolkit 2.2.0
- **Data Fetching**: TanStack Query 5.59.0
- **Routing**: React Router 6.26.0
- **UI Library**: Radix UI + Custom Design System
- **Styling**: CSS

## Project Structure

This project follows an **incremental Feature-Sliced Design (FSD)** architecture:

```
src/
├── generated/          # Auto-generated code (Figma, etc.)
├── shared/            # Shared utilities and infrastructure
│   └── api/          # HTTP client and API configuration
├── entities/          # Domain entities (User, Task, Season, etc.)
│   ├── user/api/
│   ├── task/api/
│   ├── season/api/
│   ├── document/api/
│   └── crop/api/
├── features/          # Business features
├── components/        # UI components
├── pages/            # Route pages
├── app/              # Application setup
└── services/         # Legacy API services (being migrated)
```

### Path Aliases

```typescript
@shared/*     → ./src/shared/*
@entities/*   → ./src/entities/*
@generated/*  → ./src/generated/*
@/*           → ./src/*
```

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the app at `http://localhost:3000`

### Build

```bash
npm run build
```

Builds the app for production to the `build/` directory.

### Testing

```bash
npm test          # Run tests
npm run test:ui   # Run tests with UI
```

## Architecture Notes

This project is currently undergoing an **incremental migration** to Feature-Sliced Design:

- ✅ **Phase 1 Complete**: Generated code isolated to `src/generated/`
- ✅ **Phase 2 Complete**: Services layer refactored with entity-based APIs
- ✅ **Phase 3 Complete**: Pages refactored to composition-only
- 🚧 **Future**: Full FSD adoption with widgets and app layers

For complete migration roadmap, see [FSD_NEXT_STEPS.md](./FSD_NEXT_STEPS.md).

For detailed walkthrough of completed work, see [walkthrough documentation](./docs/walkthrough.md).

## Contributing

When adding new code:
- Use path aliases (`@shared`, `@entities`, etc.)
- Place API endpoints in the appropriate entity module
- Keep generated code in `src/generated/`

## License

Private - All rights reserved
