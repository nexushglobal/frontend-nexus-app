"use client";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Lead } from "../../../types/leads.types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, Phone, MessageSquare, Eye, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const defaultColumnVisibility: VisibilityState = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  message: true,
  createdAt: true,
  updatedAt: false,
  actions: true,
};

export const createLeadsColumns = (): ColumnDef<Lead>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Nombre Completo",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("fullName")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-muted-foreground" />
        <span className="font-mono text-sm">
          {row.getValue("email")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-muted-foreground" />
        <span className="font-mono text-sm">
          {row.getValue("phone")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Mensaje",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      
      if (!message) {
        return (
          <span className="text-muted-foreground text-sm">
            Sin mensaje
          </span>
        );
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Ver mensaje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Mensaje del Lead</DialogTitle>
              <DialogDescription>
                Mensaje enviado por {row.getValue("fullName")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">{message}</p>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          <div className="font-medium">
            {format(date, "dd/MM/yyyy", { locale: es })}
          </div>
          <div className="text-muted-foreground">
            {format(date, "HH:mm", { locale: es })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Última Actualización",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return (
        <div className="text-sm">
          <div className="font-medium">
            {format(date, "dd/MM/yyyy", { locale: es })}
          </div>
          <div className="text-muted-foreground">
            {format(date, "HH:mm", { locale: es })}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const lead = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
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
                      {format(new Date(lead.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
                
                {lead.message && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Mensaje
                    </label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm leading-relaxed">{lead.message}</p>
                    </div>
                  </div>
                )}
                
                {lead.metadata && Object.keys(lead.metadata).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Metadatos
                    </label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <pre className="text-xs">{JSON.stringify(lead.metadata, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];