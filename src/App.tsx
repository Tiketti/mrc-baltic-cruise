import { Route, Routes } from "react-router-dom";
// import { Navigation } from "./components/Navigation";
import { BalticCruise } from "./pages/BalticCruise";
import { BreweryRun } from "./pages/BreweryRun";
import { Home } from "./pages/Home";

function App() {
  return (
    <>
      {/* Navigation temporarily hidden for brewery run focus */}
      {/* <Navigation /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/baltic-cruise" element={<BalticCruise />} />
        <Route path="/brewery-run" element={<BreweryRun />} />
      </Routes>
    </>
  );
}

export default App;
