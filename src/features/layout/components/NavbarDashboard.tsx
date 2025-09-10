'use client';

import { Separator } from '@/components/ui/separator';
import { PointsMenu } from '@/features/point/components/PointsMenu';
import NavbarCartIcon from '@/features/shared/components/cart/NavbarCartIcon';
import ThemeSwitch from '@/features/shared/components/ThemeSwich';
import { UserMenu } from '@/features/user/components/UserMenu';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { data: session, status } = useSession();

  const roleCode = session?.user.role?.code;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-border bg-layout-topbar text-layout-topbar-foreground shadow-sm backdrop-blur-sm bg-opacity-95"
    >
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onMenuToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </motion.button>
        </div>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="flex space-x-2 animate-pulse">
              <div className="h-7 w-7 rounded bg-muted" />
              <div className="h-7 w-7 rounded bg-muted" />
            </div>
          ) : (
            <>
              {' '}
              {roleCode === 'CLI' && (
                <>
                  <NavbarCartIcon />
                  <PointsMenu />
                </>
              )}
              <UserMenu profile={roleCode === 'CLI'} />
            </>
          )}

          <ThemeSwitch />

          <Separator orientation="vertical" className="h-6 bg-border" />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
