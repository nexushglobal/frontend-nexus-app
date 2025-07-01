"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentDetailResponse } from "../actions";
import { paymentDetailMenuSections } from "../utils/menu.utils";
import { DetailsSection } from "./sections/DetailsSection";
import { MetadataSection } from "./sections/MetadataSection";
import { OverviewSection } from "./sections/OverviewSection";
import { TimelineSection } from "./sections/TimelineSection";
import { ItemsSection } from "./sections/ItemsSection";

interface PaymentDetailContentProps {
    payment: PaymentDetailResponse;
    paymentId: string;
}

export function PaymentDetailContent({ payment, paymentId }: PaymentDetailContentProps) {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("overview");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const renderSection = () => {
        switch (activeSection) {
            case "overview":
                return <OverviewSection payment={payment} />;
            case "details":
                return <DetailsSection payment={payment} />;
            case "items":
                return <ItemsSection payment={payment} />;
            case "timeline":
                return <TimelineSection payment={payment} />;
            case "metadata":
                return <MetadataSection payment={payment} />;
            default:
                return <OverviewSection payment={payment} />;
        }
    };

    const handleBackToPayments = () => {
        router.push('/dashboard/mis-pagos');
    };

    if (isMobile) {
        return (
            <div className="space-y-6">
                {/* Mobile Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBackToPayments}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                        </div>
                        <CardTitle>Detalle del Pago #{paymentId}</CardTitle>
                    </CardHeader>
                </Card>

                {/* Mobile Menu */}
                <Card>
                    <CardContent className="p-2">
                        <div className="flex gap-1 overflow-x-auto">
                            {paymentDetailMenuSections.map((section) => (
                                <Button
                                    key={section.id}
                                    variant={activeSection === section.id ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveSection(section.id)}
                                    className="whitespace-nowrap flex-shrink-0"
                                >
                                    <section.icon className="h-4 w-4 mr-1" />
                                    {section.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile Content */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderSection()}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Desktop Sidebar Navigation */}
            <div className="col-span-3">
                <Card>

                    <CardContent className="p-0">
                        <nav className="space-y-1">
                            {paymentDetailMenuSections.map((section) => {
                                const isActive = activeSection === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-muted/50 ${isActive
                                            ? "bg-primary/10 text-primary border-r-2 border-r-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <section.icon className="h-4 w-4 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium truncate">
                                                {section.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {section.description}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Content */}
            <div className="col-span-9">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderSection()}
                </motion.div>
            </div>
        </div>
    );
}