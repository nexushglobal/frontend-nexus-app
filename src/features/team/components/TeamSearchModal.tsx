"use client";

import { ResponsiveModal } from "@/components/common/ResponsiveModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    Mail,
    Navigation,
    Search,
    Users
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { TeamSearchResult } from "../types/team.types";
import { searchTeamMembersAction } from "../actions/search-team-members";
import useDebounce from "@/features/shared/hooks/useDebounce";

interface TeamSearchModalProps {
    children: React.ReactNode;
    onNavigateToUser: (userId: string) => void;
}

const RESULTS_PER_PAGE = 20;

export function TeamSearchModal({ children, onNavigateToUser }: TeamSearchModalProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<TeamSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPending, startTransition] = useTransition();

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const performSearch = useCallback(async (query: string, page: number = 1) => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setHasSearched(false);
            setTotalResults(0);
            setCurrentPage(1);
            return;
        }

        setIsSearching(true);
        if (page === 1) {
            setHasSearched(false);
        }

        try {
            const response = await searchTeamMembersAction({
                search: query.trim(),
                page: page,
                limit: RESULTS_PER_PAGE
            });

            if (response.success && response.data) {
                setResults(response.data.results);
                setTotalResults(response.data.metadata.total);
                setCurrentPage(page);
                setHasSearched(true);
            } else {
                toast.error("Error en la búsqueda", {
                    description: response.message || "No se pudo realizar la búsqueda",
                });
                setResults([]);
                setTotalResults(0);
            }
        } catch (error) {
            toast.error("Error de conexión", {
                description: "No se pudo conectar con el servidor",
            });
            setResults([]);
            setTotalResults(0);
        } finally {
            setIsSearching(false);
            setHasSearched(true);
        }
    }, []);

    // Effect to trigger search when debounced term changes
    useEffect(() => {
        if (open) {
            setCurrentPage(1);
            performSearch(debouncedSearchTerm, 1);
        }
    }, [debouncedSearchTerm, open, performSearch]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalResults / RESULTS_PER_PAGE)) {
            performSearch(debouncedSearchTerm, newPage);
        }
    };

    // Handle user selection
    const handleSelectUser = (user: TeamSearchResult) => {
        startTransition(() => {
            onNavigateToUser(user.id);
            setOpen(false);
            setSearchTerm("");
            setResults([]);
            setHasSearched(false);
            setCurrentPage(1);
            toast.success("Navegando al usuario", {
                description: `Mostrando el árbol de ${user.fullName}`,
            });
        });
    };

    // Reset modal state when closing
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setSearchTerm("");
            setResults([]);
            setHasSearched(false);
            setTotalResults(0);
            setCurrentPage(1);
        }
    };

    // Get user initials for avatar
    const getUserInitials = (fullName: string) => {
        return fullName
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Calculate pagination info
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * RESULTS_PER_PAGE, totalResults);

    // Search content
    const searchContent = (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre, email o código de referido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                    autoFocus
                />
                {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Search Instructions */}
            {!hasSearched && !searchTerm && (
                <div className="text-center py-12 space-y-3">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-medium text-sm">Buscar Miembros del Equipo</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Escribe el nombre, email o código de referido de cualquier miembro de tu red para navegar directamente a su posición en el árbol.
                        </p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isSearching && searchTerm && !hasSearched && (
                <div className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Buscando...</p>
                </div>
            )}

            {/* Results */}
            {hasSearched && !isSearching && (
                <div className="space-y-3">
                    {/* Results Header with Pagination Info */}
                    {results.length > 0 && (
                        <div className="flex items-center justify-between pb-2 border-b">
                            <p className="text-sm font-medium text-muted-foreground">
                                {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                            </p>
                            {totalPages > 1 && (
                                <div className="text-xs text-muted-foreground">
                                    Mostrando {startIndex}-{endIndex} de {totalResults}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Results List */}
                    {results.length > 0 ? (
                        <>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {results.map((user) => (
                                    <Card
                                        key={user.id}
                                        className="cursor-pointer transition-all  duration-200 hover:shadow-md hover:border-primary/40"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <CardContent className=" ">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                                        {getUserInitials(user.fullName)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* User Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium text-sm truncate">
                                                            {user.fullName}
                                                        </h4>
                                                        {user.position && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs h-4 px-1.5"
                                                            >
                                                                {user.position === "LEFT" ? "Izq" : "Der"}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="truncate">{user.email}</span>
                                                    </div>
                                                </div>

                                                {/* Navigation Icon */}
                                                <Navigation className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-3 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1 || isSearching}
                                        className="h-8"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Anterior
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages || isSearching}
                                        className="h-8"
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 space-y-3">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-sm">Sin resultados</h3>
                                <p className="text-xs text-muted-foreground">
                                    No se encontraron miembros que coincidan con "{searchTerm}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // Custom footer for the search modal
    const customFooter = (
        <div className="flex justify-end">
            <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
            >
                Cerrar
            </Button>
        </div>
    );

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Buscar Miembros del Equipo"
            icon={Search}
            maxWidth="sm:max-w-2xl"
            mobileHeight="h-[80vh]"
            desktopHeight="max-h-[80vh]"
            content={searchContent}
            customFooter={customFooter}
            isPending={isPending}
        >
            {children}
        </ResponsiveModal>
    );
}