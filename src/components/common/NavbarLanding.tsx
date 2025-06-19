import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function NavbarLanding() {
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

                    {/* Botón de Ingresar */}
                    <div className="flex items-center">
                        <Button asChild>
                            <Link href="/login">
                                Ingresar
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}