import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MenuItem } from '@features/layout/types/menu.types';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import SidebarLink from './SidebarLink';
import { useQueryClient } from '@tanstack/react-query';
import { performLogoutCleanup } from '@/lib/logout-utils';

type Props = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile?: boolean;
  menuItems: MenuItem[];
};

export const SidebarContent = ({
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
  menuItems = [],
}: Props) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const user = session?.user;

  const handleSignOut = async () => {
    // Limpiar todos los datos antes de cerrar sesión
    performLogoutCleanup(queryClient);
    await signOut();
  };

  if (!user) return null;

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 256,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      className="flex flex-col h-dvh sticky top-0 border-r bg-layout-sidebar text-layout-sidebar-foreground"
      style={{
        borderRightColor: 'var(--sidebar-border)',
      }}
    >
      <div
        className="flex items-center justify-between p-3 border-b"
        style={{
          borderBottomColor: 'var(--sidebar-border)',
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden whitespace-nowrap"
        >
          <Image
            src="/imgs/logo_blanco_color.png"
            alt="Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </motion.div>

        {!isMobile && (
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: 'var(--nav-item-hover)',
              rotate: isCollapsed ? 5 : -5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl transition-colors shadow-sm"
            style={{
              color: 'var(--nav-item-active)',
              border: '1px solid var(--sidebar-border)',
            }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3, type: "spring", damping: 15 }}
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </motion.div>
          </motion.button>
        )}
      </div>

      <div
        className="p-4 border-b bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        style={{
          borderBottomColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="aspect-square w-12 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg border-2 border-white/20"
                    style={{
                      background: `linear-gradient(135deg, var(--nav-item-active), var(--chart-3))`,
                    }}
                  >
                    {user.photo ? (
                      <Image
                        src={user.photo}
                        alt="Foto de perfil"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={22} className="text-white" />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-layout-sidebar border-sidebar-border shadow-lg"
                >
                  <div className="space-y-2">
                    <p className="font-medium text-layout-sidebar-foreground">
                      {user.email}
                    </p>
                    <div
                      className="h-px w-full"
                      style={{ backgroundColor: 'var(--sidebar-border)' }}
                    />
                    <p className="text-xs text-layout-sidebar-foreground opacity-70">
                      {user.role.name}
                    </p>
                    {user.nickname && (
                      <p className="text-xs text-primary font-medium">
                        @{user.nickname}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 15 }}
              className="aspect-square w-12 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg border-2 border-white/20 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, var(--nav-item-active), var(--chart-3))`,
              }}
            >
              {user.photo ? (
                <Image
                  src={user.photo}
                  alt="Foto de perfil"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={22} className="text-white" />
              )}
            </motion.div>
          )}

          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col overflow-hidden"
          >
            <motion.span 
              className="font-semibold truncate text-layout-sidebar-foreground text-sm"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              {user.email}
            </motion.span>
            <motion.span
              className="text-xs truncate px-2 py-1 rounded-full bg-primary/10 text-center mt-1"
              style={{ color: 'var(--nav-item-active)' }}
              whileHover={{ scale: 1.05 }}
            >
              {user.role.name}
            </motion.span>
            {user.nickname && (
              <motion.p
                className="text-xs mt-1 font-medium"
                style={{ color: 'var(--nav-item-active)' }}
                whileHover={{ x: 2 }}
              >
                @{user.nickname}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <div className="space-y-2 px-3">
          {menuItems.map((item) => (
            <SidebarLink key={item.id} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </nav>

      <motion.div
        className="p-4 border-t"
        style={{
          borderTopColor: 'var(--sidebar-border)',
        }}
      >
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    rotate: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-3 p-3 mx-2 rounded-xl transition-colors w-full border border-transparent hover:border-destructive/20"
                  style={{
                    color: 'var(--destructive)',
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogOut size={20} />
                  </motion.div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-layout-sidebar border-sidebar-border shadow-lg"
              >
                <p className="text-layout-sidebar-foreground font-medium">Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.button
            whileHover={{
              scale: 1.02,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              x: 2,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            className="flex items-center gap-3 p-3 mx-2 rounded-xl transition-colors w-full group border border-transparent hover:border-destructive/20"
            style={{
              color: 'var(--destructive)',
            }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut size={20} />
            </motion.div>
            <span className="font-medium">Cerrar Sesión</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
