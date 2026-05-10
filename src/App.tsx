import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-black text-[#f5f5f7] font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
        {/* Subtle background glow */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2997ff]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <AnimatedRoutes />
        <Navigation />
      </div>
    </BrowserRouter>
  );
}
