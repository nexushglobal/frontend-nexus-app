import React from "react";
import { NavbarLanding } from "./components/NavbarLanding";
export default function LayoutLanding({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <div className="flex-1 flex flex-col min-h-screen">
                <NavbarLanding />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
