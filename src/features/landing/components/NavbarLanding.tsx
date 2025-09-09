'use client';

import { Button } from '@/components/ui/button';
import { LoginSheet } from '@/features/auth/components/LoginSheet';
import ThemeSwitch from '@/features/shared/components/ThemeSwich';
import { UserMenu } from '@/features/user/components/UserMenu';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export function NavbarLanding() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-[130px] h-8">
                {/* Logo claro - visible en light mode */}
                <Image
                  src="/imgs/logo_negro.png"
                  alt="Nexus Global Network"
                  width={130}
                  height={32}
                  priority
                  className="absolute inset-0 dark:opacity-0 transition-opacity duration-200"
                />
                {/* Logo oscuro - visible en dark mode */}
                <Image
                  src="/imgs/logo_blanco_color.png"
                  alt="Nexus Global Network"
                  width={130}
                  height={32}
                  className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-200"
                />
              </div>
              <span className="text-xl font-bold text-foreground hidden">
                Nexus H. Global
              </span>
            </Link>
          </div>
          <ThemeSwitch />
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Button asChild variant="outline">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserMenu />
              </div>
            ) : (
              <LoginSheet>
                <Button>Ingresar</Button>
              </LoginSheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
