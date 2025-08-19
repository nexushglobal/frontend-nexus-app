"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function HeroSection() {
    const scrollToForm = () => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <div className="relative min-h-[calc(100vh-115px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Floating elements */}
            <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl opacity-20"
            ></motion.div>
            <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-r from-emerald-500 to-primary rounded-full opacity-20"
            ></motion.div>
            <motion.div
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute top-1/3 right-1/4 w-8 h-8 bg-primary rounded-lg opacity-15"
            ></motion.div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-8"
                    >
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-primary font-medium">+10 años en el sector inmobiliario</span>
                        <TrendingUp className="w-4 h-4 text-primary" />
                    </motion.div>

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
                        className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 font-medium"
                    >
                        Tu camino hacia la{" "}
                        <span className="text-primary font-semibold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                            libertad financiera
                        </span>
                    </motion.p>

                    {/* Quick stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-muted-foreground"
                    >
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            +4,000 Lotes Vendidos
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            +10,000 Lotes en Propiedad
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            S/ 300M+ en Activos
                        </div>
                    </motion.div>

                    {/* Descripción */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        Invierte en bienes raíces, desarrolla tu educación financiera y construye tu negocio inmobiliario. 
                        Más de 10 años de experiencia respaldando tu camino hacia la libertad financiera.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                    >
                        <Button 
                            onClick={scrollToForm}
                            size="lg" 
                            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 group"
                        >
                            Comenzar Ahora
                            <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="h-5 w-5" />
                            </motion.div>
                        </Button>

                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
                    >
                        <span>✓ Desarrolladora Inmobiliaria</span>
                        <div className="w-px h-4 bg-border"></div>
                        <span>✓ Financiera Propia</span>
                        <div className="w-px h-4 bg-border"></div>
                        <span>✓ Nexus Academy</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}