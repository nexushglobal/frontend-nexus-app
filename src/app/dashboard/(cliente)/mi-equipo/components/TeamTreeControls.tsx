"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Home,
    ArrowUp,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    Info
} from "lucide-react";

interface TeamTreeControlsProps {
    canGoUp: boolean;
    isAtRoot: boolean;
    currentDepth: number;
    onNavigateToRoot: () => void;
    onNavigateToParent: () => void;
    onChangeDepth: (depth: number) => void;
    onRefresh: () => void;
}

export function TeamTreeControls({
    canGoUp,
    isAtRoot,
    currentDepth,
    onNavigateToRoot,
    onNavigateToParent,
    onChangeDepth,
    onRefresh,
}: TeamTreeControlsProps) {
    const handleZoomIn = () => {
        if (currentDepth < 5) {
            onChangeDepth(currentDepth + 1);
        }
    };

    const handleZoomOut = () => {
        if (currentDepth > 1) {
            onChangeDepth(currentDepth - 1);
        }
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    {/* Navegación */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onNavigateToRoot}
                            disabled={isAtRoot}
                            className="flex items-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Mi Raíz
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onNavigateToParent}
                            disabled={!canGoUp}
                            className="flex items-center gap-2"
                        >
                            <ArrowUp className="h-4 w-4" />
                            Subir
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Actualizar
                        </Button>
                    </div>

                    {/* Info y controles de profundidad */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Información actual */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="h-4 w-4" />
                            <span>Profundidad:</span>
                            <Badge variant="outline">{currentDepth}</Badge>
                        </div>

                        {/* Controles de zoom */}
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleZoomOut}
                                disabled={currentDepth <= 1}
                                className="h-8 w-8 p-0"
                                title="Reducir profundidad"
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleZoomIn}
                                disabled={currentDepth >= 5}
                                className="h-8 w-8 p-0"
                                title="Aumentar profundidad"
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Indicadores de estado */}
                <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {isAtRoot && (
                        <Badge variant="secondary" className="text-xs">
                            📍 Vista desde tu usuario raíz
                        </Badge>
                    )}
                    {!canGoUp && !isAtRoot && (
                        <Badge variant="outline" className="text-xs">
                            🔝 En el nivel más alto disponible
                        </Badge>
                    )}
                    {currentDepth >= 5 && (
                        <Badge variant="outline" className="text-xs">
                            🔍 Profundidad máxima alcanzada
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}