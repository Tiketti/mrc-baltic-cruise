import { Link, useLocation } from "react-router-dom";


const CRUISE1_PATH = "/baltic-cruise-1" as const;
const CRUISE2_PATH = "/baltic-cruise-2" as const;

export const Navigation = () => {
  const location = useLocation();

  // Helper function to check if a route is active
  // Handles alias routes (e.g., /baltic-cruise-1 and /baltic-cruise-2025 both highlight Cruise I)
  const isActive = (routes: string[]) =>  routes.some((route) => location.pathname === route);
  
  return (
    <nav className="fixed top-4 right-4 left-4 z-50">
      <div className="rounded-lg bg-primary/95 px-4 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex justify-center space-x-2 sm:space-x-4">
          <Link
            to="/brewery-run"
            className={`rounded px-3 py-2 font-medium text-xs transition-colors sm:px-4 ${
              isActive(["/brewery-run"])
                ? "bg-accent text-surface"
                : "text-surface/80 hover:bg-primary/50 hover:text-surface"
            }`}
          >
            <span className="hidden sm:inline">Brewery Run</span>
            <span className="sm:hidden">Brewery Run 2025</span>
          </Link>
          <Link
            to={CRUISE1_PATH}
            className={`rounded px-3 py-2 font-medium text-xs transition-colors sm:px-4 ${
              isActive(["/baltic-cruise-1", "/baltic-cruise-2025"])
                ? "bg-accent text-surface"
                : "text-surface/80 hover:bg-primary/50 hover:text-surface"
            }`}
          >
            <span className="hidden sm:inline">Cruise '25</span>
            <span className="sm:hidden">Cruise '25</span>
          </Link>
          <Link
            to={CRUISE2_PATH}
            className={`rounded px-3 py-2 font-medium text-xs transition-colors sm:px-4 ${
              isActive(["/", "/baltic-cruise-2", "/baltic-cruise-2026"])
                ? "bg-accent text-surface"
                : "text-surface/80 hover:bg-primary/50 hover:text-surface"
            }`}
          >
            <span className="hidden sm:inline">Cruise '26</span>
            <span className="sm:hidden">Cruise '26</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
