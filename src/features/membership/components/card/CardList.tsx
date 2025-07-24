"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type CardData } from "@/features/shared/types/culqi.types";
import { CreditCard, Edit2, Plus, Trash2 } from "lucide-react";

interface CardListProps {
  cards: CardData[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  onAddCard: () => void;
  onEditCard: (card: CardData) => void;
  onDeleteCard: (card: CardData) => void;
}

export function CardList({
  cards,
  selectedCardId,
  onSelectCard,
  onAddCard,
  onEditCard,
  onDeleteCard
}: CardListProps) {
  if (cards.length === 0) {
    return (
      <Card className="border-warning bg-warning/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-warning" />
            Métodos de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            No tienes tarjetas registradas
          </div>
          <Button
            onClick={onAddCard}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Tarjeta
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-success bg-success/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-success" />
            Métodos de Pago ({cards.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddCard}
            className="flex items-center gap-2"
          >
            <Plus className="h-3 w-3" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedCardId || undefined}
          onValueChange={onSelectCard}
          className="space-y-3"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`border rounded-lg p-3 transition-colors ${
                selectedCardId === card.source_id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={card.source_id} id={`card-${card.id}`} />
                  <Label
                    htmlFor={`card-${card.id}`}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">
                          {card.card_brand} •••• {card.last_four}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {card.card_type} • {card.email}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditCard(card)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteCard(card)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
