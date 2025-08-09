'use client';

import { Card, CardContent } from '@/components/ui/card';
import { productDetailMenuSections } from '../../../utils/menu.utils';

interface DesktopSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DesktopSidebar({
  activeSection,
  onSectionChange,
}: DesktopSidebarProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {productDetailMenuSections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-muted/50 ${
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-r-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <section.icon className="h-4 w-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {section.label}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {section.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
