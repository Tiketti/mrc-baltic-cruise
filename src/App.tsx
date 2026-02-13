import { Route, Routes, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Admin } from "./pages/Admin";
import { BalticCruise2025 } from "./pages/BalticCruise2025";
import { BalticCruise2026 } from "./pages/BalticCruise2026";
import { BreweryRun } from "./pages/BreweryRun";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        {/* Redirect root to the latest event (Baltic Cruise 2026) */}
        <Route path="/" element={<Navigate to="/baltic-cruise-2" replace />} />

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
    </>
  );
}

export default App;
