"use client";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Briefcase, TrendingUp, Shield, Users } from "lucide-react";

const features = [
    {
        icon: Building2,
        title: "Bienes Raíces",
        description: "Invierte en proyectos inmobiliarios consolidados como El Olivar, Apolo, Oasis y Flamant con cero inicial.",
        color: "text-blue-500"
    },
    {
        icon: GraduationCap,
        title: "Nexus Academy",
        description: "Certificaciones en Marketing Digital, IA, Ventas Especializadas y las 13 leyes del éxito para emprendedores inmobiliarios.",
        color: "text-green-500"
    },
    {
        icon: Briefcase,
        title: "Modelo de Negocio",
        description: "Múltiples formas de generar ingresos: comisiones por membresías, ventas de lotes y bonos por consolidación de equipos.",
        color: "text-purple-500"
    },
    {
        icon: TrendingUp,
        title: "La Travesía del Héroe",
        description: "Plan de carrera desde Ejecutivo hasta Leyenda con bonos especiales como Bono Auto, Bono Lote y viajes exclusivos.",
        color: "text-orange-500"
    },
    {
        icon: Shield,
        title: "Respaldo Sólido",
        description: "Tres pilares de solidez: Huertas Inmobiliaria, Inverti Fast + y Huertas + Company con +10 años de experiencia.",
        color: "text-red-500"
    },
    {
        icon: Users,
        title: "Comunidad de Éxito",
        description: "Únete a una red de emprendedores inmobiliarios con mentoría personalizada y apoyo constante para tu crecimiento.",
        color: "text-yellow-500"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        Tu camino hacia la libertad financiera
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Tres pilares sólidos: Bienes Raíces, Educación y Negocios para construir tu futuro financiero
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center mb-6 ${feature.color}`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}