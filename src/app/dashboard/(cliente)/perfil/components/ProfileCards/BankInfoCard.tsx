import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankInfo } from "@/types/profile.types";
import { CreditCard, Edit, Hash, Landmark } from "lucide-react";
import { BankInfoModal } from "../modal/BankInfoModal";

interface Props {
    bankInfo: BankInfo | null;
    onUpdate: () => void;
}

export function BankInfoCard({ bankInfo, onUpdate }: Props) {
    const getCompletionPercentage = () => {
        if (!bankInfo) return 0;

        let completed = 0;
        const total = 3;

        if (bankInfo.bankName) completed++;
        if (bankInfo.accountNumber) completed++;
        if (bankInfo.cci) completed++;

        return Math.round((completed / total) * 100);
    };

    const completionPercentage = getCompletionPercentage();

    const maskAccountNumber = (accountNumber: string) => {
        if (accountNumber.length <= 4) return accountNumber;
        return `****${accountNumber.slice(-4)}`;
    };

    const maskCCI = (cci: string) => {
        if (cci.length <= 4) return cci;
        return `****************${cci.slice(-4)}`;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Landmark className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Información Bancaria</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {completionPercentage}% completo
                            </span>
                        </div>
                    </div>
                </div>
                <BankInfoModal bankInfo={bankInfo} onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </BankInfoModal>
            </CardHeader>

            <CardContent className="space-y-4">
                {bankInfo ? (
                    <>
                        {/* Información bancaria en grid compacto */}
                        <div className="space-y-3">
                            {/* Banco */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Landmark className="h-4 w-4 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Banco</p>
                                    {bankInfo.bankName ? (
                                        <p className="text-sm font-medium">{bankInfo.bankName}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificado</p>
                                    )}
                                </div>
                            </div>

                            {/* Número de Cuenta */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Número de Cuenta</p>
                                    {bankInfo.accountNumber ? (
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium font-mono">
                                                {maskAccountNumber(bankInfo.accountNumber)}
                                            </p>
                                            <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                                Oculto por seguridad
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificado</p>
                                    )}
                                </div>
                            </div>

                            {/* CCI */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">CCI (Código de Cuenta Interbancaria)</p>
                                    {bankInfo.cci ? (
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium font-mono">
                                                {maskCCI(bankInfo.cci)}
                                            </p>
                                            <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                                Oculto por seguridad
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificado</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Nota de seguridad */}
                        {(bankInfo.accountNumber || bankInfo.cci) && (
                            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                                <p className="text-xs text-muted-foreground">
                                    🔒 <strong>Información protegida:</strong> Los números de cuenta se muestran parcialmente por tu seguridad.
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="p-4 rounded-full bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Landmark className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">
                            Información Bancaria No Configurada
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Agrega tu información bancaria para recibir pagos y transferencias
                        </p>
                        <BankInfoModal bankInfo={bankInfo} onUpdate={onUpdate}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Agregar Información Bancaria
                            </Button>
                        </BankInfoModal>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}