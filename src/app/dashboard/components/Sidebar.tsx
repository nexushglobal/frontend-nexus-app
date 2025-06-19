"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getUserMenu } from "../actions/user-menu";
import { MenuItem } from "@/types/menu.types";
import { SidebarContent } from "./SidebarContent";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await getUserMenu();

                if (result.success) {
                    setMenuItems(result.data);
                } else {
                    setError(result.message);
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
                    <SheetTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg shadow-md"
                        >
                            <Menu size={20} />
                        </motion.button>
                    </SheetTrigger>
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
};

export default Sidebar;