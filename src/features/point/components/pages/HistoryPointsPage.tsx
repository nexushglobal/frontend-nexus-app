'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@features/shared/components/common/PageHeader';
import {
  Award,
  BadgeDollarSign,
  Filter,
  History,
  Landmark,
  PiggyBank,
  RefreshCcw,
} from 'lucide-react';
import { useState } from 'react';
import { usePoints } from '../../hooks/usePoints';
import { PointsTransactionsFilters } from '../PointsTransactionsFilters';
import SummaryPointCard from '../SummaryPointCard';
import { TransactionsTable } from '../tables/TransactionsTable';
import { TransactionsCards } from '../TranscationsCards';

export function HistoryPointsPage() {
  const [openFilters, setOpenFilters] = useState(false);

  const handleFilter = () => setOpenFilters((prev) => !prev);

  const {
    summaryPoints,
    transactions,
    filters,
    handleEndDateChange,
    handleStartDateChange,
    handleStatusChange,
    handleTypeChange,
    userTransactionLoading,
    handleRefreshTransactions,
    handleRefreshSummaryPoints,
    resetFilters,
  } = usePoints();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Historial de Puntos"
        subtitle="Consulta tus puntos disponibles y el historial de movimientos"
        className="mb-6"
        variant="gradient"
        icon={PiggyBank}
        actions={
          <Button
            variant="outline"
            onClick={() => {}}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="inline-flex gap-2 items-center">
              <Award />
              Resumen de Puntos
            </div>
          </CardTitle>
          <Button onClick={handleRefreshSummaryPoints}>
            <RefreshCcw />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryPointCard
              className="dark:bg-blue-900/20 bg-blue-50 dark:text-blue-400 text-blue-700 border-blue-200 dark:border-blue-800/50"
              icon={BadgeDollarSign}
              title="Puntos Disponibles"
              value={summaryPoints?.availablePoints}
              subtitle={`Plan: ${summaryPoints?.membershipPlan.name}`}
            />
            <SummaryPointCard
              className="dark:bg-emerald-900/20 bg-emerald-50 dark:text-emerald-400 text-emerald-700 border-emerald-200 dark:border-emerald-800/50"
              icon={History}
              title="Total Ganados"
              value={summaryPoints?.totalEarnedPoints}
              subtitle="Puntos acumulados históricamente"
            />
            <SummaryPointCard
              className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
              icon={Landmark}
              title="Total Retirados"
              value={summaryPoints?.totalWithdrawnPoints}
              subtitle="Puntos retirados o utilizados"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="inline-flex gap-2 items-center">
              <History />
              Historial de Transacciones
            </div>
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              className="inline-flex gap-2 items-center"
              variant="outline"
              onClick={handleFilter}
            >
              <Filter />
              <span>Filtros</span>
            </Button>
            <Button
              className="inline-flex gap-2 items-center"
              variant="outline"
              onClick={handleRefreshTransactions}
            >
              <RefreshCcw />
              <span>Actualizar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {openFilters && (
            <PointsTransactionsFilters
              status={filters.status}
              type={filters.type}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onStatusChange={handleStatusChange}
              onTypeChange={handleTypeChange}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onReset={resetFilters}
              className="mb-6"
            />
          )}
          <div className="hidden md:block">
            <TransactionsTable
              data={transactions}
              isLoading={userTransactionLoading}
            />
          </div>
          <div className="md:hidden">
            <TransactionsCards data={transactions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
