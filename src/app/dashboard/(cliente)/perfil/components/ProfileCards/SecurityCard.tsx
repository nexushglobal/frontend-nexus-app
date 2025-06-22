import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Shield } from "lucide-react";
import { ChangePasswordModal } from "../modal/ChangePasswordModal";

interface Props {
    onUpdate: () => void;
}

export function SecurityCard({ onUpdate }: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Seguridad
                </CardTitle>
                <ChangePasswordModal onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                    </Button>
                </ChangePasswordModal>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Contraseña</p>
                        <p className="text-sm text-muted-foreground">
                            Mantén tu cuenta segura con una contraseña fuerte
                        </p>
                    </div>
                    <div className="text-muted-foreground">
                        ••••••••
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}