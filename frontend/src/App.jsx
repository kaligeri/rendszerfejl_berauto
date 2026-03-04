import { BrowserRouter, Routes, Route } from "react-router-dom";
import Headernav from "./header";
import Homepage from "./home";
import Carspage from "./cars";

function App() {
  return (
    <BrowserRouter>
      <Headernav />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/autos" element={<Carspage />} />
        <Route path="/gyik" element={<h1>GYIK</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
