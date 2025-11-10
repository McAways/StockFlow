import axios, { AxiosError } from "axios";
import type { Product, ProductForm } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Evita // duplicado: baseURL termina sem barra; endpoints começam sem barra
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/products`,
  timeout: 10000,
});

// Interceptor simples para 401 (opcional)
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      // Ex.: limpar sessão e redirecionar pro login
      // sessionStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Helper pra header
function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// Garante que price vem número e quantity número
function normalizeProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price ?? 0),
    quantity: Number(p.quantity ?? 0),
  };
}

export default {
  async getProducts(token: string): Promise<Product[]> {
    const { data } = await api.get("", {
      headers: authHeader(token),
    });
    return (Array.isArray(data) ? data : []).map(normalizeProduct);
  },

  async createProduct(token: string, payload: ProductForm): Promise<Product> {
    // Em create, garanta que não vai um id por engano
    const { id: _ignore, ...body } = payload;

    // Se vier só o base64 sem "data:image/..", você pode prefixar aqui (opcional)
    // if (body.imageBase64 && !body.imageBase64.startsWith("data:")) {
    //   body.imageBase64 = `data:image/png;base64,${body.imageBase64}`;
    // }

    const { data } = await api.post("", body, {
      headers: authHeader(token),
    });
    return normalizeProduct(data);
  },

  async updateProduct(token: string, id: number, payload: ProductForm): Promise<Product> {
    const { data } = await api.put(`${id}`, payload, {
      headers: authHeader(token),
    });
    return normalizeProduct(data);
  },

  async deleteProduct(token: string, id: number): Promise<void> {
    await api.delete(`${id}`, {
      headers: authHeader(token),
    });
  },
};
