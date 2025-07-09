
import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "@/features/layout/components/NavbarDashboard";

export default function LayoutDashboard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <div className="sticky top-0 z-50">
                    <Navbar />
                </div>
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}