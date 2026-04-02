import { Route, Routes, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Admin } from "./pages/Admin";
import { BalticCruise2025 } from "./pages/BalticCruise2025";
import { BalticCruise2026 } from "./pages/BalticCruise2026";
import { BreweryRun } from "./pages/BreweryRun";

function App() {
  return (
    <>
      <a
        href="#main-content"
        className="-translate-x-[200%] fixed top-2 left-2 z-[100] rounded bg-brand-burgundy px-4 py-2 text-surface transition-transform duration-200 ease-out focus:translate-x-0"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content">
        <Routes>
          {/* Redirect root to the latest event (Baltic Cruise 2026) */}
          <Route
            path="/"
            element={<Navigate to="/baltic-cruise-2" replace />}
          />

          {/* Admin dashboard for updating LiveTrack URL */}
          <Route path="/admin" element={<Admin />} />

          {/* Baltic Cruise 2025 routes (multiple aliases) */}
          <Route path="/baltic-cruise-1" element={<BalticCruise2025 />} />
          <Route path="/baltic-cruise-2025" element={<BalticCruise2025 />} />

          {/* Baltic Cruise 2026 routes (multiple aliases) */}
          <Route path="/baltic-cruise-2" element={<BalticCruise2026 />} />
          <Route path="/baltic-cruise-2026" element={<BalticCruise2026 />} />

          {/* Brewery Run 2025 */}
          <Route path="/brewery-run" element={<BreweryRun />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
