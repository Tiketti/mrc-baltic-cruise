import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-4 right-4 left-4 z-50">
      <div className="rounded-lg bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className={`rounded px-2 py-1 font-medium text-xs transition-colors ${
              location.pathname === "/"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Home
          </Link>
          <Link
            to="/brewery-run"
            className={`rounded px-2 py-1 font-medium text-xs transition-colors ${
              location.pathname === "/brewery-run"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Brewery Run
          </Link>
          <Link
            to="/baltic-cruise"
            className={`rounded px-2 py-1 font-medium text-xs transition-colors ${
              location.pathname === "/baltic-cruise"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Baltic Cruise
          </Link>
        </div>
      </div>
    </nav>
  );
};
