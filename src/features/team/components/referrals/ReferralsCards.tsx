import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Crown, Mail, Phone, Shield, TrendingDown, TrendingUp, User } from 'lucide-react'
import { DirectTeam } from '../../types/team.types'

interface ReferralsCardsProps {
  data: DirectTeam[]
}

export function ReferralsCards({ data }: ReferralsCardsProps) {
  if (data.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4">
      {data.map((referral) => (
        <ReferralCard key={referral.userId} referral={referral} />
      ))}
    </div>
  )
}

interface ReferralCardProps {
  referral: DirectTeam
}

function ReferralCard({ referral }: ReferralCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground leading-none">
                {referral.fullName}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {referral.email}
              </div>
              {referral.phone && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {referral.phone}
                </div>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className={`font-medium shrink-0 ${
              referral.position === 'LEFT'
                ? 'border-blue-500 text-blue-700'
                : 'border-green-500 text-green-700'
            }`}
          >
            {referral.position === 'LEFT' ? 'Izquierda' : 'Derecha'}
          </Badge>
        </div>

        <Separator />

        {/* Membership Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Membresía
            </span>
            <div>
              {referral.membership ? (
                <div className="space-y-1">
                  <Badge 
                    variant="outline" 
                    className={`gap-1 ${
                      referral.membership.status === 'ACTIVE' 
                        ? 'border-emerald-500 text-emerald-700' 
                        : referral.membership.status === 'EXPIRED'
                        ? 'border-red-500 text-red-700'
                        : referral.membership.status === 'PENDING'
                        ? 'border-yellow-500 text-yellow-700'
                        : 'border-gray-500 text-gray-700'
                    }`}
                  >
                    <Shield className="h-3 w-3" />
                    {referral.membership.status === 'ACTIVE' ? 'Activa' : 
                     referral.membership.status === 'EXPIRED' ? 'Expirada' : 
                     referral.membership.status === 'PENDING' ? 'Pendiente' : 'Inactiva'}
                  </Badge>
                  {referral.membership.plan && (
                    <div className="text-xs text-muted-foreground text-right">
                      {referral.membership.plan.name}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground border border-gray-300 px-2 py-1 rounded-md">Sin membresía</span>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Volume Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Volumen Total
            </span>
            {referral.monthlyVolume.totalVolume === 0 ? (
              <span className="text-sm text-muted-foreground">Sin volumen</span>
            ) : (
              <span className="text-lg font-semibold text-foreground">
                {referral.monthlyVolume.totalVolume.toLocaleString()}
              </span>
            )}
          </div>

          {referral.monthlyVolume.totalVolume > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="flex items-center gap-2 p-2 rounded-md border border-blue-300 cursor-help"
                title="Izquierda"
              >
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div className="text-xs">
                  <div className="font-semibold text-blue-700">
                    {referral.monthlyVolume.leftVolume.toLocaleString()}
                  </div>
                </div>
              </div>
              <div 
                className="flex items-center gap-2 p-2 rounded-md border border-green-300 cursor-help"
                title="Derecha"
              >
                <TrendingDown className="h-4 w-4 text-green-600" />
                <div className="text-xs">
                  <div className="font-semibold text-green-700">
                    {referral.monthlyVolume.rightVolume.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Lots Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Lotes Totales
            </span>
            {referral.lots.total === 0 ? (
              <span className="text-sm text-muted-foreground">Sin lotes</span>
            ) : (
              <span className="text-lg font-semibold text-foreground">
                {referral.lots.total}
              </span>
            )}
          </div>
          {referral.lots.total > 0 && (
            <div className="flex justify-center gap-3 text-xs">
              <span 
                className="border border-amber-400 text-amber-700 px-2 py-1 rounded-full cursor-help"
                title="Comprados"
              >
                {referral.lots.purchased}
              </span>
              <span 
                className="border border-emerald-400 text-emerald-700 px-2 py-1 rounded-full cursor-help"
                title="Vendidos"
              >
                {referral.lots.sold}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Ranks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Rango Actual
            </span>
            <div>
              {referral.currentRank ? (
                <Badge variant="outline" className="gap-1 border-purple-500 text-purple-700">
                  <Crown className="h-3 w-3" />
                  {referral.currentRank.name}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground border border-gray-300 px-2 py-1 rounded-md">Sin rango</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Rango Máximo
            </span>
            <div>
              {referral.highestRank ? (
                <Badge variant="outline" className="gap-1 border-orange-500 text-orange-700">
                  <Crown className="h-3 w-3" />
                  {referral.highestRank.name}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground border border-gray-300 px-2 py-1 rounded-md">Sin rango</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}