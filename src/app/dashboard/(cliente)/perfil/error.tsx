"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("Profile page error:", error);
    }, [error]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card className="mx-auto max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-destructive">Error al cargar el perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                        Ha ocurrido un error inesperado al cargar la información de tu perfil.
                    </p>
                    <Button onClick={reset} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Intentar nuevamente
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}