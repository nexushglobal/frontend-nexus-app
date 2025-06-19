import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, UserCircle } from "lucide-react";

interface ReferralCodesCardProps {
    referralCode: string;
    referrerCode: string | null;
    copiedField: string | null;
    onCopy: (text: string, fieldName: string) => void;
}

export function ReferralCodesCard({
    referralCode,
    referrerCode,
    copiedField,
    onCopy
}: ReferralCodesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Códigos de Referido
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Mi Código de Referido</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-lg font-mono">
                                {referralCode}
                            </code>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCopy(referralCode, "Código de referido")}
                            >
                                {copiedField === "Código de referido" ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {referrerCode && (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Referido por</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-muted px-3 py-2 rounded text-lg font-mono">
                                    {referrerCode}
                                </code>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onCopy(referrerCode, "Código del referidor")}
                                >
                                    {copiedField === "Código del referidor" ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
