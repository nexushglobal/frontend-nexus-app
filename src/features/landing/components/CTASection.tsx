"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
    "Vale para compra de lote con cero inicial",
    "Acceso completo a Nexus Academy",
    "Comisiones del 10% al 20% por membresías",
    "Comisiones recurrentes por venta de lotes",
    "Plan de carrera La Travesía del Héroe"
];

export function CTASection() {
    const scrollToForm = () => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-emerald-500/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent leading-tight">
                            ¿Listo para ser un Héroe Inmobiliario?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Únete a Nexus Global y construye tu patrimonio inmobiliario con el respaldo de más de 10 años de experiencia en el sector.
                        </p>

                        <div className="space-y-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    <span className="text-foreground font-medium">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
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

                            <Button 
                                onClick={scrollToForm}
                                variant="outline" 
                                size="lg" 
                                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary/5 transition-all duration-300"
                            >
                                Hablar con un Asesor
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-2xl">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-foreground mb-2">Paquetes de Membresía</h3>
                                <p className="text-muted-foreground">Elige tu plan y comienza hoy</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl">
                                    <span className="font-medium">Básico</span>
                                    <span className="text-primary font-bold">S/ 470</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-emerald-500/5 rounded-xl">
                                    <span className="font-medium">VIP</span>
                                    <span className="text-emerald-600 font-bold">S/ 970</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-orange-500/5 rounded-xl border-2 border-orange-500/20">
                                    <span className="font-medium">Premium</span>
                                    <span className="text-orange-600 font-bold">S/ 2,000</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border/50 text-center">
                                <p className="text-sm text-muted-foreground mb-2">✓ Todos incluyen vale para lote</p>
                                <p className="text-lg font-bold text-primary">Con cero inicial</p>
                                <p className="text-sm text-emerald-600 font-medium">+ Acceso a Nexus Academy</p>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ¡Premium Recomendado!
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}