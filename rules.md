# 📋 ESPECIFICACIÓN TÉCNICA: VISTA "MIS PUNTOS"

## 🎯 OBJETIVO

Implementar la vista "Mis Puntos" que muestra el resumen de puntos del usuario y su historial de transacciones de la plataforma.

## 📁 RUTA Y VISTA A IMPLEMENTAR

### Vista: "Mis Puntos"

- **Ruta**: `/dashboard/(cliente)/cli-puntos/historial-puntos`
- **Título**: "Mis Puntos"
- **Estado**: Pendiente de implementación

---

## 🔌 INTEGRACIÓN DE DATOS

### Server-Side Data Fetching

```typescript
// Action a consumir (Server Component)
Ubicación: src/features/point/action/get-points.action.ts
Función: getUserPointsAction
Uso: Obtener resumen de puntos del usuario para mostrar en cards superiores
```

### Client-Side Data Fetching

```typescript
// Service a consumir (Client Component)
Ubicación: src/features/point/services/point.service.ts
Función: getUserTransactions
Uso: Obtener historial de transacciones con filtros y paginación

Parámetros disponibles:
- userId: string
- type: 'BINARY_COMMISSION' | 'DIRECT_BONUS' | 'WITHDRAWAL'
- status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
- startDate: string (ISO date)
- endDate: string (ISO date)
- limit: number (paginación)
- page: number (paginación)
```

---

## 🎨 ESPECIFICACIONES DE UI/UX

### Sección Superior - Resumen de Puntos

- **Fuente de datos**: `getUserPointsAction`
- **Diseño**: Cards individuales por cada tipo de punto
- **Estilo**: Diseño atractivo y moderno
- **Responsivo**: Desktop y mobile

### Sección Inferior - Historial de Transacciones

- **Trigger**: Botón "Mostrar historial de transacciones"
- **Fuente de datos**: `getUserTransactions`
- **Visualización**:
  - **Desktop**: Tabla con componentes compartidos
  - **Mobile**: Cards responsivas
- **Filtros implementar**:
  - Tipo de transacción (type)
  - Estado (status)
  - Rango de fechas (startDate, endDate)
  - Paginación (limit, page)

---

## 📋 REQUERIMIENTOS TÉCNICOS

### Componentes y Utilidades Requeridas

1. **Componentes Compartidos**:

   - Usar componentes de tabla existentes (`/shared`)
   - Usar componentes de paginación existentes (`/shared`)
   - Referencia: `src/app/dashboard/(cliente)/cli-mis-pagos/page.tsx`

2. **Constantes y Tipos**:

   ```typescript
   // Crear archivo: src/features/point/constants/index.ts
   export const TRANSACTION_TYPES = {
     BINARY_COMMISSION: 'Comisión Binaria',
     DIRECT_BONUS: 'Bono Directo',
     WITHDRAWAL: 'Retiro',
   };

   export const TRANSACTION_STATUS = {
     PENDING: 'Pendiente',
     COMPLETED: 'Completado',
     CANCELLED: 'Cancelado',
     FAILED: 'Fallido',
   };
   ```

3. **Estilos y Colores**:
   - Mantener paleta de colores de `src/styles/globals.css`
   - Seguir sistema de diseño establecido

---

## 🔄 FUNCIONALIDADES ESPECÍFICAS

### Paginación

- **Implementación**: Lógica en el cliente
- **Componentes**: Usar shared components existentes
- **Estado**: Manejar page y limit en estado del componente
- **Referencia**: Seguir patrón de `cli-mis-pagos`
- **Se debe crear un componente donde solo pondremos las columnas de la tabla**

### Filtros

- **Tipos de filtro**: Dropdown, date pickers, status selector
- **Persistencia**: Mantener filtros en URL params
- **Reset**: Opción para limpiar todos los filtros

### Responsividad

- **Breakpoints**: Mobile-first approach
- **Desktop**: Tabla completa con todas las columnas
- **Mobile**: Cards compactas con información esencial

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Funcionales

- [ ] Resumen de puntos carga desde `getUserPointsAction` y se muestra en cards atractivas
- [ ] Botón "Mostrar historial de transacciones" funciona correctamente
- [ ] Historial se carga desde `getUserTransactions` con paginación
- [ ] Todos los filtros (type, status, fechas) funcionan correctamente
- [ ] Tabla responsive (desktop) y cards (mobile) implementadas

### Técnicos

- [ ] Page.tsx actúa como puente al feature component
- [ ] Componentes reutilizan shared components para tabla y paginación
- [ ] Constantes creadas para traducir tipos y status
- [ ] Código TypeScript con tipado correcto
- [ ] Sigue el patrón de `cli-mis-pagos/page.tsx`

### UI/UX

- [ ] Diseño consistente con `src/styles/globals.css`
- [ ] Cards superiores con diseño atractivo
- [ ] Loading states y estados vacíos implementados
- [ ] Responsive design funcional en mobile y desktop

---

## 📚 REFERENCIAS Y RECURSOS

- **Patrón de referencia**: `src/app/dashboard/(cliente)/cli-mis-pagos/page.tsx`
- **Componentes shared**: `/src/shared/components` (tabla y paginación)
- **Estilos globales**: `src/styles/globals.css`
- **Action existente**: `src/features/point/action/get-points.action.ts`
- **Service existente**: `src/features/point/services/point.service.ts`

---
