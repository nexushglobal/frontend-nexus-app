'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, ShoppingCart, Wallet } from 'lucide-react';
import Link from 'next/link';

interface QuickItem {
  href: string;
  title: string;
  description: string;
  icon: any;
}

const items: QuickItem[] = [
  {
    href: '/dashboard/fac-pagos',
    title: 'Pagos',
    description: 'Gestión y revisión de pagos',
    icon: Wallet,
  },
  {
    href: '/dashboard/fac-retiros',
    title: 'Retiros',
    description: 'Solicitudes y estados de retiros',
    icon: FileText,
  },
  {
    href: '/dashboard/fac-pedidos',
    title: 'Pedidos',
    description: 'Historial y gestión de pedidos',
    icon: ShoppingCart,
  },
  {
    href: '/dashboard/fac-reportes',
    title: 'Reportes',
    description: 'Generación y descarga de reportes',
    icon: BarChart3,
  },
];

export function FacQuickAccess() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">
          Accesos rápidos
        </h2>
        <p className="text-sm text-muted-foreground">
          Secciones principales de facturación
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
          >
            <Card className="h-full transition-colors border-border/60 hover:border-primary/50 hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-semibold">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-snug">
                  {description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
