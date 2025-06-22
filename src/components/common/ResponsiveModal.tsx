"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ResponsiveModalProps {
    children: React.ReactNode; // Trigger element
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    maxWidth?: string;
    mobileHeight?: string;
    desktopHeight?: string;

    // Content and actions
    content: React.ReactNode;
    actions?: React.ReactNode;

    // Custom footer (optional)
    customFooter?: React.ReactNode;

    // Loading state
    isPending?: boolean;

    // Cancel/Submit actions (for default footer)
    onCancel?: () => void;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    submitDisabled?: boolean;
}

export function ResponsiveModal({
    children,
    open,
    onOpenChange,
    title,
    icon: Icon,
    maxWidth = "sm:max-w-xl",
    mobileHeight = "h-[60vh]",
    desktopHeight = "max-h-[70vh]",
    content,
    actions,
    customFooter,
    isPending = false,
    onCancel,
    onSubmit,
    submitLabel = "Guardar",
    cancelLabel = "Cancelar",
    submitDisabled = false,
}: ResponsiveModalProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onOpenChange(false);
        }
    };

    // Default footer with cancel/submit buttons
    const DefaultFooter = () => (
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t bg-background">
            <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 sm:flex-none"
            >
                <X className="mr-2 h-4 w-4" />
                {cancelLabel}
            </Button>

            {onSubmit && (
                <Button
                    type="submit"
                    onClick={onSubmit}
                    disabled={isPending || submitDisabled}
                    className="flex-1 sm:flex-none"
                >
                    {isPending ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Guardando...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            )}
        </div>
    );

    const ModalContent = () => (
        <div className="space-y-6">
            <ScrollArea className={isMobile ? mobileHeight : desktopHeight}>
                <div className="pr-4">
                    {content}
                </div>
            </ScrollArea>

            {/* Footer */}
            {customFooter || (actions && !customFooter) ? (
                <div className="pt-4 border-t bg-background">
                    {customFooter || actions}
                </div>
            ) : (
                <DefaultFooter />
            )}
        </div>
    );

    const TitleComponent = () => (
        <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader className="text-left pb-4">
                        <DrawerTitle>
                            <TitleComponent />
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <ModalContent />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className={`${maxWidth} max-h-[90vh] flex flex-col`}>
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>
                        <TitleComponent />
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <ModalContent />
                </div>
            </DialogContent>
        </Dialog>
    );
}