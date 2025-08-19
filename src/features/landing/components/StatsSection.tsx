"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
    {
        number: 10,
        suffix: "+",
        title: "Años de Experiencia",
        description: "En el sector inmobiliario peruano"
    },
    {
        number: 4000,
        suffix: "+",
        title: "Lotes Vendidos",
        description: "Proyectos inmobiliarios exitosos"
    },
    {
        number: 10000,
        suffix: "+",
        title: "Lotes en Propiedad",
        description: "Inventario exclusivo disponible"
    },
];

function AnimatedNumber({ number, suffix, inView }: { number: number, suffix: string, inView: boolean }) {
    const [displayNumber, setDisplayNumber] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            setDisplayNumber(Math.floor(increment * currentStep));

            if (currentStep >= steps) {
                setDisplayNumber(number);
                clearInterval(timer);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [inView, number]);

    const formatNumber = (num: number) => {
        if (suffix === "M+") {
            return (num / 1000000).toFixed(1);
        }
        return num.toLocaleString();
    };

    return (
        <span className="text-4xl md:text-5xl font-bold">
            {formatNumber(displayNumber)}{suffix}
        </span>
    );
}

export function StatsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.3 });

    return (
        <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-background to-emerald-500/5">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        Respaldo que genera confianza
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Más de una década construyendo sueños inmobiliarios en el Perú
                    </p>
                </motion.div>

                <div ref={ref} className="grid md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-primary mb-4">
                                    <AnimatedNumber 
                                        number={stat.number} 
                                        suffix={stat.suffix}
                                        inView={isInView}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">{stat.title}</h3>
                                <p className="text-muted-foreground">{stat.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}