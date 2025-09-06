'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Plus,
  Trash2,
  User,
  UserCheck,
  UserPlus,
} from 'lucide-react';

import AddGuarantorModal from '../../components/modals/AddGuarantorModal';
import AddSecondaryClientModal from '../../components/modals/AddSecondaryClientModal';
import { CreateLeadModal } from '../../components/modals/CreateLeadModal';
import ClientConfiguration from './ClientConfiguration';
import GuarantorSection from './GuarantorSection';
import LeadInfoCard from './LeadInfoCard';
import SecondaryClientSection from './SecondaryClientSection';

import { useClientGuarantor } from '../../hooks/useClientGuarantor';
import {
  CreateSaleFormData,
  GuarantorFormData,
  SecondaryClientFormData,
  Step3FormData,
  step3Schema,
} from '../../validations/saleValidation';

interface Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step3', isValid: boolean) => void;
}

export default function Step3ClientGuarantor({
  formData,
  updateFormData,
  updateStepValidation,
}: Props) {
  const [secondaryClientsFormData, setSecondaryClientsFormData] = useState<
    SecondaryClientFormData[]
  >([]);
  const [guarantorFormData, setGuarantorFormData] =
    useState<GuarantorFormData>();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [modal, setModal] = useState<{
    createLeadModal: boolean;
    guarantorModal: boolean;
    compradorModal: boolean;
  }>({
    createLeadModal: false,
    guarantorModal: false,
    compradorModal: false,
  });

  const [switchEnable, setSwitchEnable] = useState<{
    guarantorEnable: boolean;
    compradorEnable: boolean;
  }>({
    guarantorEnable: false,
    compradorEnable: false,
  });

  const {
    createdLead,
    isLeadCreated,

    guarantorData,
    secondaryClientsData,
    clientAddress,

    loading,

    handleCreateLead,
    handleAddressChange,
    handleGuarantorClientSuccess,

    getClientId,
    getGuarantorId,
    getSecondaryClientsId,
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
    form.setValue('guarantorId', getGuarantorId());
    form.setValue('secondaryClientIds', getSecondaryClientsId());
    form.setValue('clientAddress', clientAddress);
  }, [form, getClientId, getGuarantorId, getSecondaryClientsId, clientAddress]);

  useEffect(() => {
    const clientId = getClientId();
    const guarantorId = getGuarantorId();
    const secondaryClientIds = getSecondaryClientsId();

    const basicValidation = !!(
      isLeadCreated &&
      clientId > 0 &&
      clientAddress.trim()
    );

    const compradorBlocking =
      switchEnable.compradorEnable &&
      (!secondaryClientIds || secondaryClientIds.length === 0);

    const guarantorBlocking =
      switchEnable.guarantorEnable && (!guarantorId || guarantorId === 0);

    const switchesBlocking = compradorBlocking || guarantorBlocking;

    const isValid = basicValidation && !switchesBlocking;

    updateStepValidation('step3', isValid);

    updateFormData({
      clientId,
      guarantorId,
      secondaryClientIds,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLeadCreated,
    clientAddress,
    switchEnable.compradorEnable,
    switchEnable.guarantorEnable,
    guarantorData,
    secondaryClientsData,
  ]);

  const handleAddSecondaryClient = (data: SecondaryClientFormData) => {
    if (editingIndex !== null) {
      setSecondaryClientsFormData((prev) =>
        prev.map((client, index) => (index === editingIndex ? data : client)),
      );
      setEditingIndex(null);
    } else setSecondaryClientsFormData((prev) => [...prev, data]);
    setModal({ ...modal, compradorModal: false });
  };

  const handleEditSecondaryClient = (index: number) => {
    setEditingIndex(index);
    setModal({ ...modal, compradorModal: true });
  };

  const handleEditGuarantor = () =>
    setModal({ ...modal, guarantorModal: true });

  const handleDeleteSecondaryClient = (index: number) =>
    setSecondaryClientsFormData((prev) => prev.filter((_, i) => i !== index));

  const handleDeleteGuarantor = () => setGuarantorFormData(undefined);

  const handleAddGuarantor = (data: GuarantorFormData) => {
    setGuarantorFormData(data);
    setModal({ ...modal, guarantorModal: false });
  };

  const handleCloseModal = () => {
    setModal({
      createLeadModal: false,
      guarantorModal: false,
      compradorModal: false,
    });
    setEditingIndex(null);
  };

  const getEditingData = () => {
    return editingIndex !== null
      ? secondaryClientsFormData[editingIndex]
      : undefined;
  };

  const handleAction = async () => {
    if (!isLeadCreated) {
      setModal({ ...modal, createLeadModal: true });
      return;
    }

    if (guarantorFormData || secondaryClientsFormData.length > 0) {
      await handleGuarantorClientSuccess(
        secondaryClientsFormData,
        guarantorFormData,
      );
    }
    await handleGuarantorClientSuccess(
      secondaryClientsFormData,
      guarantorFormData,
    );
  };

  const validationStatus = {
    leadCreated: isLeadCreated,
    hasAddress: !!clientAddress.trim(),
    guarantorBlocking: switchEnable.guarantorEnable && !guarantorData,
    compradorBlocking:
      switchEnable.compradorEnable && secondaryClientsData.length === 0,
  };

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
                {!isLeadCreated ? (
                  <div className="text-center space-y-3">
                    <div className="p-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        Primero debes crear el lead del cliente principal
                      </p>
                      <Button
                        type="button"
                        onClick={() =>
                          setModal({ ...modal, createLeadModal: true })
                        }
                        className="mt-3"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Lead
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Badge variant="default" className="bg-green-500">
                        Lead Creado
                      </Badge>
                    </div>
                    <LeadInfoCard lead={createdLead!} />
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
                      <span>Lead creado correctamente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {validationStatus.hasAddress ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      <span>Dirección del cliente</span>
                    </div>
                    {switchEnable.guarantorEnable && (
                      <div className="flex items-center gap-2">
                        {guarantorData ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                        <span>Garante requerido</span>
                      </div>
                    )}
                    {switchEnable.compradorEnable && (
                      <div className="flex items-center gap-2">
                        {secondaryClientsData.length > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                        <span>Compradores adicionales</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {isLeadCreated && (
              <>
                <ClientConfiguration
                  control={form.control}
                  errors={form.formState.errors}
                  isLoadingClient={loading.client}
                  onAddressChange={handleAddressChange}
                />

                <SecondaryClientSection
                  secondaryClientsData={secondaryClientsData}
                  disabled={!clientAddress.trim()}
                  isCreating={loading.creating}
                  guarantorEnable={switchEnable.guarantorEnable}
                  compradorEnable={switchEnable.compradorEnable}
                  compradorSwitch={setSwitchEnable}
                />

                <GuarantorSection
                  guarantorData={guarantorData}
                  disabled={!clientAddress.trim()}
                  isCreating={loading.creating}
                  guarantorEnable={switchEnable.guarantorEnable}
                  compradorEnable={switchEnable.compradorEnable}
                  guarantorSwitch={setSwitchEnable}
                />

                {/* Secondary Clients Table */}
                {switchEnable.compradorEnable &&
                  secondaryClientsFormData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Compradores Adicionales (
                          {secondaryClientsFormData.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Documento</TableHead>
                              <TableHead>Teléfono</TableHead>
                              <TableHead className="w-[100px]">
                                Acciones
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {secondaryClientsFormData.map((client, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {client.firstName} {client.lastName}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {client.documentType}
                                    </Badge>
                                    <span className="text-sm">
                                      {client.document}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleEditSecondaryClient(index)
                                      }
                                      className="h-7 w-7 p-0"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteSecondaryClient(index)
                                      }
                                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}

                {/* Guarantor Info */}
                {switchEnable.guarantorEnable && guarantorFormData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Garante Asignado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {guarantorFormData.firstName}{' '}
                            {guarantorFormData.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {guarantorFormData.documentType}
                            </Badge>
                            <span>{guarantorFormData.document}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {guarantorFormData.phone} •{' '}
                            {guarantorFormData.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEditGuarantor}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteGuarantor}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Add Buttons Section */}
                {clientAddress.trim() && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Add Secondary Client Button */}
                        <div
                          className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                            switchEnable.compradorEnable
                              ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                              : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20'
                          }`}
                        >
                          <div className="text-center space-y-2">
                            <Button
                              type="button"
                              onClick={() =>
                                setModal({ ...modal, compradorModal: true })
                              }
                              variant={
                                switchEnable.compradorEnable
                                  ? 'default'
                                  : 'ghost'
                              }
                              size="sm"
                              disabled={
                                !switchEnable.compradorEnable ||
                                loading.creating
                              }
                              className="flex items-center gap-2"
                            >
                              <UserPlus className="h-4 w-4" />
                              {secondaryClientsFormData.length > 0
                                ? 'Agregar Otro'
                                : 'Agregar Comprador'}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              {switchEnable.compradorEnable
                                ? `${secondaryClientsFormData.length} comprador(es) agregado(s)`
                                : 'Activa el switch para habilitar'}
                            </p>
                          </div>
                        </div>

                        {/* Add Guarantor Button */}
                        <div
                          className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                            switchEnable.guarantorEnable
                              ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20'
                              : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20'
                          }`}
                        >
                          <div className="text-center space-y-2">
                            <Button
                              type="button"
                              onClick={() =>
                                setModal({ ...modal, guarantorModal: true })
                              }
                              variant={
                                switchEnable.guarantorEnable
                                  ? 'default'
                                  : 'ghost'
                              }
                              size="sm"
                              disabled={
                                !switchEnable.guarantorEnable ||
                                loading.creating
                              }
                              className="flex items-center gap-2"
                            >
                              <UserCheck className="h-4 w-4" />
                              {guarantorFormData
                                ? 'Editar Garante'
                                : 'Agregar Garante'}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              {switchEnable.guarantorEnable
                                ? guarantorFormData
                                  ? 'Garante configurado'
                                  : 'Sin garante'
                                : 'Activa el switch para habilitar'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleAction}
                    disabled={
                      !clientAddress.trim() ||
                      // (!guarantorFormData &&
                      //   secondaryClientsFormData.length === 0) ||
                      loading.creating
                    }
                    variant="default"
                    className="w-full"
                  >
                    {loading.creating
                      ? 'Procesando...'
                      : 'Guardar Configuración'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Form>

      {/* Modals */}
      <CreateLeadModal
        isOpen={modal.createLeadModal}
        onClose={handleCloseModal}
        onSuccess={handleCreateLead}
        isCreating={loading.lead}
      />

      <AddSecondaryClientModal
        isOpen={modal.compradorModal}
        onClose={handleCloseModal}
        onSuccess={handleAddSecondaryClient}
        isCreating={loading.creating}
        editingData={getEditingData()}
        isEditing={editingIndex !== null}
      />

      <AddGuarantorModal
        isOpen={modal.guarantorModal}
        onClose={handleCloseModal}
        onSuccess={handleAddGuarantor}
        isCreating={loading.creating}
        editingData={guarantorFormData}
        isEditing={!!guarantorFormData}
      />
    </div>
  );
}
