// src/types/sale.ts
export interface SaleItemInput {
  productId: number;
  quantity: number;
  unitPrice?: number;
}

export interface SaleCreate {
  customerName?: string;
  items: SaleItemInput[];
}

export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  createdAt: string;
  customerName?: string;
  total: number;
  totalItems: number;
  items: SaleItem[];
}
