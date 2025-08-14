# 📋 ESPECIFICACIÓN TÉCNICA: VISTA "Volúmenes Semanales"

## 🎯 OBJETIVO

Implementar la vista "Volúmenes Semanales" que muestra la información detallada de los volúmenes semanales de puntos del usuario.

## 📁 RUTA Y VISTA A IMPLEMENTAR

### Vista: "Volúmenes Semanales"

- **Ruta**: `/dashboard/(cliente)/cli-puntos/volumenes-semanales`
- **Título**: "Volúmenes Semanales"
- **Estado**: Pendiente de implementación

---

## 🔌 INTEGRACIÓN DE DATOS

### Client-Side Data Fetching

```typescript
// Service a consumir (Client Component)
Ubicación: src/features/point/services/weekly.service.ts
Función: getWeeklyVolumes
Uso: Obtener volúmenes semanales de puntos

Parámetros disponibles:
- limit: number (paginación)
- page: number (paginación)
```

---

## 🎨 ESPECIFICACIONES DE UI/UX

### Historial de volumenes semanas

- **Fuente de datos**: `getWeeklyVolumes` especificamente listPayments
- **Visualización**:
  - **Desktop**: Tabla con componentes compartidos
  - **Mobile**: Cards responsivas
- **Filtros implementar**:
  - Paginación (limit, page)

## 📋 REQUERIMIENTOS TÉCNICOS

### Componentes y Utilidades Requeridas

1. **Componentes Compartidos**:

   - Usar componentes de tabla existentes (`/shared`)
   - Usar componentes de paginación existentes (`/shared`)
   - Referencia: `src/app/dashboard/(cliente)/cli-puntos/historial-puntos/page.tsx`

2. **Constantes y Tipos**:

   ```typescript
   // Crear archivo: src/features/point/constants/index.ts

   export const VOLUME_SITE = {
     LEFT: 'Izquierda',
     RIGHT: 'Derecha',
   };

   export const VOLUME_STATUS = {
     PENDING: 'Pendiente',
     PROCESSED: 'Procesado',
     CANCELLED: 'Cancelado',
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
- **Referencia**: Seguir patrón de `historial-puntos`

### Responsividad

- **Breakpoints**: Mobile-first approach
- **Desktop**: Tabla completa con todas las columnas
- **Mobile**: Cards compactas con información esencial

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Funcionales

- [ ] Historial de volumenes `getWeeklyVolumes` con paginación
- [ ] Tabla responsive (desktop) y cards (mobile) implementadas

### Técnicos

- [ ] Page.tsx actúa como puente al feature component
- [ ] Componentes reutilizan shared components para tabla y paginación
- [ ] Constantes creadas para traducir tipos y status
- [ ] Código TypeScript con tipado correcto
- [ ] Sigue el patrón de `historial-puntos/page.tsx`

### UI/UX

- [ ] Diseño consistente con `src/styles/globals.css`
- [ ] Cards superiores con diseño atractivo
- [ ] Loading states y estados vacíos implementados
- [ ] Responsive design funcional en mobile y desktop

---

## 📚 REFERENCIAS Y RECURSOS

- **Patrón de referencia**: `src/app/dashboard/(cliente)/cli-puntos/historial-puntos/page.tsx`
- **Componentes shared**: `/src/shared/components` (tabla y paginación)
- **Estilos globales**: `src/styles/globals.css`
- **Service existente**: `src/features/point/services/point.service.ts`

---
