import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Home,
    ArrowUp,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    Layers,
    Navigation,
    ChevronDown,
    TrendingUp,
    Search
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TeamSearchModal } from "./TeamSearchModal";

interface TeamTreeControlsProps {
    canGoUp: boolean;
    isAtRoot: boolean;
    currentDepth: number;
    onNavigateToRoot: () => void;
    onNavigateToParent: () => void;
    onChangeDepth: (depth: number) => void;
    onRefresh: () => void;
    onNavigateToUser: (userId: string) => void;
}

export function TeamTreeControls({
    canGoUp,
    isAtRoot,
    currentDepth,
    onNavigateToRoot,
    onNavigateToParent,
    onChangeDepth,
    onRefresh,
    onNavigateToUser,
}: TeamTreeControlsProps) {
    const depthOptions = [
        { value: 1, label: "1 Nivel", shortLabel: "1N", description: "Vista básica" },
        { value: 2, label: "2 Niveles", shortLabel: "2N", description: "Vista estándar" },
        { value: 3, label: "3 Niveles", shortLabel: "3N", description: "Vista extendida" },
        { value: 4, label: "4 Niveles", shortLabel: "4N", description: "Vista amplia" },
        { value: 5, label: "5 Niveles", shortLabel: "5N", description: "Vista completa" },
    ];

    const currentDepthOption = depthOptions.find(opt => opt.value === currentDepth);

    return (
        <TooltipProvider>
            <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-3">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between gap-4">
                        {/* Left Section - Navigation */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 border border-border/60 rounded-lg p-1 bg-background/80">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onNavigateToRoot}
                                            disabled={isAtRoot}
                                            className="h-8 px-3 text-xs font-medium disabled:opacity-40"
                                        >
                                            <Home className="h-3.5 w-3.5 mr-1.5" />
                                            Inicio
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Ir a tu nodo raíz</p>
                                    </TooltipContent>
                                </Tooltip>

                                <div className="w-px h-5 bg-border/40" />

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onNavigateToParent}
                                            disabled={!canGoUp}
                                            className="h-8 px-3 text-xs font-medium disabled:opacity-40"
                                        >
                                            <ArrowUp className="h-3.5 w-3.5 mr-1.5" />
                                            Subir
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Navegar al nodo padre</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Center Section - Search and Refresh */}
                        <div className="flex items-center gap-2">
                            {/* Search Button */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <TeamSearchModal onNavigateToUser={onNavigateToUser}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-3 text-xs font-medium border-border/60 hover:border-primary/40"
                                        >
                                            <Search className="h-3.5 w-3.5 mr-1.5" />
                                            Buscar
                                        </Button>
                                    </TeamSearchModal>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Buscar miembros del equipo</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Refresh Button */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onRefresh}
                                        className="h-8 w-8 p-0 border-border/60"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Actualizar árbol</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Right Section - Depth Controls */}
                        <div className="flex items-center gap-2">
                            {/* Quick Zoom */}
                            <div className="flex items-center gap-1 border border-border/60 rounded-lg p-1 bg-background/80">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onChangeDepth(Math.max(1, currentDepth - 1))}
                                    disabled={currentDepth <= 1}
                                    className="h-7 w-7 p-0 disabled:opacity-40"
                                >
                                    <ZoomOut className="h-3.5 w-3.5" />
                                </Button>

                                <div className="px-2 text-xs font-medium min-w-[24px] text-center">
                                    {currentDepth}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onChangeDepth(Math.min(5, currentDepth + 1))}
                                    disabled={currentDepth >= 5}
                                    className="h-7 w-7 p-0 disabled:opacity-40"
                                >
                                    <ZoomIn className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            {/* Depth Selector */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 flex-1 justify-between border-border/60 hover:border-primary/40"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="h-3.5 w-3.5" />
                                            <span className="text-xs font-medium">
                                                {currentDepthOption?.shortLabel || currentDepthOption?.label}
                                            </span>
                                        </div>
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                        Profundidad
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {depthOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => onChangeDepth(option.value)}
                                            className="flex items-center justify-between text-xs"
                                        >
                                            <span className={`font-medium ${currentDepth === option.value ? 'text-primary' : ''}`}>
                                                {option.label}
                                            </span>
                                            {currentDepth === option.value && (
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Status Badge */}
                            <div className="flex items-center gap-1">
                                {isAtRoot && (
                                    <Badge variant="secondary" className="h-6 px-2 text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                        <Navigation className="h-3 w-3 mr-1" />
                                        Raíz
                                    </Badge>
                                )}

                                {!canGoUp && !isAtRoot && (
                                    <Badge variant="outline" className="h-6 px-2 text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Top
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                        {/* Top Row - Navigation and Search */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onNavigateToRoot}
                                    disabled={isAtRoot}
                                    className="h-8 w-8 p-0 disabled:opacity-40"
                                >
                                    <Home className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onNavigateToParent}
                                    disabled={!canGoUp}
                                    className="h-8 w-8 p-0 disabled:opacity-40"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-1">
                                {/* Search Button */}
                                <TeamSearchModal onNavigateToUser={onNavigateToUser}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-xs font-medium"
                                    >
                                        <Search className="h-3.5 w-3.5 mr-1.5" />
                                        Buscar
                                    </Button>
                                </TeamSearchModal>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onRefresh}
                                    className="h-8 w-8 p-0"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-1">
                                {isAtRoot && (
                                    <Badge variant="secondary" className="h-6 px-2 text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                        <Navigation className="h-3 w-3 mr-1" />
                                        Raíz
                                    </Badge>
                                )}

                                {!canGoUp && !isAtRoot && (
                                    <Badge variant="outline" className="h-6 px-2 text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Top
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Bottom Row - Depth Controls */}
                        <div className="flex items-center justify-between gap-2">
                            {/* Quick Zoom */}
                            <div className="flex items-center gap-1 border border-border/60 rounded-lg p-1 bg-background/80">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onChangeDepth(Math.max(1, currentDepth - 1))}
                                    disabled={currentDepth <= 1}
                                    className="h-7 w-7 p-0 disabled:opacity-40"
                                >
                                    <ZoomOut className="h-3.5 w-3.5" />
                                </Button>

                                <div className="px-2 text-xs font-medium min-w-[24px] text-center">
                                    {currentDepth}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onChangeDepth(Math.min(5, currentDepth + 1))}
                                    disabled={currentDepth >= 5}
                                    className="h-7 w-7 p-0 disabled:opacity-40"
                                >
                                    <ZoomIn className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            {/* Depth Selector (Compact) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 flex-1 justify-between border-border/60 hover:border-primary/40"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="h-3.5 w-3.5" />
                                            <span className="text-xs font-medium">
                                                {currentDepthOption?.shortLabel || currentDepthOption?.label}
                                            </span>
                                        </div>
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                        Profundidad
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {depthOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => onChangeDepth(option.value)}
                                            className="flex items-center justify-between text-xs"
                                        >
                                            <span className={`font-medium ${currentDepth === option.value ? 'text-primary' : ''}`}>
                                                {option.label}
                                            </span>
                                            {currentDepth === option.value && (
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}