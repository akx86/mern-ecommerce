import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';


const NoiseOverlay = () => (
  <div className="hidden md:block fixed inset-0 z-[0] pointer-events-none opacity-[0.04] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const BackgroundEffects = () => (
  <div className="fixed inset-0 z-[0] pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px]" />
  </div>
);


export const MainLayout = () => {
    return (
        <div className="relative min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">

            <NoiseOverlay />
            <BackgroundEffects />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                
                <main className="flex-1 w-full pt-20">
                    <Outlet />
                </main>
                
                <Footer />
            </div>
        </div>
    );
};
export const MinimalLayout = () => {
    return (
        <div className="relative min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            <NoiseOverlay />
            <BackgroundEffects />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                
                <main className="flex-1 w-full flex items-center justify-center pt-20 py-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};