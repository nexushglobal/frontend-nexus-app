"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Phone, Mail, MessageSquare, UserCheck } from "lucide-react";
import { createLead } from "../actions/create-lead";

export function LeadFormSection() {
    const [isPending, startTransition] = useTransition();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        message: "Hola, estoy interesado en conocer más sobre las oportunidades de inversión inmobiliaria de Nexus Global. Me gustaría que un asesor se comunique conmigo para brindarme más información sobre los paquetes de membresía y cómo puedo comenzar a construir mi patrimonio inmobiliario."
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                await createLead(formData);
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({
                        email: "",
                        phone: "",
                        message: "Hola, estoy interesado en conocer más sobre las oportunidades de inversión inmobiliaria de Nexus Global. Me gustaría que un asesor se comunique conmigo para brindarme más información sobre los paquetes de membresía y cómo puedo comenzar a construir mi patrimonio inmobiliario."
                    });
                }, 3000);
            } catch (error) {
                console.error("Error creating lead:", error);
            }
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <section id="contact-form" className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-emerald-500/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        Habla con un Asesor Experto
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Completa el formulario y un especialista en inversiones inmobiliarias te contactará para guiarte en tu camino hacia la libertad financiera
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Benefits Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                            <h3 className="text-2xl font-bold text-foreground mb-4">¿Qué obtienes al contactarnos?</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">Asesoría Personalizada</h4>
                                        <p className="text-muted-foreground text-sm">Análisis de tu perfil y objetivos financieros</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">Plan de Inversión</h4>
                                        <p className="text-muted-foreground text-sm">Estrategia adaptada a tu presupuesto y metas</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">Acceso Exclusivo</h4>
                                        <p className="text-muted-foreground text-sm">Proyectos inmobiliarios y beneficios especiales</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">Capacitación Incluida</h4>
                                        <p className="text-muted-foreground text-sm">Nexus Academy con certificaciones especializadas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-2xl">
                            {isSubmitted ? (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-foreground mb-3">¡Mensaje Enviado!</h3>
                                    <p className="text-muted-foreground">
                                        Gracias por tu interés. Un asesor experto se comunicará contigo en las próximas horas para comenzar tu camino hacia la libertad financiera.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserCheck className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">
                                            Solicita tu Asesoría Gratuita
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Déjanos tus datos y te contactaremos
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                                                <Mail className="w-4 h-4" />
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                required
                                                className="w-full h-12"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                                                <Phone className="w-4 h-4" />
                                                Teléfono *
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+51 999 999 999"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                required
                                                className="w-full h-12"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="flex items-center gap-2 text-foreground">
                                                <MessageSquare className="w-4 h-4" />
                                                Mensaje
                                            </Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Cuéntanos sobre tu interés..."
                                                value={formData.message}
                                                onChange={(e) => handleInputChange("message", e.target.value)}
                                                required
                                                rows={4}
                                                className="w-full resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full h-12 text-lg bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 transition-all duration-300"
                                        >
                                            {isPending ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Enviando Solicitud...
                                                </>
                                            ) : (
                                                "Solicitar Asesoría Gratuita"
                                            )}
                                        </Button>

                                        <p className="text-xs text-muted-foreground text-center">
                                            Al enviar este formulario, aceptas que un asesor se comunique contigo para brindar información sobre nuestros servicios.
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}