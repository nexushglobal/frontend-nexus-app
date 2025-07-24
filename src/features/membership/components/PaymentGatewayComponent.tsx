// src/features/membership/components/PaymentGatewayComponent.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerService } from "@/features/shared/services/culqiApis";
import { type CardData, type CustomerResponse } from "@/features/shared/types/culqi.types";
import { AlertCircle, CreditCard, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CardList } from "./card/CardList";
import { CustomerInfoCard } from "./card/CustomerInfoCard";
import { CardModal } from "./modal/CardModal";
import { CustomerModal } from "./modal/CustomerModal";
import { DeleteCardModal } from "./modal/DeleteCardModal";


interface PaymentGatewayComponentProps {
  onCardSelect: (cardId: string) => void;
  selectedCardId?: string;
}

export function PaymentGatewayComponent({
  onCardSelect,
  selectedCardId
}: PaymentGatewayComponentProps) {
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState<CustomerResponse | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState<'create' | 'edit'>('create');
  const [cardModalMode, setCardModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  // Cargar datos del usuario con Culqi
  const fetchUserCulqi = async () => {
    try {
      setLoading(true);
      const response = await CustomerService.getUserCulqi();
      setCustomerData(response);

      // Si ya tiene tarjetas, seleccionar la primera por defecto
      if (response.culqiData?.cards && response.culqiData.cards.length > 0 && !selectedCardId) {
        onCardSelect(response.culqiData.cards[0].source_id);
      }
    } catch (error) {
      toast.error("Error al cargar la información del cliente");
      console.error("Error fetching user culqi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCulqi();
  }, []);

  // Manejar selección de tarjeta
  const handleCardSelect = (cardId: string) => {
    onCardSelect(cardId);
  };

  // Manejar apertura de modal de cliente
  const handleOpenCustomerModal = (mode: 'create' | 'edit') => {
    setCustomerModalMode(mode);
    setShowCustomerModal(true);
  };

  // Manejar apertura de modal de tarjeta
  const handleOpenCardModal = (mode: 'create' | 'edit', card?: CardData) => {
    setCardModalMode(mode);
    setSelectedCard(card || null);
    setShowCardModal(true);
  };

  // Manejar apertura de modal de eliminación
  const handleOpenDeleteModal = (card: CardData) => {
    setSelectedCard(card);
    setShowDeleteCardModal(true);
  };

  // Manejar éxito en cualquier operación
  const handleSuccess = () => {
    fetchUserCulqi();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Cargando información de pago...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no hay datos del cliente
  if (!customerData) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive">
              Error al cargar la información del cliente
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUserCulqi}
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si el usuario no tiene un customer creado
  if (customerData.defaultData && !customerData.culqiData) {
    return (
      <div className="space-y-4">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-yellow-600" />
              Configuración Inicial Requerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para procesar pagos con tarjeta, necesitas completar tu información de cliente.
            </p>
            <Button
              onClick={() => handleOpenCustomerModal('create')}
              className="w-full"
            >
              <User className="mr-2 h-4 w-4" />
              Registrar Información
            </Button>
          </CardContent>
        </Card>

        {/* Modal de cliente */}
        <CustomerModal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onSuccess={handleSuccess}
          defaultData={customerData.defaultData}
          mode="create"
        />
      </div>
    );
  }

  // Si el usuario ya tiene un customer creado
  if (customerData.culqiData && customerData.culqiCustomerId) {
    return (
      <div className="space-y-4">
        {/* Información del cliente */}
        <CustomerInfoCard
          culqiData={customerData.culqiData}
          onEdit={() => handleOpenCustomerModal('edit')}
        />

        {/* Lista de tarjetas */}
        <CardList
          cards={customerData.culqiData.cards || []}
          selectedCardId={selectedCardId || null}
          onSelectCard={handleCardSelect}
          onAddCard={() => handleOpenCardModal('create')}
          onEditCard={(card) => handleOpenCardModal('edit', card)}
          onDeleteCard={handleOpenDeleteModal}
        />

        {/* Modales */}
        <CustomerModal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onSuccess={handleSuccess}
          culqiData={customerData.culqiData}
          culqiCustomerId={customerData.culqiCustomerId}
          mode="edit"
        />

        <CardModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          onSuccess={handleSuccess}
          card={selectedCard || undefined}
          email={customerData.culqiData.email}
          mode={cardModalMode}
        />

        {selectedCard && (
          <DeleteCardModal
            isOpen={showDeleteCardModal}
            onClose={() => setShowDeleteCardModal(false)}
            onSuccess={handleSuccess}
            card={selectedCard}
          />
        )}
      </div>
    );
  }

  // Estado por defecto si no hay datos
  return (
    <Card className="border-muted">
      <CardContent className="flex items-center justify-center py-8">
        <div className="text-center">
          <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No se encontró información de pago
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUserCulqi}
            className="mt-2"
          >
            Recargar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
