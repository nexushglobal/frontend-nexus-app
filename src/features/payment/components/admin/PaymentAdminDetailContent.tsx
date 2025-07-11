'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PaymentAdminDetailResponse } from '../../types/response-payment'
import { paymentDetailMenuSections } from '../../utils/menu.utils'

import { ItemsSection } from '../shared/sections/ItemsSection'
import { MetadataSection } from '../shared/sections/MetadataSection'
import { TimelineSection } from '../shared/sections/TimelineSection'
import { AdminDetailsSection } from './AdminDetailsSection'
import { AdminOverviewSection } from './AdminOverviewSection'
import { AdminUserSection } from './AdminUserSection'

interface PaymentAdminDetailContentProps {
    payment: PaymentAdminDetailResponse
    paymentId: string
}

export function PaymentAdminDetailContent({ payment, paymentId }: PaymentAdminDetailContentProps) {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState('overview')
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)
        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    const adminMenuSections = [
        {
            id: 'overview',
            label: 'Resumen General',
            icon: 'overview',
            always: true,
            description: 'Vista general del pago'
        },
        {
            id: 'user',
            label: 'Información del Cliente',
            icon: 'user',
            always: true,
            description: 'Datos del usuario que realizó el pago'
        },

        ...paymentDetailMenuSections.filter(section => section.id !== 'overview')
    ]

    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return <AdminOverviewSection {...payment} />
            case 'user':
                return <AdminUserSection user={payment.user} />
            case 'details':
                return <AdminDetailsSection {...payment} />
            case 'items':
                return <ItemsSection {...payment} />
            case 'timeline':
                return <TimelineSection {...payment} />
            case 'metadata':
                return <MetadataSection metadata={payment.metadata} />
            default:
                return <AdminOverviewSection {...payment} />
        }
    }

    const handleBackToPayments = () => {
        router.push('/dashboard/pagos')
    }

    if (isMobile) {
        return (
            <div className="space-y-6">
                {/* Mobile Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
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
                        <CardTitle className="text-xl">Pago #{paymentId}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {payment.paymentConfig.name}
                        </p>
                    </CardHeader>
                </Card>

                {/* Navegación mobile mejorada */}
                <div className="space-y-4">
                    {/* Tabs principales */}
                    <div className="grid grid-cols-4 w-full gap-1 bg-muted p-1 rounded-lg">
                        {["overview", "items", "timeline", "more"].map((tabId) => {
                            const isActive = activeSection === tabId ||
                                (tabId === "more" && !["overview", "items", "timeline"].includes(activeSection));

                            return (
                                <button
                                    key={tabId}
                                    onClick={() => setActiveSection(tabId)}
                                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${isActive
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {tabId === "overview" && "Resumen"}
                                    {tabId === "items" && "Elementos"}
                                    {tabId === "timeline" && "Historial"}
                                    {tabId === "more" && "Más"}
                                </button>
                            );
                        })}
                    </div>

                    {/* Contenido de las secciones */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeSection === "more" ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <MoreHorizontal className="h-5 w-5" />
                                        Más opciones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {adminMenuSections
                                        .filter(section => !["overview", "items", "timeline"].includes(section.id))
                                        .map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className="w-full text-left p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <section.icon className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{section.label}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {section.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                </CardContent>
                            </Card>
                        ) : (
                            renderSection()
                        )}
                    </motion.div>
                </div>
            </div>
        );
    }


    // Desktop Layout
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
                <Card>

                    <CardContent className="p-0">
                        <nav className="space-y-1">
                            {adminMenuSections.map((section) => {
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
    )
}