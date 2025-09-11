export interface BreweryStop {
  id: string;
  name: string;
  logo: string; // Path to brewery logo
  logoClasses?: string; // CSS classes for logo styling
  meetTime?: string; // First stop only
  arriveTime?: string; // All stops except first
  departTime?: string; // All stops except last
  distanceToNext?: number; // Distance in km to next stop
  address?: string;
  website?: string;
}

export const breweryStops: BreweryStop[] = [
  {
    id: "masis",
    name: "Masis Brewery",
    logo: "/assets/brewery-logos/masis.png",
    meetTime: "12:00",
    departTime: "12:45",
    distanceToNext: 7.0,
    address: "Helsinki, Finland",
  },
  {
    id: "solmu",
    name: "Solmu Brewery",
    logo: "/assets/brewery-logos/solmu.webp",
    logoClasses: "brightness-0 saturate-100", // Makes logo black on transparent
    arriveTime: "13:30",
    departTime: "14:00",
    distanceToNext: 4.3,
    address: "Helsinki, Finland",
  },
  {
    id: "salamanation",
    name: "Salamanation",
    logo: "/assets/brewery-logos/salamanation.svg",
    arriveTime: "14:30",
    departTime: "15:15",
    distanceToNext: 3.9,
    address: "Helsinki, Finland",
  },
  {
    id: "olarin-panimo",
    name: "Olarin Panimo",
    logo: "/assets/brewery-logos/olarinpanimo.png",
    logoClasses: "mix-blend-multiply", // Blends away white background
    arriveTime: "15:45",
    departTime: "16:15",
    distanceToNext: 2.6,
    address: "Helsinki, Finland",
  },
  {
    id: "tired-uncle",
    name: "Tired Uncle Brewing Co.",
    logo: "/assets/brewery-logos/tireduncle.avif",
    arriveTime: "16:30",
    departTime: "17:00",
    distanceToNext: 3.8,
    address: "Helsinki, Finland",
  },
  {
    id: "coolhead",
    name: "CoolHead Brew",
    logo: "/assets/brewery-logos/coolhead.jpg",
    arriveTime: "17:30",
    // No departure time - final stop
    address: "Helsinki, Finland",
  },
];
