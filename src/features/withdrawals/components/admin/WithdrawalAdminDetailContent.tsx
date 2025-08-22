'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { withdrawalDetailMenuSections } from '../../utils/withdrawal-menu.utils';
import { WithdrawalDetail } from '../../types/withdrawals.types';
import { WithdrawalOverviewSection } from '../detail/sections/WithdrawalOverviewSection';
import { WithdrawalUserInfoSection } from '../detail/sections/WithdrawalUserInfoSection';
import { WithdrawalPointsBreakdownSection } from '../detail/sections/WithdrawalPointsBreakdownSection';
import { WithdrawalPaymentHistorySection } from '../detail/sections/WithdrawalPaymentHistorySection';
import { WithdrawalTimelineSection } from '../detail/sections/WithdrawalTimelineSection';
import { WithdrawalMetadataSection } from '../detail/sections/WithdrawalMetadataSection';
import { WithdrawalAdminActions } from './WithdrawalAdminActions';

interface WithdrawalAdminDetailContentProps {
  withdrawal: WithdrawalDetail;
  withdrawalId: string;
}

export function WithdrawalAdminDetailContent({
  withdrawal,
  withdrawalId,
}: WithdrawalAdminDetailContentProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleWithdrawalUpdate = () => {
    // Refresh the page to get updated data
    router.refresh();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <WithdrawalOverviewSection withdrawal={withdrawal} />;
      case 'user-info':
        return <WithdrawalUserInfoSection withdrawal={withdrawal} />;
      case 'points-breakdown':
        return <WithdrawalPointsBreakdownSection withdrawal={withdrawal} />;
      case 'payment-history':
        return <WithdrawalPaymentHistorySection withdrawal={withdrawal} />;
      case 'timeline':
        return <WithdrawalTimelineSection withdrawal={withdrawal} />;
      case 'metadata':
        return <WithdrawalMetadataSection withdrawal={withdrawal} />;
      default:
        return <WithdrawalOverviewSection withdrawal={withdrawal} />;
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Admin Actions - Always visible on mobile */}
        <WithdrawalAdminActions
          withdrawal={withdrawal}
          onWithdrawalUpdate={handleWithdrawalUpdate}
        />

        {/* Mobile Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Navegación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {withdrawalDetailMenuSections
              .filter((section) =>
                ['overview', 'points-breakdown', 'timeline'].includes(section.id)
              )
              .map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full text-left p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <section.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{section.label}</h4>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
          </CardContent>
        </Card>

        {/* Mobile Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <div className="space-y-6">
          {/* Admin Actions */}
          <WithdrawalAdminActions
            withdrawal={withdrawal}
            onWithdrawalUpdate={handleWithdrawalUpdate}
          />

          {/* Navigation Menu */}
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {withdrawalDetailMenuSections.map((section) => {
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
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
        </div>
      </div>

      {/* Desktop Content */}
      <div className="col-span-9">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}