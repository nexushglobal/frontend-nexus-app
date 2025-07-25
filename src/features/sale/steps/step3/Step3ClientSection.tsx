'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  User,
  UserCheck,
} from 'lucide-react';

import { useProfile } from '@/features/profile/hooks/useProfile';
import { useClientGuarantor } from '../../hooks/useClientGuarantor';
import {
  CreateSaleFormData,
  Step3FormData,
  step3Schema,
} from '../../validations/saleValidation';
import ClientConfiguration from './ClientConfiguration';

interface Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step3', isValid: boolean) => void;
}

export default function Step3ClientSection({
  formData,
  updateFormData,
  updateStepValidation,
}: Props) {
  const [isGeneratingClient, setIsGeneratingClient] = useState(false);

  const { profile } = useProfile();

  const {
    createdLead,
    isLeadCreated,
    clientAddress,
    loading,
    handleCreateLead,
    handleAddressChange,
    handleGuarantorClientSuccess,
    getClientId,
  } = useClientGuarantor();

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      clientId: formData.clientId || 0,
      guarantorId: formData.guarantorId || 0,
      secondaryClientIds: formData.secondaryClientIds,
      leadId: '',
      clientAddress: '',
    },
  });

  useEffect(() => {
    form.setValue('clientId', getClientId());
    form.setValue('clientAddress', clientAddress);
  }, [form, getClientId, clientAddress]);

  const validateStep = useCallback(() => {
    const clientId = getClientId();
    const basicValidation = !!(
      isLeadCreated &&
      clientId > 0 &&
      clientAddress.trim()
    );

    return { isValid: basicValidation, clientId };
  }, [isLeadCreated, getClientId, clientAddress]);

  useEffect(() => {
    const { isValid, clientId } = validateStep();

    if (formData.clientId !== clientId) {
      updateFormData({ clientId });
    }

    updateStepValidation('step3', isValid);
  }, [validateStep]);

  const handleGenerateClient = async () => {
    if (!profile?.personalInfo || !profile?.email) {
      return;
    }

    setIsGeneratingClient(true);
    try {
      const clientData = {
        firstName: profile.personalInfo.firstName,
        lastName: profile.personalInfo.lastName,
        document: profile.personalInfo.documentNumber,
        documentType: profile.personalInfo.documentType,
        email: profile.email,
      };
      await handleCreateLead(clientData);
    } catch (error) {
      console.error('Error generating client:', error);
    } finally {
      setIsGeneratingClient(false);
    }
  };

  const validationStatus = {
    leadCreated: isLeadCreated,
    hasAddress: !!clientAddress.trim(),
  };

  const profileComplete = !!(
    profile?.personalInfo?.firstName &&
    profile?.personalInfo?.lastName &&
    profile?.personalInfo?.documentNumber &&
    profile?.personalInfo?.documentType &&
    profile?.email
  );

  const handleAction = async () => await handleGuarantorClientSuccess();

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cliente Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!profileComplete ? (
                  <div className="text-center space-y-3">
                    <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                        Tu perfil está incompleto
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-300">
                        Completa tu información personal para continuar
                      </p>
                    </div>
                  </div>
                ) : !isLeadCreated ? (
                  <div className="space-y-4">
                    {/* Mostrar información del perfil */}
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                          <UserCheck className="h-4 w-4" />
                          Información del Cliente
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-gray-500" />
                            <span>
                              {profile.personalInfo?.firstName}{' '}
                              {profile.personalInfo?.lastName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-gray-500" />
                            <span>
                              {profile.personalInfo?.documentType}:{' '}
                              {profile.personalInfo?.documentNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-500" />
                            <span>{profile.email}</span>
                          </div>

                          {profile.contactInfo?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <span>{profile.contactInfo.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleGenerateClient}
                      disabled={isGeneratingClient || loading.lead}
                      className="w-full"
                    >
                      {isGeneratingClient || loading.lead ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generando Cliente...
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Generar Cliente
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Badge variant="default" className="bg-green-500">
                        Cliente Generado
                      </Badge>
                    </div>

                    {/* Información del cliente generado */}
                    <div className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-green-600" />
                          <span className="font-medium">
                            {createdLead?.firstName} {createdLead?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-green-600" />
                          <span>
                            {createdLead?.documentType}: {createdLead?.document}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-green-600" />
                          <span>{createdLead?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Validation Status */}
            {isLeadCreated && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Estado de Validación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Cliente generado correctamente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {validationStatus.hasAddress ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      <span>Dirección del cliente</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {isLeadCreated && (
              <ClientConfiguration
                control={form.control}
                errors={form.formState.errors}
                isLoadingClient={loading.client}
                onAddressChange={handleAddressChange}
              />
            )}
            {clientAddress.trim() && (
              <Button className="w-full" onClick={handleAction}>
                Generar cliente
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
