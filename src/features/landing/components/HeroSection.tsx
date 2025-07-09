"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <div className="relative min-h-[calc(100vh-115px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="text-center max-w-4xl mx-auto">

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-emerald-600 bg-clip-text text-transparent leading-tight"
                    >
                        NEXUS H GLOBAL
                    </motion.h1>

                    {/* Slogan */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 font-medium"
                    >
                        Tu camino hacia la{" "}
                        <span className="text-primary font-semibold">libertad financiera</span>
                    </motion.p>

                    {/* Descripción */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Únete a la red de emprendedores más exitosa de Latinoamérica.
                        Construye tu futuro financiero con productos de calidad y un sistema de compensación revolucionario.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                    >
                        <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group">
                            <Link href="/register/new">
                                Comenzar Ahora
                                <motion.div
                                    className="ml-2"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </motion.div>
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary/5 transition-all duration-300">
                            <Link href="/about">
                                Conoce Más
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}