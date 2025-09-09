'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MembershipPlan,
  UserMembership,
} from '@/features/membership/types/membership-detail.type';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Crown,
  DollarSign,
  Gift,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMembershipPlanDetailAction } from '../actions/get-detail-membership';
import { PaymentSubscriptionSheet } from '../components/PaymentSubscriptionSheet';

interface PlanDetailData {
  plan: MembershipPlan;
  userMembership: UserMembership;
}

export default function MembershipPlanDetailPage() {
  const params = useParams();
  const [planData, setPlanData] = useState<PlanDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        setLoading(true);
        const result = await getMembershipPlanDetailAction(params.id as string);

        if (result.success && result.data) {
          setPlanData(result.data);
        } else {
          setError(result.message || 'Error al cargar el plan');
        }
      } catch (err) {
        setError('Error inesperado al cargar el plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetail();
  }, [params.id]);

  const getActionButtonConfig = () => {
    if (!planData) return null;

    const { plan, userMembership } = planData;

    if (!userMembership.hasMembership) {
      return {
        text: 'Adquirir Membresía',
        variant: 'default' as const,
        icon: CreditCard,
        disabled: false,
        amount: plan.price,
      };
    }

    if (plan.isUpgrade && plan.upgradeCost && plan.upgradeCost > 0) {
      return {
        text: 'Actualizar Plan',
        variant: 'default' as const,
        icon: TrendingUp,
        disabled: false,
        amount: plan.upgradeCost,
      };
    }

    if (plan.warning) {
      return {
        text: 'No Recomendado',
        variant: 'outline' as const,
        icon: AlertTriangle,
        disabled: true,
        amount: 0,
      };
    }

    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !planData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold">Error al cargar el plan</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { plan, userMembership } = planData;
  const actionConfig = getActionButtonConfig();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Plan {plan.name}
          </h1>
          <Badge variant="secondary" className="badge-success">
            Activo
          </Badge>
        </div>

        {userMembership.hasMembership && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Tu membresía actual</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plan {userMembership.plan?.name} •{' '}
              {formatCurrency(userMembership.plan?.price || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              Válida hasta: {userMembership.endDate}
            </p>
            <p>
              {userMembership.message && (
                <span className="text-sm text-muted-foreground">
                  {userMembership.message}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Plan Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Información del Plan</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(plan.price)}
              </div>
              {plan.upgradeCost !== undefined && plan.upgradeCost > 0 && (
                <div className="text-sm text-muted-foreground">
                  Costo de actualización: {formatCurrency(plan.upgradeCost)}
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="info-field">
              <DollarSign className="field-icon" />
              <div>
                <div className="font-semibold">
                  {formatCurrency(plan.checkAmount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Monto de verificación
                </div>
              </div>
            </div>

            <div className="info-field">
              <Zap className="field-icon" />
              <div>
                <div className="font-semibold">
                  {plan.binaryPoints.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Puntos binarios
                </div>
              </div>
            </div>

            <div className="info-field">
              <TrendingUp className="field-icon" />
              <div>
                <div className="font-semibold">
                  {plan.commissionPercentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Comisión binaria
                </div>
              </div>
            </div>

            <div className="info-field">
              <Star className="field-icon" />
              <div>
                <div className="font-semibold">
                  {plan.directCommissionAmount}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Comisión directa
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Alert */}
      {plan.warning && (
        <Card className="mb-6 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning">Advertencia</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.warning}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products and Benefits */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-blue-500" />
              Productos Incluidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">{product}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Beneficios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      {actionConfig && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">
                  {userMembership.hasMembership
                    ? 'Actualizar tu membresía'
                    : 'Adquirir este plan'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {actionConfig.amount > 0
                    ? `Costo: ${formatCurrency(actionConfig.amount)}`
                    : 'No disponible para downgrade'}
                </p>
              </div>

              <Button
                onClick={() => setShowPaymentSheet(true)}
                disabled={actionConfig.disabled}
                variant={actionConfig.variant}
                size="lg"
                className="w-full sm:w-auto"
              >
                <actionConfig.icon className="h-4 w-4 mr-2" />
                {actionConfig.text}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Sheet */}
      <PaymentSubscriptionSheet
        isOpen={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        plan={plan}
        userMembership={userMembership}
      />
    </div>
  );
}
