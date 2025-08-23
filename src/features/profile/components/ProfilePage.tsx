'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  FileText,
  Landmark,
  Phone,
  Receipt,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { PROFILE_SECTIONS } from '../constants/profile.constants';
import { useProfile } from '../hooks/useProfile';
import { OverviewSection } from './OverviewSection';
import { ProfileHeader } from './ProfileHeader';
import { ProfilePageSkeleton } from './ProfilePageSkeleton';
import { BankInfoCard } from './cards/BankInfoCard';
import { BillingInfoCard } from './cards/BillingInfoCard';
import { ContactInfoCard } from './cards/ContactInfoCard';
import { PersonalInfoCard } from './cards/PersonalInfoCard';
import { ReferralCodesCard } from './cards/ReferralCodesCard';
import { SecurityCard } from './cards/SecurityCard';

export const ProfilePage = () => {
  const { profile, loading, error, refetch, isUpdating } = useProfile();
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

  const getIncompleteSections = () => {
    if (!profile) return [];

    const incompleteSections = [];

    const personalIncomplete = [
      !profile.nickname && 'nickname',
      !profile.personalInfo?.documentType && 'documento',
      !profile.personalInfo?.documentNumber && 'número de documento',
    ].filter(Boolean);

    if (personalIncomplete.length > 0) {
      incompleteSections.push({
        id: 'personal',
        label: 'Información Personal',
        description: `Falta: ${personalIncomplete.join(', ')}`,
        icon: FileText,
      });
    }

    const contactIncomplete = [
      !profile.contactInfo?.phone && 'teléfono',
      !profile.contactInfo?.address && 'dirección',
      !profile.contactInfo?.postalCode && 'código postal',
    ].filter(Boolean);

    if (contactIncomplete.length > 0) {
      incompleteSections.push({
        id: 'contact',
        label: 'Información de Contacto',
        description: `Falta: ${contactIncomplete.join(', ')}`,
        icon: Phone,
      });
    }

    const billingIncomplete = [
      !profile.billingInfo?.ruc && 'RUC',
      !profile.billingInfo?.razonSocial && 'razón social',
      !profile.billingInfo?.address && 'dirección fiscal',
    ].filter(Boolean);

    if (billingIncomplete.length > 0) {
      incompleteSections.push({
        id: 'billing',
        label: 'Información de Facturación',
        description: `Falta: ${billingIncomplete.join(', ')}`,
        icon: Receipt,
      });
    }

    const bankingIncomplete = [
      !profile.bankInfo?.bankName && 'banco',
      !profile.bankInfo?.accountNumber && 'número de cuenta',
      !profile.bankInfo?.cci && 'CCI',
    ].filter(Boolean);

    if (bankingIncomplete.length > 0) {
      incompleteSections.push({
        id: 'banking',
        label: 'Información Bancaria',
        description: `Falta: ${bankingIncomplete.join(', ')}`,
        icon: Landmark,
      });
    }

    return incompleteSections;
  };

  const incompleteSections = getIncompleteSections();

  const renderSection = () => {
    if (!profile) return null;

    switch (activeSection) {
      case 'overview':
        return <OverviewSection profile={profile} />;
      case 'personal':
        return (
          <PersonalInfoCard
            profile={profile}
            onUpdate={refetch}
            isUpdating={isUpdating}
          />
        );
      case 'contact':
        return (
          <ContactInfoCard
            contactInfo={profile.contactInfo}
            onUpdate={refetch}
            isUpdating={isUpdating}
          />
        );
      case 'billing':
        return (
          <BillingInfoCard
            billingInfo={profile.billingInfo}
            onUpdate={refetch}
            isUpdating={isUpdating}
          />
        );
      case 'banking':
        return (
          <BankInfoCard
            bankInfo={profile.bankInfo}
            onUpdate={refetch}
            isUpdating={isUpdating}
          />
        );
      case 'referrals':
        return <ReferralCodesCard referralCode={profile.referralCode} />;
      case 'security':
        return <SecurityCard onUpdate={refetch} isUpdating={isUpdating} />;
      default:
        return <OverviewSection profile={profile} />;
    }
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            {error || 'No se pudo cargar el perfil'}
          </p>
          <Button onClick={refetch} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="container mx-auto  space-y-6">
        <ProfileHeader
          profile={profile}
          onUpdate={refetch}
          isUpdating={isUpdating}
        />

        {incompleteSections.length > 0 && (
          <Alert className="border-warning/20 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                  {incompleteSections.length} sección
                  {incompleteSections.length > 1 ? 'es' : ''} por completar
                </p>
                <div className="space-y-1">
                  {incompleteSections.slice(0, 2).map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {section.label}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(section.id)}
                        className="h-6 text-xs"
                      >
                        Completar
                      </Button>
                    </div>
                  ))}
                  {incompleteSections.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{incompleteSections.length - 2} más...
                    </p>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Tabs principales */}
          <div className="grid grid-cols-4 w-full gap-1 bg-muted p-1 rounded-lg">
            {['overview', 'personal', 'contact', 'more'].map((tabId) => {
              const isActive =
                activeSection === tabId ||
                (tabId === 'more' &&
                  !['overview', 'personal', 'contact'].includes(activeSection));

              return (
                <button
                  key={tabId}
                  onClick={() => setActiveSection(tabId)}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tabId === 'overview' && 'Resumen'}
                  {tabId === 'personal' && 'Personal'}
                  {tabId === 'contact' && 'Contacto'}
                  {tabId === 'more' && 'Más'}
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'more' ? (
              <div className="grid grid-cols-2 gap-2">
                {PROFILE_SECTIONS.slice(3).map((section) => (
                  <Button
                    key={section.id}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="text-xs">{section.label}</span>
                  </Button>
                ))}
              </div>
            ) : (
              renderSection()
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto  space-y-6">
      <ProfileHeader
        profile={profile}
        onUpdate={refetch}
        isUpdating={isUpdating}
      />

      {incompleteSections.length > 0 && (
        <Alert className="border-warning/20 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">
                  Información incompleta ({incompleteSections.length} sección
                  {incompleteSections.length > 1 ? 'es' : ''})
                </p>
                <p className="text-sm text-muted-foreground">
                  Completa estas secciones para tener un perfil más robusto
                </p>
              </div>
              <div className="flex items-center gap-2">
                {incompleteSections.slice(0, 3).map((section, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                    className="flex items-center gap-1"
                  >
                    <section.icon className="h-3 w-3" />
                    {section.label}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                ))}
                {incompleteSections.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{incompleteSections.length - 3} más
                  </span>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Configuración del Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {PROFILE_SECTIONS.map((section) => {
                  const isActive = activeSection === section.id;
                  const isIncomplete = incompleteSections.some(
                    (incomplete) => incomplete.id === section.id,
                  );

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-muted/50 relative ${
                        isActive
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <section.icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {section.label}
                          {isIncomplete && (
                            <AlertTriangle className="h-3 w-3 text-warning" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {section.description}
                        </div>
                      </div>
                      {isActive && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-8 xl:col-span-9">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
