import { Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { BalticCruise } from "./pages/BalticCruise";
import { Home } from "./pages/Home";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/baltic-cruise" element={<BalticCruise />} />
      </Routes>
    </>
  );
}

export default App;
