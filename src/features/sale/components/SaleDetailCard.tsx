import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  User,
  Phone,
  Building,
  Calendar,
  CreditCard,
  FileText,
  Users,
  Receipt,
  Mail,
  IdCard,
  Clock,
  DollarSign,
  UserCheck,
  Building2,
  Hash,
  CalendarDays,
  Eye,
  Download as DownloadIcon,
  Shield,
  Timer,
  Banknote,
} from "lucide-react";
import { SaleDetail } from "../types/sale.types";
import {
  formatCurrency,
  formatDate,
} from "@/features/shared/utils/formatCurrency";

interface SaleDetailCardProps {
  saleDetail: SaleDetail;
}

export function SaleDetailCard({ saleDetail }: SaleDetailCardProps) {
  const formatPaymentType = (type: string) => {
    const types = {
      DIRECT_PAYMENT: "Pago Directo",
      FINANCED: "Financiado",
      INSTALLMENT: "Cuotas",
      RESERVATION: "Reserva",
    };
    return types[type as keyof typeof types] || type;
  };

  const getSaleStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      PENDING_APPROVAL: {
        label: "Pendiente Aprobación",
        className: "bg-orange-100 text-orange-800 border-orange-200",
      },
      APPROVED: {
        label: "Aprobado",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      REJECTED: {
        label: "Rechazado",
        className: "bg-red-100 text-red-800 border-red-200",
      },
      COMPLETED: {
        label: "Completado",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      WITHDRAWN: {
        label: "Retirado",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      },
      RESERVED: {
        label: "Reservado",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      },
      RESERVATION_PENDING: {
        label: "Reserva Pendiente",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      },
      IN_PAYMENT_PROCESS: {
        label: "En Proceso de Pago",
        className: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge className={`${config.className} border font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      APPROVED: {
        label: "Aprobado",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      REJECTED: {
        label: "Rechazado",
        className: "bg-red-100 text-red-800 border-red-200",
      },
      COMPLETED: {
        label: "Completado",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      CANCELLED: {
        label: "Cancelado",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge className={`${config.className} border text-xs`}>
        {config.label}
      </Badge>
    );
  };

  // Calcular totales de pagos
  const totalPaidAmount =
    saleDetail.paymentsSummary?.reduce((sum, payment) => {
      return payment.status === "APPROVED" || payment.status === "COMPLETED"
        ? sum + payment.amount
        : sum;
    }, 0) || 0;

  const pendingAmount = parseFloat(saleDetail.totalAmount) - totalPaidAmount;

  return (
    <div className="space-y-6">
      {/* Información Principal de la Venta */}
      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-blue-600" />
                Venta #{saleDetail.id.slice(0, 8)}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-gray-600 flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  {formatPaymentType(saleDetail.type)}
                </p>
                <p className="text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(saleDetail.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              {getSaleStatusBadge(saleDetail.status)}
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(
                    parseFloat(saleDetail.totalAmount),
                    saleDetail.currency
                  )}
                </p>
                <p className="text-sm text-gray-500">Monto Total</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Información adicional de la venta */}
            {saleDetail.reservationAmount && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Shield className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Monto Reserva
                  </p>
                  <p className="text-lg font-bold text-amber-900">
                    {formatCurrency(
                      parseFloat(saleDetail.reservationAmount),
                      saleDetail.currency
                    )}
                  </p>
                </div>
              </div>
            )}

            {saleDetail.maximumHoldPeriod && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Timer className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Período Máximo
                  </p>
                  <p className="text-sm font-semibold text-purple-900">
                    {formatDate(saleDetail.maximumHoldPeriod)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Banknote className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Total Pagado
                </p>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(totalPaidAmount, saleDetail.currency)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <DollarSign className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Saldo Pendiente
                </p>
                <p className="text-lg font-bold text-red-900">
                  {formatCurrency(pendingAmount, saleDetail.currency)}
                </p>
              </div>
            </div>
          </div>

          {saleDetail.fromReservation && (
            <div className="mt-4">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-200"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Venta generada desde reserva
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Cliente Principal */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-600" />
              Cliente Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {saleDetail.client.firstName} {saleDetail.client.lastName}
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                  <span className="text-gray-700">
                    {saleDetail.client.address}
                  </span>
                </div>

                {saleDetail.client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {saleDetail.client.phone}
                    </span>
                  </div>
                )}
              </div>

              {saleDetail.client.reportPdfUrl && (
                <div className="pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a
                      href={saleDetail.client.reportPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Reporte del Cliente
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cliente Secundario */}
        {saleDetail.secondaryClients && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
                Cliente Secundario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {saleDetail.secondaryClients.firstName}{" "}
                  {saleDetail.secondaryClients.lastName}
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                  <span className="text-gray-700">
                    {saleDetail.secondaryClients.address}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {saleDetail.secondaryClients.phone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de la Propiedad */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
              Información de la Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Proyecto</p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.lot.project}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Etapa</p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.lot.stage}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Bloque</p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.lot.block}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Lote</p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.lot.name}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Precio del Lote:
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatCurrency(
                      parseFloat(saleDetail.lot.lotPrice),
                      saleDetail.currency
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Hash className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    ID: {saleDetail.lot.id}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Vendedor */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IdCard className="w-5 h-5 text-indigo-600" />
              Vendedor Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-gray-900">
                {saleDetail.vendor.firstName} {saleDetail.vendor.lastName}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Documento:
                </span>
                <Badge variant="outline" className="font-mono">
                  {saleDetail.vendor.document}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipo de Ventas */}
      {(saleDetail.liner ||
        saleDetail.telemarketingSupervisor ||
        saleDetail.telemarketingConfirmer ||
        saleDetail.telemarketer ||
        saleDetail.fieldManager ||
        saleDetail.fieldSupervisor ||
        saleDetail.fieldSeller ||
        saleDetail.guarantor) && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-teal-600" />
              Equipo de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {saleDetail.liner && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Liner
                  </p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.liner.firstName} {saleDetail.liner.lastName}
                  </p>
                </div>
              )}

              {saleDetail.telemarketingSupervisor && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Sup. Telemarketing
                  </p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.telemarketingSupervisor.firstName}{" "}
                    {saleDetail.telemarketingSupervisor.lastName}
                  </p>
                </div>
              )}

              {saleDetail.telemarketingConfirmer && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Confirmador
                  </p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.telemarketingConfirmer.firstName}{" "}
                    {saleDetail.telemarketingConfirmer.lastName}
                  </p>
                </div>
              )}

              {saleDetail.telemarketer && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Telemarketer
                  </p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.telemarketer.firstName}{" "}
                    {saleDetail.telemarketer.lastName}
                  </p>
                </div>
              )}

              {saleDetail.fieldManager && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Gerente Campo
                  </p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.fieldManager.firstName}{" "}
                    {saleDetail.fieldManager.lastName}
                  </p>
                </div>
              )}

              {saleDetail.fieldSupervisor && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Sup. Campo
                  </p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.fieldSupervisor.firstName}{" "}
                    {saleDetail.fieldSupervisor.lastName}
                  </p>
                </div>
              )}

              {saleDetail.fieldSeller && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Vendedor Campo
                  </p>
                  <p className="font-semibold text-gray-900">
                    {saleDetail.fieldSeller.firstName}{" "}
                    {saleDetail.fieldSeller.lastName}
                  </p>
                </div>
              )}

              {saleDetail.guarantor && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-600 mb-1">
                    Garante
                  </p>
                  <p className="font-semibold text-amber-900">
                    {saleDetail.guarantor.firstName}{" "}
                    {saleDetail.guarantor.lastName}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentos */}
      {(saleDetail.radicationPdfUrl || saleDetail.paymentAcordPdfUrl) && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-red-600" />
              Documentos Asociados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {saleDetail.radicationPdfUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200"
                >
                  <a
                    href={saleDetail.radicationPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DownloadIcon className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-blue-700">
                      Documento de Radicación
                    </span>
                    <span className="text-xs text-gray-500">Descargar PDF</span>
                  </a>
                </Button>
              )}

              {saleDetail.paymentAcordPdfUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200"
                >
                  <a
                    href={saleDetail.paymentAcordPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DownloadIcon className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-green-700">
                      Acuerdo de Pago
                    </span>
                    <span className="text-xs text-gray-500">Descargar PDF</span>
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de Pagos */}
      {saleDetail.paymentsSummary && saleDetail.paymentsSummary.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5 text-amber-600" />
                Historial de Pagos
              </div>
              <Badge variant="outline" className="text-sm">
                {saleDetail.paymentsSummary.length} pagos registrados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saleDetail.paymentsSummary.map((payment) => (
                <Card
                  key={payment.id}
                  className="border border-gray-200 shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(
                              payment.amount,
                              saleDetail.currency
                            )}
                          </span>
                          {getPaymentStatusBadge(payment.status)}
                          <Badge variant="outline" className="text-xs">
                            #{payment.id}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building className="w-3 h-3" />
                            <span className="font-medium">Banco:</span>
                            <span>{payment.banckName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="w-3 h-3" />
                            <span className="font-medium">Código Op.:</span>
                            <span className="font-mono">
                              {payment.codeOperation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Receipt className="w-3 h-3" />
                            <span className="font-medium">Ticket:</span>
                            <span className="font-mono">
                              {payment.numberTicket}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-3 h-3" />
                            <span className="font-medium">Fecha Op.:</span>
                            <span>{formatDate(payment.dateOperation)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3 h-3" />
                            <span className="font-medium">Config. Pago:</span>
                            <span>{payment.paymentConfig}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 lg:text-right space-y-1">
                        <p className="flex items-center gap-1 lg:justify-end">
                          <Clock className="w-3 h-3" />
                          <span>Creado: {formatDate(payment.createdAt)}</span>
                        </p>
                        {payment.reviewedAt && (
                          <p className="flex items-center gap-1 lg:justify-end">
                            <Clock className="w-3 h-3" />
                            <span>
                              Revisado: {formatDate(payment.reviewedAt)}
                            </span>
                          </p>
                        )}
                        {payment.reviewBy && (
                          <p className="flex items-center gap-1 lg:justify-end">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs">
                              {payment.reviewBy.email}
                            </span>
                          </p>
                        )}
                        {payment.reason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-700 text-xs">
                              <span className="font-medium">Motivo:</span>{" "}
                              {payment.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumen de pagos */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total de la Venta
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(
                      parseFloat(saleDetail.totalAmount),
                      saleDetail.currency
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Total Pagado
                  </p>
                  <p className="text-lg font-bold text-green-700">
                    {formatCurrency(totalPaidAmount, saleDetail.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">
                    Saldo Pendiente
                  </p>
                  <p className="text-lg font-bold text-red-700">
                    {formatCurrency(pendingAmount, saleDetail.currency)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
