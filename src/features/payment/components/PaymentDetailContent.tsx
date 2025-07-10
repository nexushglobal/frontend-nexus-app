'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PaymentDetailResponse } from '../types/payments.type'
import { OverviewSection } from './sections/OverviewSection'
import { paymentDetailMenuSections } from '../utils/menu.utils'


interface PaymentDetailContentProps {
    payment: PaymentDetailResponse
    paymentId: string
}

export function PaymentDetailContent({ payment, paymentId }: PaymentDetailContentProps) {
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

    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return <OverviewSection payment={payment} />
            // case 'details':
            //     return <DetailsSection payment={payment} />
            // case 'items':
            //     return <ItemsSection payment={payment} />
            // case 'timeline':
            //     return <TimelineSection payment={payment} />
            // case 'metadata':
            //     return <MetadataSection payment={payment} />
            default:
                return <OverviewSection payment={payment} />
        }
    }

    const handleBackToPayments = () => {
        router.push('/dashboard/mis-pagos')
    }

    if (isMobile) {
        return (
            <div className="space-y-6">
                {/* Mobile Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackToPayments}
                                className="p-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle className="text-lg">Pago #{paymentId}</CardTitle>
                                <p className="text-sm text-gray-600">
                                    {payment.paymentConfig.name}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Mobile Section Selector */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-2">
                            {paymentDetailMenuSections.map((section) => {
                                const Icon = section.icon
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`p-3 rounded-lg text-left transition-colors ${activeSection === section.id
                                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="h-4 w-4" />
                                            <span className="font-medium text-sm">{section.label}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {section.description}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile Content */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderSection()}
                </motion.div>
            </div>
        )
    }

    // Desktop Layout
    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3">
                <Card className="sticky top-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            Navegación
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <nav className="space-y-1">
                            {paymentDetailMenuSections.map((section) => {
                                const Icon = section.icon
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${activeSection === section.id
                                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium text-sm">{section.label}</div>
                                            <div className="text-xs text-gray-500">{section.description}</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </nav>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderSection()}
                </motion.div>
            </div>
        </div>
    )
}