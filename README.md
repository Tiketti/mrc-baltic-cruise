# MRC Baltic Cruise 2025 mobile program

[![Netlify Status](https://api.netlify.com/api/v1/badges/a7fc3283-42c3-45ca-a04a-9a585ad71f32/deploy-status)](https://app.netlify.com/sites/mrcbalticcruise/deploys)
[![E2E Tests](https://github.com/Tiketti/mrc-baltic-cruise/actions/workflows/playwright.yml/badge.svg)](https://github.com/Tiketti/mrc-baltic-cruise/actions/workflows/playwright.yml)

This project contains multiple MRC event sites:

- **Root (/)**: Landing page with links to all events
- **Baltic Cruise (/baltic-cruise)**: Archived 2025 Baltic Cruise site  
- **Brewery Run (/brewery-run)**: Helsinki brewery-to-brewery running event

## Brewery Run Features

The brewery run site includes:
- **Real-time timeline**: Shows current brewery location and running status
- **Smart highlighting**: Visual indicators based on current time
- **Mobile-first design**: Optimized for use during the event
- **Brand-consistent styling**: Uses Mikkeller design language

### Testing Time-Based Highlighting

Use the `mockTime` query parameter to test the time-based highlighting:

```
/brewery-run?mockTime=12:30  # At Masis Brewery
/brewery-run?mockTime=13:00  # Running to Solmu  
/brewery-run?mockTime=13:45  # At Solmu Brewery
/brewery-run?mockTime=14:15  # Running to Salamanation
```

Format: `HH:MM` (24-hour format, no seconds needed)

## Temporarily Hidden Features

For the focused brewery run launch, the following features are commented out but easily restorable:

- **Navigation component** (in `App.tsx`)
- **Map tab functionality** (in `BreweryRun.tsx`)
- **Tab switching UI** (in `BreweryRun.tsx`)

To restore: uncomment the relevant sections and add back the `useState` import.

![Cruise Map](./public/assets/mrc_cruise_map.svg)
