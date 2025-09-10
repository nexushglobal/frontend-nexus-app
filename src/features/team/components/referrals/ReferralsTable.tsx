import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Crown, Phone, Shield, TrendingDown, TrendingUp } from 'lucide-react'
import { DirectTeam } from '../../types/team.types'

interface ReferralsTableProps {
  data: DirectTeam[]
  isLoading?: boolean
}

export function ReferralsTable({ data, isLoading }: ReferralsTableProps) {
  if (isLoading) {
    return <ReferralsTableSkeleton />
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <TableHead className="w-[250px] font-semibold text-primary">
                  Usuario
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  Posición
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  Membresía
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  Volumen Total
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  Lotes
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  Rango Actual
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  Rango Máximo
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((referral) => (
                <TableRow key={referral.userId} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {referral.fullName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {referral.email}
                      </div>
                      {referral.phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {referral.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`font-medium ${
                        referral.position === 'LEFT'
                          ? 'border-blue-500 text-blue-700'
                          : 'border-green-500 text-green-700'
                      }`}
                    >
                      {referral.position === 'LEFT' ? 'Izquierda' : 'Derecha'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
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
                          <div className="text-xs text-muted-foreground">
                            {referral.membership.plan.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground border border-gray-300 px-2 py-1 rounded-md">Sin membresía</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {referral.monthlyVolume.totalVolume === 0 ? (
                      <span className="text-sm text-muted-foreground">Sin volumen</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-semibold text-lg">
                          {referral.monthlyVolume.totalVolume.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-center gap-3 text-xs">
                          <span 
                            className="flex items-center gap-1 text-blue-700 border border-blue-300 px-2 py-1 rounded-full cursor-help"
                            title="Izquierda"
                          >
                            <TrendingUp className="h-3 w-3" />
                            {referral.monthlyVolume.leftVolume.toLocaleString()}
                          </span>
                          <span 
                            className="flex items-center gap-1 text-green-700 border border-green-300 px-2 py-1 rounded-full cursor-help"
                            title="Derecha"
                          >
                            <TrendingDown className="h-3 w-3" />
                            {referral.monthlyVolume.rightVolume.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {referral.lots.total === 0 ? (
                      <span className="text-sm text-muted-foreground">Sin lotes</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-semibold text-lg text-primary">{referral.lots.total}</div>
                        <div className="flex items-center justify-center gap-2 text-xs">
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
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {referral.currentRank ? (
                      <Badge variant="outline" className="gap-1 border-purple-500 text-purple-700">
                        <Crown className="h-3 w-3" />
                        {referral.currentRank.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground border border-gray-300 px-2 py-1 rounded-md">Sin rango</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {referral.highestRank ? (
                      <Badge variant="outline" className="gap-1 border-orange-500 text-orange-700">
                        <Crown className="h-3 w-3" />
                        {referral.highestRank.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground border border-gray-300 px-2 py-1 rounded-md">Sin rango</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function ReferralsTableSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/30">
                <TableHead className="w-[250px]">Usuario</TableHead>
                <TableHead className="text-center">Posición</TableHead>
                <TableHead className="text-center">Membresía</TableHead>
                <TableHead className="text-center">Volumen Total</TableHead>
                <TableHead className="text-center">Lotes</TableHead>
                <TableHead className="text-center">Rango Actual</TableHead>
                <TableHead className="text-center">Rango Máximo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-6 bg-muted rounded animate-pulse mx-auto w-16" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-6 bg-muted rounded animate-pulse mx-auto w-20" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-6 bg-muted rounded animate-pulse mx-auto w-20" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-6 bg-muted rounded animate-pulse mx-auto w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}