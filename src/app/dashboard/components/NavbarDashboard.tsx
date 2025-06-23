"use client";

import ThemeSwitch from "@/components/common/ThemeSwich";
import { UserMenu } from "@/components/common/UserMenu";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const Navbar = () => {
  const formatDate = () => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-border bg-layout-topbar text-layout-topbar-foreground shadow-sm backdrop-blur-sm bg-opacity-95"
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Sección izquierda - alineada con el contenido del sidebar */}
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-medium capitalize text-muted-foreground flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg"
          >
            <Calendar size={15} className="text-muted-foreground" />
            {formatDate()}
          </motion.div>
        </div>

        {/* Sección derecha */}
        <div className="flex items-center gap-4">
          <UserMenu />
          <Separator orientation="vertical" className="h-6 bg-border" />
          <ThemeSwitch />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;