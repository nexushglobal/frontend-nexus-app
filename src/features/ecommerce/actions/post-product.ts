'use server';

import { api } from '@/features/shared/services/api';
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
    console.log('Product created successfully:', response);

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
export async function updateProductAction(id: number, formData: FormData) {}

export async function updateProductImageAction(
  productId: number,
  imageId: number,
  formData: FormData,
) {}

export async function addProductImageAction(
  productId: number,
  formData: FormData,
) {}

export async function deleteProductImageAction(
  productId: number,
  imageId: number,
) {}

export async function addStockProductAction(productId: number, stock: number) {}
