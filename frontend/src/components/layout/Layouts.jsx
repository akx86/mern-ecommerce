import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Layout كامل
export const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617]">
            <Navbar />
            <main className="flex-1 w-full relative pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

// Layout بسيط
export const MinimalLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617]">
            <Navbar />
            <main className="flex-1 w-full relative pt-20">
                <Outlet />
            </main>
        </div>
    );
};