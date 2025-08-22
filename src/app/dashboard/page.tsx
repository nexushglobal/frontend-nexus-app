import { ActiveBannersCarousel } from '@/features/dashboard/components/client/ActiveBannersCarousel';

export default function HomeDashboard() {
    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Banners Carousel */}
            <ActiveBannersCarousel 
                autoplayInterval={6000}
                showControls={true}
                showIndicators={true}
                className="mb-8"
            />

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center text-center py-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    NEXUS 2.0
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                    Bienvenido al panel de administración de Nexus Global Network
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Gestiona tu red, productos, puntos y más desde aquí.
                </p>
            </main>
        </div>
    );
}