import React from "react";
import Navbar from "./components/NavbarDashboard";
import Sidebar from "./components/Sidebar";
export default function LayoutDashboard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
