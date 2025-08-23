'use server';

import { api } from '@/features/shared/services/api';
import {
  ProductEditFormType,
  StockFormType,
} from '../schemas/product-edit-form.schema';
import { ProductDetailAdmin } from '../types/product.type';
import { revalidateAdminProducts } from './revalidate-product';

export async function createProductAction(formData: FormData) {
  try {
    const images = formData.getAll('productImages') as File[];
    if (!images || images.length === 0) {
      return {
        success: false,
        message: 'No images provided',
        errors: 'No images provided',
        data: null,
      };
    }

    const categoryId = formData.get('categoryId');
    if (!categoryId || isNaN(Number(categoryId)) || Number(categoryId) <= 0) {
      return {
        success: false,
        message: 'Invalid category ID',
        errors: 'Invalid category ID',
        data: null,
      };
    }

    const memberPrice = parseFloat(formData.get('memberPrice') as string);
    const publicPrice = parseFloat(formData.get('publicPrice') as string);
    if (isNaN(memberPrice) || memberPrice < 0) {
      return {
        success: false,
        message: 'El precio de socio debe ser un número válido no negativo',
        errors: 'El precio de socio debe ser un número válido no negativo',
        data: null,
      };
    }

    if (isNaN(publicPrice) || publicPrice < 0) {
      return {
        success: false,
        message: 'El precio público debe ser un número válido no negativo',
        errors: 'El precio público debe ser un número válido no negativo',
        data: null,
      };
    }

    const benefitsData = formData.get('benefits') as string;
    if (benefitsData) {
      try {
        JSON.parse(benefitsData);
      } catch (error) {
        return {
          success: false,
          message: 'Invalid benefits format',
          errors: 'Invalid benefits format',
          data: null,
        };
      }
    }

    const response = await api.post<ProductDetailAdmin>(
      '/api/products',
      formData,
      {
        isFormData: true,
        skipJsonStringify: true,
      },
    );

    revalidateAdminProducts();

    return {
      data: response,
      message: 'Producto creado exitosamente',
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al crear el producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}
export async function updateProductAction(
  id: number,
  data: ProductEditFormType,
) {
  try {
    const response = await api.patch<ProductDetailAdmin>(
      `/api/products/${id}`,
      data,
    );

    revalidateAdminProducts();

    return {
      data: response,
      message: 'Producto actualizado exitosamente',
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al actualizar el producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

export async function updateProductImageAction(
  productId: number,
  imageId: number,
  data: {
    order: number;
    isMain: boolean;
  },
) {
  try {
    const response = await api.patch<ProductDetailAdmin>(
      `/api/products/${productId}/images/${imageId}`,
      data,
    );
    console.log('Product image updated successfully:', response);

    revalidateAdminProducts();

    return {
      data: response,
      message: 'Imagen del producto actualizada exitosamente',
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al actualizar la imagen del producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

export async function addProductImageAction(
  productId: number,
  formData: FormData,
) {
  try {
    const response = await api.post<ProductDetailAdmin>(
      `/api/products/${productId}/images`,
      formData,
      {
        isFormData: true,
        skipJsonStringify: true,
      },
    );

    revalidateAdminProducts();

    return {
      data: response,
      message: 'Imagen del producto añadida exitosamente',
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al añadir la imagen del producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

export async function deleteProductImageAction(
  productId: number,
  imageId: number,
) {
  try {
    const response = await api.delete(
      `/api/products/${productId}/images/${imageId}`,
    );
    console.log('Product image deleted successfully:', response);

    revalidateAdminProducts();

    return {
      data: response,
      message: 'Imagen del producto eliminada exitosamente',
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al eliminar la imagen del producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

export async function addStockProductAction(
  productId: number,
  data: StockFormType,
) {
  try {
    const response = await api.post(
      `/api/product-stock-history/${productId}/stock`,
      data,
    );
    console.log('Stock added successfully:', response);

    revalidateAdminProducts();

    return {
      data: response,
      message: 'Stock añadido exitosamente',
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al añadir el stock del producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}
