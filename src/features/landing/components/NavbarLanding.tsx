"use client";

import { Button } from "@/components/ui/button";
import { LoginModal } from "@/features/auth/components/LoginModal";
import ThemeSwitch from "@/features/shared/components/ThemeSwich";
import { UserMenu } from "@/features/user/components/UserMenu";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function NavbarLanding() {
    const { data: session, status } = useSession();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/imgs/logo.png"
                                alt="Nexus Global Network"
                                width={130}
                                height={32}
                            />
                            <span className="text-xl font-bold text-foreground hidden">
                                Nexus H. Global
                            </span>
                        </Link>
                    </div>
                    <ThemeSwitch />
                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {status === "loading" ? (
                            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                        ) : session ? (
                            <div className="flex items-center space-x-3">
                                <Button asChild variant="outline">
                                    <Link href="/dashboard">
                                        Dashboard
                                    </Link>
                                </Button>
                                <UserMenu />
                            </div>
                        ) : (
                            <LoginModal>
                                <Button>
                                    Ingresar
                                </Button>
                            </LoginModal>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}