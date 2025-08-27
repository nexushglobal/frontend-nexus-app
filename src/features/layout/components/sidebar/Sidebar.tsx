"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { getUserMenuAction } from "@features/layout/actions/get-menu";
import { MenuItem } from "@features/layout/types/menu.types";
import { AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { SidebarContent } from "./SidebarContent";

export interface SidebarRef {
    toggleMobile: () => void;
}

const Sidebar = forwardRef<SidebarRef>((props, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        toggleMobile: () => setIsMobileOpen(!isMobileOpen)
    }));

    useEffect(() => {

        const fetchMenuData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const { data, success, error } = await getUserMenuAction();

                if (success && data) {
                    setMenuItems(data.views);
                } else {
                    setError(error || "Error al cargar el menú");
                }
            } catch (err) {
                console.error("Error fetching menu:", err);
                setError("Error al cargar el menú");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    if (isLoading) {
        return (
            <div className="hidden lg:block w-64 h-screen bg-gray-900 border-r border-gray-800">
                <div className="p-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-10 bg-gray-800 rounded"></div>
                        <div className="space-y-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-8 bg-gray-800 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="hidden lg:block w-64 h-screen bg-gray-900 border-r border-gray-800">
                <div className="p-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <>
            <AnimatePresence>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetContent side="left" className="p-0 w-64 border-r-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Menú de navegación</SheetTitle>
                        </SheetHeader>
                        <SidebarContent
                            isCollapsed={false}
                            setIsCollapsed={() => { }}
                            isMobile={true}
                            menuItems={menuItems}
                        />
                    </SheetContent>
                </Sheet>
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <SidebarContent
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobile={false}
                    menuItems={menuItems}
                />
            </div>
        </>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;