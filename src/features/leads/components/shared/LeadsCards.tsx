'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  User,
  Users,
} from 'lucide-react';
import { Lead } from '../../types/leads.types';

interface LeadsCardsProps {
  data: Lead[];
}

export function LeadsCards({ data }: LeadsCardsProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No hay leads registrados
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Aún no se han registrado leads con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
      <div className="space-y-4">
        {data.map((lead) => (
          <Card
            key={lead.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header con nombre */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {lead.fullName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fecha */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm', {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Mensaje preview */}
                  {lead.message && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        <MessageSquare className="h-3 w-3" />
                        <span>Mensaje</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {lead.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalle Completo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Detalles del Lead</DialogTitle>
                      <DialogDescription>
                        Información completa del lead #{lead.id}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Nombre Completo
                          </label>
                          <p className="text-sm">{lead.fullName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Email
                          </label>
                          <p className="text-sm font-mono">{lead.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Teléfono
                          </label>
                          <p className="text-sm font-mono">{lead.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Fecha de Registro
                          </label>
                          <p className="text-sm">
                            {format(
                              new Date(lead.createdAt),
                              'dd/MM/yyyy HH:mm',
                              { locale: es },
                            )}
                          </p>
                        </div>
                      </div>

                      {lead.message && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Mensaje
                          </label>
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <p className="text-sm leading-relaxed">
                              {lead.message}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
}
