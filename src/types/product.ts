export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  imageBase64?: string; // 👈 novo
}

// Para formulários (sem obrigar id):
export type ProductForm = Omit<Product, "id"> & { id?: number };
