# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
bun dev  # Start development server with Next.js Turbopack
```

### Build & Deployment
```bash
bun run build   # Build production version
bun run start   # Start production server
```

### Code Quality & Linting
```bash
bun run lint    # Run Next.js ESLint
biome check     # Run Biome linting and formatting
biome format    # Format code with Biome
```

### Data Management Pipeline
```bash
# Full data update process (run in order):
scripts/run_all_scripts.sh               # Scrape and convert card data
bun dev                                   # Start dev server for manual DB operations
bun src/migrate-images-to-supabase.ts    # Migrate images to Supabase storage
bun scripts/export_card_data.ts          # Export processed data as JSON
```

### Individual Data Processing Steps
```bash
# Python virtual environment for scraping
source ./venv/bin/activate

# Individual steps
python3 scripts/get_data.py              # Scrape card data
python3 scripts/convert_card_data.py     # Convert scraped data format
python3 scripts/get_data_ja.py           # Get Japanese localization data
```

### Database Operations
```bash
bun prisma generate   # Generate Prisma client
bun prisma db push    # Push schema changes to database
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15.3.1 with React 19, App Router
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **State Management**: URL state with nuqs, React Hook Form with Zod validation
- **Package Manager**: Bun
- **Code Quality**: Biome (linting & formatting)

### Project Structure

#### App Router Organization
- `src/app/(general)/` - Public pages (home, search)
- `src/app/(authenticated)/` - Auth-required pages (decks, players, settings)
- `src/app/(api)/` - API routes (auth callbacks)
- `src/app/(develop-only)/` - Development tools (card editing, data management)

#### Key Directories
- `src/components/ui/` - shadcn/ui components (Button, Dialog, etc.)
- `src/components/layout/` - Layout components (Header, Footer)
- `src/components/search-form/` - Modular search form components
- `src/constants/data/` - Card data management (scraped → converted → all_cards.json)
- `src/libs/supabase/` - Supabase client configuration
- `src/libs/prisma/` - Prisma client setup
- `scripts/` - Python data scraping and processing scripts

#### Data Flow Architecture
1. **Data Scraping**: Python scripts scrape card data from external sites → `src/constants/data/scraped/`
2. **Data Conversion**: Convert scraped data to app format → `src/constants/data/converted/`
3. **Data Aggregation**: All converted data imported via `src/constants/data/converted/index.ts`
4. **Database Storage**: Manual process via development interface
5. **Image Management**: Supabase storage for card images
6. **Export**: Final processed data exported as JSON

### Database Schema (Prisma)
- **Card**: Main card entity with Pokemon stats, moves, abilities
- **Player**: User profiles with friend codes
- Enums: PokemonType, CardType, CardRarity, PokemonEvolveStage

### Authentication & State
- Supabase authentication with server-side client creation
- URL-based state management with nuqs for search filters
- React Hook Form + Zod validation for forms

### Code Standards
- **Formatting**: Biome with single quotes, 2-space indentation
- **Imports**: Auto-organized imports enabled
- **Console**: Only `console.error` and `console.info` allowed
- **TypeScript**: Strict mode enabled

### Adding New Card Series
When new Pokemon TCG sets are released, follow the manual update process:
1. Edit `src/constants/series.json` and `src/constants/types/acquisition.ts`
2. Add new HTML source file to `scripts/target/ja-{SERIES}.html`
3. Run full data processing pipeline
4. Update `src/constants/data/converted/index.ts` to include new series
5. Update Pokemon names in `src/constants/data/pokemon_names.json` if needed

### Development Notes
- Use `bun` instead of `npm/yarn` for package management
- Prisma client generates to `src/generated/prisma/` (custom output path)
- Images handled via Supabase storage with Next.js remote patterns
- Japanese localization supported through separate data files
- Development tools available under `(develop-only)` route group
