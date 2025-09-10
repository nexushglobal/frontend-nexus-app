import { useQueryClient } from '@tanstack/react-query';

/**
 * Limpia todos los datos persistentes de las stores de Zustand
 */
export const clearAllStores = () => {
  // Limpiar todas las stores persistentes del localStorage
  const keysToRemove = [
    'menu-store', // Menu store que usa persist
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Importar y limpiar stores específicas dinámicamente para evitar dependencias circulares
  const resetStoreFilters = async () => {
    try {
      // Limpiar filtros de todas las stores
      const stores = [
        () => import('@features/point/stores/point-filters.store'),
        () => import('@features/point/stores/point-lot-filters.store'),
        () => import('@features/point/stores/weekly-volume-filters.store'),
        () => import('@features/point/stores/monthly-volume-filters.store'),
        () => import('@features/payment/stores/payment-filters.store'),
        () => import('@features/team/stores/referrals-filters.store'),
        () => import('@features/withdrawals/stores/withdrawals-client-filters.store'),
        () => import('@features/withdrawals/stores/withdrawals-admin-filters.store'),
        () => import('@features/leads/stores/leads-filters.store'),
        () => import('@features/complaints/stores/complaint-filters.store'),
        () => import('@features/complaints/stores/complaints-filters.store'),
        () => import('@features/ecommerce/components/stores/order-client-filters.store'),
        () => import('@features/ecommerce/components/stores/order-filters.store'),
        () => import('@features/ecommerce/components/stores/product-client-filters.store'),
        () => import('@features/ecommerce/components/stores/product-filters.store'),
      ];
      
      // Resetear filtros de cada store
      stores.forEach(async (importStore) => {
        try {
          const store = await importStore();
          const storeExports = Object.values(store);
          storeExports.forEach((exportedStore: unknown) => {
            if (
              exportedStore && 
              typeof exportedStore === 'object' && 
              'getState' in exportedStore && 
              typeof exportedStore.getState === 'function'
            ) {
              const state = exportedStore.getState() as { resetFilters?: () => void };
              if (state.resetFilters && typeof state.resetFilters === 'function') {
                state.resetFilters();
              }
            }
          });
        } catch (error) {
          console.warn('Error resetting store filters:', error);
        }
      });
      
      // Limpiar stores de UI
      const { useCartUIStore } = await import('@features/shared/stores/cart-ui.store');
      useCartUIStore.getState().close();
      
    } catch (error) {
      console.warn('Error during store cleanup:', error);
    }
  };
  
  // Ejecutar limpieza de stores de forma asíncrona
  resetStoreFilters();
};

/**
 * Limpia todo el cache de TanStack Query
 */
export const clearQueryCache = (queryClient: ReturnType<typeof useQueryClient>) => {
  // Remover todas las queries del cache
  queryClient.clear();
  
  // Cancelar todas las queries en progreso
  queryClient.cancelQueries();
  
  // Invalidar todas las queries
  queryClient.invalidateQueries();
  
  // Limpiar el garbage collector inmediatamente
  queryClient.getQueryCache().clear();
  queryClient.getMutationCache().clear();
};

/**
 * Función principal para limpiar todos los datos al hacer logout
 */
export const performLogoutCleanup = (queryClient: ReturnType<typeof useQueryClient>) => {
  // Limpiar stores
  clearAllStores();
  
  // Limpiar cache de queries
  clearQueryCache(queryClient);
  
  // Limpiar sessionStorage si hay datos sensibles
  sessionStorage.clear();
  
  // Limpiar cookies relacionadas con la aplicación (excepto las de NextAuth que se manejan automáticamente)
  // NextAuth maneja sus propias cookies automáticamente
  
  console.log('Logout cleanup completed - All stores and cache cleared');
};