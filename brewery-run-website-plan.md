## Plan for MRC Helsinki brewery run website

## Background

Mikkeller Running Club Helsinki will run from brewery taproom (or bar) to another, drink beer or two at each, and then run to the next one.

This website aims to be the definitive source of information before the run as well as during the event.

## Features

### Schedule

- what's the location
- when are we arriving
- when do we depart
- what is the distance (kilometers) between each stop

### Map

- the planned route: a map embed from Strava (preferred), Open Street Map, or Google Maps; whatever is feasible and free

Stretch goal:

- adding live tracking on the map from Garmin or Strava data

## Design approach

Crucial: mobile first. Most, if not all traffic will originate from mobile devices on the day of the event.

We try to speak the Mikkeller brewery design language which – to a degree – has already been implemented on the Baltic Cruise website already in this repo.

## Implementation TODO List

### Phase 1: Core Structure & Data
- [x] Create brewery run page component at `/brewery-run` route
- [x] Define data structure for brewery stops (location, arrival/departure times, distances)
- [x] Create sample data for Helsinki brewery run
- [x] Design mobile-first brewery stop cards (similar to city cards but optimized for mobile)
- [x] Add brewery run route to navigation

### Phase 2: Schedule Features
- [x] Build schedule timeline component showing all stops
- [x] Display location details (name, address, maybe a photo)
- [x] Show arrival/departure times with clear formatting
- [x] Calculate and display distances between stops
- [x] Add "current stop" indicator for during-event usage
- [x] Implement time-based progress tracking with visual highlighting
- [x] Add brewery logos with multi-format support and CSS styling
- [x] Remove runner emojis for cleaner brand-appropriate design
- [x] Add mock time query parameter for testing (?mockTime=13:00)

### Phase 3: Map Integration
- [x] Research free map embed options (Strava, OSM, Google Maps, Komoot, Garmin)
- [x] Implement basic route map embed (Garmin Connect)
- [x] Test map responsiveness on mobile devices
- [x] Add tabbed interface for Schedule/Map switching
- [x] Implement full-height map layout
- [x] Add responsive breakpoints for tablet/desktop (2/3 width)
- [ ] Add brewery location markers on map (handled by Garmin embed)
- [ ] Consider offline map functionality for mobile

### Phase 4: Mobile Optimization
- [x] Test and optimize all components for mobile viewport
- [x] Implement touch-friendly interactions (tab buttons, cards)
- [x] Mobile-first responsive design with tablet/desktop enhancements
- [ ] Add PWA capabilities (service worker, manifest)
- [ ] Test performance on mobile networks
- [ ] Add "Add to Home Screen" functionality

### Phase 5: Live Features (Stretch Goals)
- [x] Research Strava/Garmin API integration possibilities
- [x] Implement live tracking display (Garmin LiveTrack via Cloudflare Worker + KV)
- [x] Add real-time updates capability (admin dashboard for updating LiveTrack URL)
- [x] Serverless architecture (no WebSocket needed - Cloudflare Worker handles it)

### Phase 6: Polish & Launch
- [x] Extract and adapt Mikkeller design elements from Baltic Cruise site
- [x] Implement consistent branding and typography (MikkelWind font, brand colors)
- [x] Add countdown timer to event
- [x] Implement custom slow pulse animations for highlighting
- [x] Clean component architecture (extracted tab components)
- [x] Add custom hooks for reusable functionality (useLiveTrackUrl, useDocumentTitle)
- [x] Update Open Graph metadata for brewery run
- [x] Document mockTime testing parameter in README
- [x] Add Playwright browser caching to CI/CD
- [x] Responsive layout for multiple screen sizes
- [x] Add loading states and error handling (toast notifications, loading states in map)
- [x] Create admin dashboard for LiveTrack URL management
- [x] Extract constants to centralized module
- [x] Add comprehensive architecture documentation (Mermaid diagram in README)
- [ ] Performance optimization and testing
- [ ] Final mobile device testing across different screen sizes
