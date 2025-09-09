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
  const user = session?.user;

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
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: 'var(--nav-item-active)',
            }}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </motion.button>
        )}
      </div>

      <div
        className="p-4 border-b"
        style={{
          borderBottomColor: 'var(--sidebar-border)',
          backgroundColor: 'rgba(var(--layout-sidebar), 0.5)',
        }}
      >
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square w-10 rounded-full flex items-center justify-center bg-gradient-to-br"
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
                      <User size={20} className="text-white" />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-layout-sidebar border-sidebar-border"
                >
                  <p className="text-xs text-layout-sidebar-foreground">
                    {user.role.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="aspect-square w-10 rounded-full flex items-center justify-center bg-gradient-to-br"
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
                <User size={20} className="text-white" />
              )}
            </motion.div>
          )}

          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
            }}
            transition={{ duration: 0.2 }}
            className="flex flex-col overflow-hidden"
          >
            <span className="font-medium truncate text-layout-sidebar-foreground">
              {user.email}
            </span>
            <span
              className="text-sm truncate"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {user.role.name}
            </span>
            {user.nickname && (
              <p
                className="text-sm"
                style={{ color: 'var(--nav-item-active)' }}
              >
                @{user.nickname}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <motion.div
          className="space-y-1 px-2"
          transition={{ staggerChildren: 0.05 }}
        >
          {menuItems.map((item) => (
            <SidebarLink key={item.id} item={item} isCollapsed={isCollapsed} />
          ))}
        </motion.div>
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
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-3 p-2 rounded-lg transition-colors w-full"
                  style={{
                    color: 'var(--destructive)',
                  }}
                >
                  <LogOut size={20} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-layout-sidebar border-sidebar-border"
              >
                <p className="text-layout-sidebar-foreground">Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.button
            whileHover={{
              scale: 1.02,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut()}
            className="flex items-center gap-3 p-2 rounded-lg transition-colors w-full"
            style={{
              color: 'var(--destructive)',
            }}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
