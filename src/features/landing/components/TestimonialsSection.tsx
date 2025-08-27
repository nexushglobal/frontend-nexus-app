"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        name: "María del Carmen Ruiz",
        role: "Ejecutiva Presidenta",
        image: "/imgs/avatars/avatar-1.jpg",
        text: "Gracias a Nexus Global pude adquirir mi primer lote en El Olivar con cero inicial. Las certificaciones de Nexus Academy me dieron las herramientas para vender otros 15 lotes en mi primer año."
    },
    {
        name: "Carlos Alberto Mendoza",
        role: "Ejecutivo Fundador",
        image: "/imgs/avatars/avatar-2.jpg",
        text: "La Travesía del Héroe Inmobiliario cambió mi perspectiva de los negocios. Llegué a Fundador en 8 meses y ya recibí mi Bono Auto. El respaldo de Huertas Inmobiliaria es increíble."
    },
    {
        name: "Ana Lucía Fernández",
        role: "Ejecutiva Vicepresidenta",
        image: "/imgs/avatars/avatar-3.jpg",
        text: "Como madre de familia, necesitaba ingresos extra. Con Nexus Academy aprendí marketing digital para inmobiliarias y ahora genero comisiones recurrentes vendiendo lotes desde casa."
    },
    {
        name: "Luis Miguel Castro",
        role: "Ejecutivo Leyenda",
        image: "/imgs/avatars/avatar-4.jpg",
        text: "Llegué a Leyenda en 14 meses. Los bonos por consolidación de equipos y el Bono Lote me permitieron construir un patrimonio inmobiliario sólido. Ya califiqué para Qatar."
    },
    {
        name: "Carmen Rosa López",
        role: "Ejecutiva Presidenta",
        image: "/imgs/avatars/avatar-5.jpg",
        text: "La certificación en IA para inmobiliarias me ayudó a automatizar mi proceso de ventas. Ahora manejo mi cartera de clientes eficientemente y mi equipo crece constantemente."
    },
    {
        name: "Roberto Silva Vargas",
        role: "Ejecutivo Fundador",
        image: "/imgs/avatars/avatar-6.jpg",
        text: "Después de 15 años como empleado, Nexus me dio la oportunidad de ser mi propio jefe. Los proyectos Oasis y Flamant se vendieron súper bien en mi región."
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        Héroes Inmobiliarios Nexus
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Conoce las experiencias de nuestros ejecutivos más exitosos a lo largo del Perú
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 relative"
                        >
                            <div className="absolute top-4 right-4 text-primary/20">
                                <Quote className="w-8 h-8" />
                            </div>

                            <div className="flex items-center mb-6">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-gradient-to-br from-primary/20 to-emerald-500/20">
                                    {/* Placeholder avatar with initials */}
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                    <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                                </div>
                            </div>


                            <p className="text-muted-foreground leading-relaxed italic">
                                "{testimonial.text}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}