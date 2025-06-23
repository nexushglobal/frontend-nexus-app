"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, Mail, Hash, MapPin, Loader2, ChevronLeft, ChevronRight, X, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { searchTeamMembers, TeamSearchResponse, TeamSearchResult } from "../../actions/teamSearch";

interface TeamSearchModalProps {
    children: React.ReactNode;
    onSelectUser: (userId: string) => void;
}

export function TeamSearchModal({ children, onSelectUser }: TeamSearchModalProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<TeamSearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const performSearch = useCallback(async (term: string, page: number = 1) => {
        if (!term.trim()) {
            setResults(null);
            return;
        }

        setLoading(true);
        try {
            const response = await searchTeamMembers({
                search: term,
                page,
                limit: 20,
            });

            if (response.success && response.data) {
                setResults(response.data);
                setCurrentPage(page);
            } else {
                toast.error("Error en la búsqueda", {
                    description: response.message,
                });
                setResults(null);
            }
        } catch (error) {
            toast.error("Error de conexión", {
                description: "No se pudo realizar la búsqueda",
            });
            setResults(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length >= 2) {
                performSearch(searchTerm, 1);
            } else {
                setResults(null);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, performSearch]);

    const handleUserSelect = (user: TeamSearchResult) => {
        onSelectUser(user.id);
        setOpen(false);
        setSearchTerm("");
        setResults(null);
        toast.success("Navegando al usuario", {
            description: `Mostrando el árbol de ${user.fullName}`,
        });
    };

    const handlePageChange = (newPage: number) => {
        if (searchTerm.trim()) {
            performSearch(searchTerm, newPage);
        }
    };

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const handleClose = () => {
        setOpen(false);
        setSearchTerm("");
        setResults(null);
        setCurrentPage(1);
    };

    const totalPages = results ? Math.ceil(results.metadata.total / results.metadata.limit) : 0;

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                handleClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>

            {/* Modal Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] mx-4 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-2">
                                <UserSearch className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Buscar Miembro del Equipo</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden flex flex-col gap-4 p-6">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre, email o documento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-10"
                                    autoFocus
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Search Info */}
                            {searchTerm.length > 0 && searchTerm.length < 2 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Ingresa al menos 2 caracteres para buscar</p>
                                </div>
                            )}

                            {/* Loading State */}
                            {loading && (
                                <div className="text-center py-8">
                                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Buscando...</p>
                                </div>
                            )}

                            {/* Results */}
                            {!loading && results && (
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    {/* Results Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm text-muted-foreground">
                                            {results.metadata.total > 0 ? (
                                                <span>
                                                    Mostrando {results.results.length} de {results.metadata.total} resultados
                                                    {results.metadata.searchTerm && (
                                                        <span> para "<strong>{results.metadata.searchTerm}</strong>"</span>
                                                    )}
                                                </span>
                                            ) : (
                                                <span>No se encontraron resultados</span>
                                            )}
                                        </div>

                                        {results.metadata.queryDurationMs && (
                                            <Badge variant="outline" className="text-xs">
                                                {results.metadata.queryDurationMs}ms
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Results List */}
                                    {results.results.length > 0 ? (
                                        <ScrollArea className="flex-1 pr-4">
                                            <div className="space-y-2">
                                                {results.results.map((user, index) => (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                                                        onClick={() => handleUserSelect(user)}
                                                    >
                                                        {/* Avatar */}
                                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                                            <AvatarImage src="" alt={user.fullName} />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                                                {getInitials(user.fullName)}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        {/* User Info */}
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium text-sm truncate">
                                                                    {user.fullName}
                                                                </h4>
                                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                                    <Badge
                                                                        variant={user.isActive ? "default" : "secondary"}
                                                                        className="text-xs"
                                                                    >
                                                                        {user.isActive ? "Activo" : "Inactivo"}
                                                                    </Badge>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`text-xs ${user.position === "LEFT"
                                                                                ? "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                                                                                : "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                                                                            }`}
                                                                    >
                                                                        {user.position === "LEFT" ? "IZQ" : "DER"}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Mail className="h-3 w-3" />
                                                                    <span className="truncate">{user.email}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                                    <Hash className="h-3 w-3" />
                                                                    <span className="font-mono">{user.referralCode}</span>
                                                                </div>
                                                                {user.documentNumber && (
                                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                                        <User className="h-3 w-3" />
                                                                        <span className="font-mono">{user.documentNumber}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Navigate Arrow */}
                                                        <div className="flex-shrink-0">
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MapPin className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <UserSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No se encontraron miembros con ese criterio</p>
                                            <p className="text-xs mt-1">
                                                Intenta con un nombre, email o número de documento diferente
                                            </p>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {results.results.length > 0 && totalPages > 1 && (
                                        <>
                                            <Separator className="my-3" />
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-muted-foreground">
                                                    Página {currentPage} de {totalPages}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage <= 1 || loading}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>

                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                            let pageNum;
                                                            if (totalPages <= 5) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage <= 3) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage >= totalPages - 2) {
                                                                pageNum = totalPages - 4 + i;
                                                            } else {
                                                                pageNum = currentPage - 2 + i;
                                                            }

                                                            return (
                                                                <Button
                                                                    key={pageNum}
                                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => handlePageChange(pageNum)}
                                                                    disabled={loading}
                                                                    className="h-8 w-8 p-0 text-xs"
                                                                >
                                                                    {pageNum}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage >= totalPages || loading}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Empty State for no search */}
                            {!loading && !results && searchTerm.length < 2 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                    <h3 className="font-medium mb-2">Buscar Miembros del Equipo</h3>
                                    <p className="text-sm max-w-sm mx-auto">
                                        Busca cualquier miembro de tu organización por nombre, email o número de documento
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}