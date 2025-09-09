import { NavbarLanding } from "@/features/landing/components/NavbarLanding";
export default function LayoutLanding({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <div className="flex-1 flex flex-col min-h-dvh">
                <NavbarLanding />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
