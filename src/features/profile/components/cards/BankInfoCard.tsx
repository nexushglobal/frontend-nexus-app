import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Edit, Hash, Landmark } from "lucide-react";
import { SectionHeader } from "@/components/common/card/SectionHeader";
import { ProfileInfoField } from "@/components/common/field/ProfileInfoField";
import { InfoCard } from "@/components/common/card/InfoCard";
import { BankInfo } from "../../types/profile.types";
import { BankInfoModal } from "../modals/BankInfoModal";

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

    return (
        <Card>
            <SectionHeader
                title="Información Bancaria"
                icon={Landmark}
                completionPercentage={completionPercentage}
                showProgress={true}
                actionButton={
                    <BankInfoModal bankInfo={bankInfo} onUpdate={onUpdate}>
                        <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </BankInfoModal>
                }
            />

            <CardContent className="space-y-4">
                {bankInfo ? (
                    <>
                        <div className="space-y-3">
                            <ProfileInfoField
                                label="Banco"
                                value={bankInfo.bankName || "No especificado"}
                                icon={Landmark}
                                isComplete={!!bankInfo.bankName}
                            />

                            <ProfileInfoField
                                label="Número de Cuenta"
                                value={bankInfo.accountNumber || "No especificado"}
                                icon={CreditCard}
                                isComplete={!!bankInfo.accountNumber}
                                maskValue={!!bankInfo.accountNumber}
                                maskPattern="account"
                            />

                            <ProfileInfoField
                                label="CCI (Código de Cuenta Interbancaria)"
                                value={bankInfo.cci || "No especificado"}
                                icon={Hash}
                                isComplete={!!bankInfo.cci}
                                maskValue={!!bankInfo.cci}
                                maskPattern="cci"
                            />
                        </div>

                        {(bankInfo.accountNumber || bankInfo.cci) && (
                            <InfoCard
                                title="Información protegida"
                                icon="🔒"
                                variant="default"
                                items={["Los números de cuenta se muestran parcialmente por tu seguridad."]}
                            />
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