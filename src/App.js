import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ManningCalculator from "./components/ManningCalculator";
import DarcyCalculator from "./components/DarcyCalculator";
import HazenCalculator from "./components/HazenCalculator";
import ChannelDesign from "./components/ChannelDesign";
import backgroundImage from './blurred-image-1.jpg';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <BrowserRouter>
        <Navbar />
        <div style={{ flex: 1 }}>
          <div className="container my-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/manning" element={<ManningCalculator />} />
              <Route path="/darcy" element={<DarcyCalculator />} />
              <Route path="/hazen" element={<HazenCalculator />} />
              <Route path="/design" element={<ChannelDesign />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
