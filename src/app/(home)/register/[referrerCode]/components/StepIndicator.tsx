"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, CreditCard, Lock, User } from "lucide-react";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const steps = [
    {
        id: 1,
        title: "Documento",
        description: "Información de identificación",
        icon: CreditCard,
    },
    {
        id: 2,
        title: "Información Personal",
        description: "Datos personales",
        icon: User,
    },
    {
        id: 3,
        title: "Credenciales",
        description: "Email y contraseña",
        icon: Lock,
    },
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isUpcoming = currentStep < step.id;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex items-center">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className={cn(
                                        "relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                                        {
                                            "border-primary bg-primary text-primary-foreground shadow-md": isCompleted,
                                            "border-primary bg-background text-primary ring-2 ring-primary/20": isCurrent,
                                            "border-muted-foreground/30 bg-muted/30 text-muted-foreground/60": isUpcoming,
                                        }
                                    )}
                                    initial={false}
                                    animate={{
                                        scale: isCurrent ? 1.1 : 1,
                                        opacity: isUpcoming ? 0.6 : 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isCompleted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.2, delay: 0.1 }}
                                        >
                                            <Check className="h-6 w-6" />
                                        </motion.div>
                                    ) : (
                                        <Icon className="h-6 w-6" />
                                    )}
                                </motion.div>

                                {/* Step Labels */}
                                <div className="mt-3 text-center">
                                    <div
                                        className={cn(
                                            "text-sm font-medium transition-colors duration-200",
                                            {
                                                "text-foreground": isCurrent || isCompleted,
                                                "text-muted-foreground/60": isUpcoming,
                                            }
                                        )}
                                    >
                                        {step.title}
                                    </div>
                                    <div
                                        className={cn(
                                            "text-xs mt-1 max-w-[100px] transition-colors duration-200",
                                            {
                                                "text-muted-foreground": !isUpcoming,
                                                "text-muted-foreground/50": isUpcoming,
                                            }
                                        )}
                                    >
                                        {step.description}
                                    </div>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    className="mx-4 h-0.5 flex-1 bg-muted"
                                    initial={false}
                                >
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: currentStep > step.id ? "100%" : "0%",
                                        }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Paso {currentStep} de {totalSteps}</span>
                    <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
        </div>
    );
}