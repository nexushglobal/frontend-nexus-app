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
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Información Bancaria
                </CardTitle>
                <BankInfoModal bankInfo={bankInfo} onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                    </Button>
                </BankInfoModal>
            </CardHeader>
            <CardContent className="space-y-4">
                {bankInfo ? (
                    <>
                        {bankInfo.bankName && (
                            <div className="flex items-center gap-2">
                                <Landmark className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{bankInfo.bankName}</span>
                            </div>
                        )}
                        {bankInfo.accountNumber && (
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span>{bankInfo.accountNumber}</span>
                            </div>
                        )}
                        {bankInfo.cci && (
                            <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <span className="font-mono">{bankInfo.cci}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">No hay información bancaria</p>
                )}
            </CardContent>
        </Card>
    );
}