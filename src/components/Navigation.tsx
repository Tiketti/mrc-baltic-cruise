import { Link, useLocation } from "react-router-dom";

const CRUISE1_PATH = "/baltic-cruise-1" as const;
const CRUISE2_PATH = "/baltic-cruise-2" as const;
const CRUISE3_PATH = "/baltic-cruise-3" as const;

// The nav floats above each page's own themed header, so it has to follow the same theme.
// Anything not listed here (2025, Brewery Run, Admin) keeps the root palette.
const THEME_BY_PATH: Record<string, string> = {
  "/": "2027",
  [CRUISE3_PATH]: "2027",
  "/baltic-cruise-2027": "2027",
  [CRUISE2_PATH]: "2026",
  "/baltic-cruise-2026": "2026",
};

const TABS = [
  {
    to: CRUISE3_PATH,
    label: "Cruise '27",
    aliases: ["/", CRUISE3_PATH, "/baltic-cruise-2027"],
  },
  {
    to: CRUISE2_PATH,
    label: "Cruise '26",
    aliases: [CRUISE2_PATH, "/baltic-cruise-2026"],
  },
  {
    to: CRUISE1_PATH,
    label: "Cruise '25",
    aliases: [CRUISE1_PATH, "/baltic-cruise-2025"],
  },
  { to: "/brewery-run", label: "Brewery Run", aliases: ["/brewery-run"] },
];

// Four tabs only fit a phone viewport with tight padding, and they must never wrap mid-label.
// The ink stays fully opaque: against 2027's moss green bar, surface/80 falls under AA at this size.
// The active pill also carries a surface-coloured outline, since burgundy-on-moss is only 1.7:1 on
// its own. It's a border rather than a ring: a ring is a box-shadow, which the scroll container clips.
// Every tab reserves the border width so switching tabs doesn't resize them, but the colour is set
// per state: Tailwind emits border-transparent after border-surface, so both on one element would clash.
const TAB_CLASSES =
  "whitespace-nowrap rounded border px-2 py-2 font-medium text-surface text-xs transition-colors sm:px-4 sm:text-sm";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav
      data-theme={THEME_BY_PATH[location.pathname]}
      className="fixed top-4 right-0 left-0 z-50 min-[390px]:right-4 min-[390px]:left-4"
    >
      {/* The compact tab row needs 336px, so the inset pill only fits from 384px up. Below that
          (iPhone SE and narrower) the bar goes edge to edge to buy back the 48px of inset+padding. */}
      <div className="bg-primary/95 px-2 py-2 shadow-lg backdrop-blur-sm sm:px-4 min-[390px]:rounded-lg">
        {/* w-max + mx-auto centres the row when it fits and scrolls it when it doesn't,
            unlike justify-center which would clip the first tab out of reach. */}
        <div className="overflow-x-auto">
          <div className="mx-auto flex w-max space-x-1 sm:space-x-4">
            {TABS.map(({ to, label, aliases }) => {
              const isActive = aliases.includes(location.pathname);

              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={isActive ? "page" : undefined}
                  className={`${TAB_CLASSES} ${isActive ? "border-surface bg-accent" : "border-transparent hover:bg-primary/50"}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
