import { Edit, Eye, Images, Package } from 'lucide-react';

export const productDetailMenuSections = [
  {
    id: 'overview',
    label: 'Información General',
    shortLabel: 'Info',
    description: 'Vista general del producto',
    icon: Eye,
  },
  {
    id: 'edit',
    label: 'Editar Producto',
    shortLabel: 'Editar',
    description: 'Modificar datos del producto',
    icon: Edit,
  },
  {
    id: 'images',
    label: 'Gestión de Imágenes',
    shortLabel: 'Imágenes',
    description: 'Administrar imágenes del producto',
    icon: Images,
  },
  {
    id: 'stock',
    label: 'Control de Stock',
    shortLabel: 'Stock',
    description: 'Historial y gestión de inventario',
    icon: Package,
  },
];
