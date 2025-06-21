"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { RegisterForm } from "./components/RegisterForm";

interface RegisterPageContentProps {
    referrerCode: string;
    position: "LEFT" | "RIGHT" | null;
}

export function RegisterPageContent({
    referrerCode,
    position,
}: RegisterPageContentProps) {
    const finalPosition = position || "RIGHT";
    const isNewRegistration = referrerCode === "new";

    return (
        <div className="bg-gradient-to-br from-background via-background   min-h-[calc(100vh-72px)]  to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Únete a Nexus H. Global
                    </h1>


                </motion.div>

                {!isNewRegistration && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-md mx-auto mb-8"
                    >
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Invitado por un miembro</p>
                                    <p className="text-xs text-muted-foreground">
                                        Serás parte de su equipo en el lado{" "}
                                        <span className="font-medium">
                                            {finalPosition === "LEFT" ? "izquierdo" : "derecho"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <RegisterForm
                        referrerCode={referrerCode}
                        position={finalPosition}
                    />
                </motion.div>

            </div>
        </div>
    );
}