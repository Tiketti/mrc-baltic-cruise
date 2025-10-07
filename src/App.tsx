import { Route, Routes, Navigate } from "react-router-dom";
// import { Navigation } from "./components/Navigation";
import { Admin } from "./pages/Admin";
import { BalticCruise } from "./pages/BalticCruise";
import { BreweryRun } from "./pages/BreweryRun";
import { Home } from "./pages/Home";

function App() {
  return (
    <>
      {/* Navigation temporarily hidden for brewery run focus */}
      {/* <Navigation /> */}
      <Routes>
        {/* Redirect root to brewery run for focused launch */}
        <Route path="/" element={<Navigate to="/brewery-run" replace />} />

        {/* Admin dashboard for updating LiveTrack URL */}
        <Route path="/admin" element={<Admin />} />

        {/* Preserved routes - accessible but not linked */}
        <Route path="/home" element={<Home />} />
        <Route path="/baltic-cruise" element={<BalticCruise />} />

        <Route path="/brewery-run" element={<BreweryRun />} />
      </Routes>
    </>
  );
}

export default App;
