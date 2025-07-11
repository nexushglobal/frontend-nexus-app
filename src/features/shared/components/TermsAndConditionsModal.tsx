"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TermsAndConditionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: (accepted: boolean) => void;
    isAccepted: boolean;
}

export function TermsAndConditionsModal({
    open,
    onOpenChange,
    onAccept,
    isAccepted,
}: TermsAndConditionsModalProps) {
    const [accepted, setAccepted] = useState(isAccepted);
    const [showError, setShowError] = useState(false);
    const [termsContent, setTermsContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTerms() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/terms');

                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo de términos y condiciones');
                }

                const data = await response.json();
                setTermsContent(data.content);
            } catch (error) {
                console.error("Error cargando términos y condiciones:", error);
                setError("Error al cargar los términos y condiciones. Por favor, inténtelo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        }

        if (open) {
            fetchTerms();
            setAccepted(isAccepted);
            setShowError(false);
        }
    }, [open, isAccepted]);

    const handleAccept = () => {
        if (!accepted) {
            setShowError(true);
            return;
        }
        setShowError(false);
        onAccept(true);
        onOpenChange(false);
    };

    const handleCancel = () => {
        setAccepted(isAccepted);
        setShowError(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        📋 Términos y Condiciones
                    </DialogTitle>
                    <DialogDescription>
                        Por favor lee detenidamente nuestros términos y condiciones antes de continuar con el registro.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 border rounded-md overflow-hidden bg-muted/20">
                    <ScrollArea className="h-[50vh] p-4">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-full space-y-3">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Cargando términos y condiciones...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col justify-center items-center h-full space-y-3">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                                <p className="text-sm text-center text-muted-foreground">{error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                >
                                    Reintentar
                                </Button>
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert prose-headings:font-semibold prose-headings:text-primary max-w-none">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {termsContent}
                                </ReactMarkdown>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <Checkbox
                            id="terms"
                            checked={accepted}
                            onCheckedChange={(checked) => {
                                setAccepted(checked === true);
                                if (checked) setShowError(false);
                            }}
                            className="mt-1"
                            disabled={loading || !!error}
                        />
                        <div>
                            <Label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                He leído y acepto los términos y condiciones
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Al marcar esta casilla, confirmas que has leído y aceptas los términos y condiciones de Nexus H. Global.
                            </p>
                        </div>
                    </div>

                    {showError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Debes aceptar los términos y condiciones para continuar con el registro.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="mt-4 gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAccept}
                        disabled={loading || !!error}
                        className="min-w-[100px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cargando...
                            </>
                        ) : (
                            "Aceptar y Continuar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}