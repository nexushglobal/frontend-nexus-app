'use client';

import { productDetailMenuSections } from '../../../utils/menu.utils';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function MobileNavigation({
  activeSection,
  onSectionChange,
}: MobileNavigationProps) {
  return (
    <div className="grid grid-cols-4 w-full gap-1 bg-muted p-1 rounded-lg">
      {['overview', 'edit', 'images', 'stock'].map((tabId) => {
        const section = productDetailMenuSections.find((s) => s.id === tabId);
        const isActive = activeSection === tabId;

        return (
          <button
            key={tabId}
            onClick={() => onSectionChange(tabId)}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {section?.shortLabel || section?.label}
          </button>
        );
      })}
    </div>
  );
}
