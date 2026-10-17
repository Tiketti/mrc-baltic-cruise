export interface BreweryStop {
  id: string;
  name: string;
  logo: string; // Path to brewery logo
  logoClasses?: string; // CSS classes for logo styling
  logoBoxClasses?: string; // Replaces the default square white logo box, e.g. for wide logos
  meetTime?: string; // First stop only
  arriveTime?: string; // All stops except first
  arriveLabel?: string; // Overrides the "Arrive" label, last stop only
  departTime?: string; // All stops except last
  distanceToNext?: number; // Distance in km to next stop
  address?: string;
  website?: string;
}

// Event date: October 17, 2026 at 12:30 (first brewery meet time)
export const eventDate = new Date(2026, 9, 17, 12, 30, 0); // Month is 0-indexed (9 = October)

// TODO: Add distanceToNext for each leg once distances are known
export const breweryStops: BreweryStop[] = [
  {
    id: "gallows-bird",
    name: "Gallows Bird",
    logo: "/assets/brewery-logos/gallowsbird.png",
    logoBoxClasses: "w-48 bg-white px-3",
    meetTime: "12:30",
    departTime: "13:00",
    distanceToNext: 4.2,
  },
  {
    id: "masis",
    name: "Masis Brewing",
    logo: "/assets/brewery-logos/masis.png",
    arriveTime: "13:25",
    departTime: "14:05",
    distanceToNext: 5.3,
  },
  {
    id: "ukko-munkki",
    name: "Ukko Munkki",
    logo: "/assets/brewery-logos/ukkomunkki.png",
    logoClasses: "p-2",
    arriveTime: "14:40",
    departTime: "15:20",
    distanceToNext: 3.5,
  },
  {
    id: "viisi-pennia",
    name: "Viisi Penniä",
    logo: "/assets/brewery-logos/viisipennia.png",
    logoBoxClasses: "w-44 bg-white px-2",
    arriveTime: "15:40",
    departTime: "16:20",
    distanceToNext: 3.5,
  },
  {
    id: "salamanation",
    name: "SalamaNation",
    logo: "/assets/brewery-logos/salamanation.svg",
    arriveTime: "16:40",
    departTime: "17:20",
    distanceToNext: 3,
  },
  {
    id: "olarin-panimo",
    name: "Olarin Panimo",
    logo: "/assets/brewery-logos/olarinpanimo.png",
    logoClasses: "mix-blend-multiply", // Blends away white background
    arriveTime: "17:40",
    departTime: "18:20",
    distanceToNext: 2.5,
  },
  {
    id: "oluthuone-haka",
    name: "Oluthuone Haka",
    logo: "/assets/brewery-logos/haka.png",
    logoBoxClasses: "w-48 bg-white px-3",
    arriveTime: "18:30",
    arriveLabel: "Finishers' party",
    // No departure time - final stop
  },
];

// Shown instead of totalDistance until the organizers confirm every leg
export const fallbackTotalDistance = "approx. 20 km";

const legStops = breweryStops.slice(0, -1);

// A sum over partial data would understate the route, so any missing leg makes it unknown
export const totalDistance: number | null = legStops.every(
  (stop) => stop.distanceToNext !== undefined,
)
  ? // Rounded because summing decimals produces float noise like 21.599999
    Math.round(
      legStops.reduce((total, stop) => total + (stop.distanceToNext ?? 0), 0) *
        10,
    ) / 10
  : null;
