import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowUpDown, RotateCcw } from 'lucide-react'
import { useReferralsFiltersStore } from '../../stores/referrals-filters.store'

interface ReferralsFiltersProps {
  isLoading?: boolean
}

export function ReferralsFilters({ isLoading }: ReferralsFiltersProps) {
  const { filters, setFilter, resetFilters } = useReferralsFiltersStore()

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Sort By */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Ordenar por:
          </span>
          <Select
            value={filters.sortBy}
            onValueChange={(value: 'volume' | 'lots') => setFilter('sortBy', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">Volumen</SelectItem>
              <SelectItem value="lots">Lotes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Orden:
          </span>
          <Select
            value={filters.sortOrder}
            onValueChange={(value: 'asc' | 'desc') => setFilter('sortOrder', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Mayor a menor</SelectItem>
              <SelectItem value="asc">Menor a mayor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        disabled={isLoading}
        className="gap-2 self-start sm:self-auto"
      >
        <RotateCcw className="h-4 w-4" />
        Resetear filtros
      </Button>
    </div>
  )
}