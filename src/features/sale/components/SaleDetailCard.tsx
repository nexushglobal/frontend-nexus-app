import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  User,
  Phone,
  Building,
  Calendar,
  CreditCard,
  FileText,
  Download,
  Users,
  Receipt,
  Mail,
  IdCard,
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
      INSTALLMENT: "Cuotas",
      RESERVATION: "Reserva",
    };
    return types[type as keyof typeof types] || type;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "Aprobado", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "Rechazado", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "Cancelado", className: "bg-gray-100 text-gray-800" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Venta #{saleDetail.id.slice(0, 8)}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {formatPaymentType(saleDetail.type)}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <Badge variant="secondary">{saleDetail.status}</Badge>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(
                  parseFloat(saleDetail.totalAmount),
                  saleDetail.currency
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Creado el {formatDate(saleDetail.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-600" />
              Cliente Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {saleDetail.client.firstName} {saleDetail.client.lastName}
                </h4>
              </div>

              <div className="space-y-2">
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
                <div className="pt-3 border-t">
                  <a
                    href={saleDetail.client.reportPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Reporte del Cliente
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {saleDetail.secondaryClients && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-600" />
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

              <div className="space-y-2">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="w-5 h-5 text-purple-600" />
              Propiedad
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

              <div className="pt-3 border-t">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Precio del Lote
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    parseFloat(saleDetail.lot.lotPrice),
                    saleDetail.currency
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la Venta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-orange-600" />
              Detalles de la Venta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tipo de Pago:</span>
                <Badge variant="outline" className="font-medium">
                  {formatPaymentType(saleDetail.type)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monto Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(
                    parseFloat(saleDetail.totalAmount),
                    saleDetail.currency
                  )}
                </span>
              </div>

              {saleDetail.reservationAmount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monto de Reserva:</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      parseFloat(saleDetail.reservationAmount),
                      saleDetail.currency
                    )}
                  </span>
                </div>
              )}

              {saleDetail.fromReservation && (
                <div className="pt-2 border-t">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Venta generada desde reserva
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información del Vendedor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IdCard className="w-5 h-5 text-indigo-600" />
              Vendedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-gray-900">
                {saleDetail.vendor.firstName} {saleDetail.vendor.lastName}
              </h4>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="text-sm">Documento:</span>
                <Badge variant="outline">{saleDetail.vendor.document}</Badge>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Equipo de Ventas */}
        {(saleDetail.liner ||
          saleDetail.telemarketingSupervisor ||
          saleDetail.telemarketingConfirmer ||
          saleDetail.telemarketer ||
          saleDetail.fieldManager ||
          saleDetail.fieldSupervisor ||
          saleDetail.fieldSeller ||
          saleDetail.guarantor) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-teal-600" />
                Equipo de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {saleDetail.liner && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Liner:</span>
                    <span className="font-medium">
                      {saleDetail.liner.firstName} {saleDetail.liner.lastName}
                    </span>
                  </div>
                )}
                {saleDetail.telemarketingSupervisor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Sup. Telemarketing:
                    </span>
                    <span className="font-medium">
                      {saleDetail.telemarketingSupervisor.firstName}{" "}
                      {saleDetail.telemarketingSupervisor.lastName}
                    </span>
                  </div>
                )}
                {saleDetail.telemarketingConfirmer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Confirmador:</span>
                    <span className="font-medium">
                      {saleDetail.telemarketingConfirmer.firstName}{" "}
                      {saleDetail.telemarketingConfirmer.lastName}
                    </span>
                  </div>
                )}
                {saleDetail.telemarketer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Telemarketer:</span>
                    <span className="font-medium">
                      {saleDetail.telemarketer.firstName}{" "}
                      {saleDetail.telemarketer.lastName}
                    </span>
                  </div>
                )}
                {saleDetail.fieldManager && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Gerente Campo:
                    </span>
                    <span className="font-medium">
                      {saleDetail.fieldManager.firstName}{" "}
                      {saleDetail.fieldManager.lastName}
                    </span>
                  </div>
                )}
                {saleDetail.fieldSupervisor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Sup. Campo:</span>
                    <span className="font-medium">
                      {saleDetail.fieldSupervisor.firstName}{" "}
                      {saleDetail.fieldSupervisor.lastName}
                    </span>
                  </div>
                )}
                {saleDetail.fieldSeller && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Vendedor Campo:
                    </span>
                    <span className="font-medium">
                      {saleDetail.fieldSeller.firstName}{" "}
                      {saleDetail.fieldSeller.lastName}
                    </span>
                  </div>
                )}
                {saleDetail.guarantor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Garante:</span>
                    <span className="font-medium">
                      {saleDetail.guarantor.firstName}{" "}
                      {saleDetail.guarantor.lastName}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Documentos */}
      {(saleDetail.radicationPdfUrl || saleDetail.paymentAcordPdfUrl) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-red-600" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {saleDetail.radicationPdfUrl && (
                <a
                  href={saleDetail.radicationPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar Radicación
                </a>
              )}

              {saleDetail.paymentAcordPdfUrl && (
                <a
                  href={saleDetail.paymentAcordPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Acuerdo de Pago
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {saleDetail.paymentsSummary && saleDetail.paymentsSummary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="w-5 h-5 text-amber-600" />
              Historial de Pagos ({saleDetail.paymentsSummary.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saleDetail.paymentsSummary.map((payment) => (
                <Card key={payment.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">
                            {formatCurrency(
                              payment.amount,
                              saleDetail.currency
                            )}
                          </span>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Banco:</span>{" "}
                            {payment.banckName}
                          </p>
                          <p>
                            <span className="font-medium">Código Op.:</span>{" "}
                            {payment.codeOperation}
                          </p>
                          <p>
                            <span className="font-medium">Ticket:</span>{" "}
                            {payment.numberTicket}
                          </p>
                          <p>
                            <span className="font-medium">Fecha Op.:</span>{" "}
                            {formatDate(payment.dateOperation)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Creado: {formatDate(payment.createdAt)}</p>
                        <p>Revisado: {formatDate(payment.reviewedAt)}</p>
                        {payment.reviewBy && (
                          <p className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {payment.reviewBy.email}
                          </p>
                        )}
                        {payment.reason && (
                          <p className="text-red-600 mt-1">
                            <span className="font-medium">Motivo:</span>{" "}
                            {payment.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
