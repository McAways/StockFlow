// src/services/salesAPI.ts
import axios from "axios";
import type { Sale, SaleCreate } from "@/types/sale";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const api = axios.create({ baseURL: `${API_BASE_URL}/api/sales` });

const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

export default {
  async create(token: string, payload: SaleCreate): Promise<Sale> {
    const { data } = await api.post("", payload, { headers: auth(token) });
    return {
      ...data,
      total: Number(data.total),
      totalItems: Number(data.totalItems),
      items: (data.items ?? []).map((i: any) => ({
        ...i,
        unitPrice: Number(i.unitPrice),
        subtotal: Number(i.subtotal),
      })),
    };
  },

  async list(token: string, from: string, to: string): Promise<Sale[]> {
    const { data } = await api.get("", {
      headers: auth(token),
      params: { from, to },
    });
    return (data ?? []).map((s: any) => ({
      ...s,
      total: Number(s.total),
      totalItems: Number(s.totalItems),
      items: (s.items ?? []).map((i: any) => ({
        ...i,
        unitPrice: Number(i.unitPrice),
        subtotal: Number(i.subtotal),
      })),
    }));
  },

  async summaryByProduct(token: string, start: string, end: string) {
    const { data } = await api.get("/summary/items", { headers: auth(token), params: { start, end } });
    return data as Array<{ productId: number; productName: string; quantity: number; total: number }>;
  },
  async summaryByDay(token: string, start: string, end: string) {
    const { data } = await api.get("/summary/days", { headers: auth(token), params: { start, end } });
    return data as Array<{ day: string; total: number; items: number }>;
  },
  // export CSV
  // export CSV com autenticação
  async exportCsv(token: string, start: string, end: string): Promise<Blob> {
    const res = await api.get("/export.csv", {
      headers: auth(token),
      params: { start, end },
      responseType: "blob",
    });
    return res.data as Blob;
  },

  async exportXlsx(token: string, start: string, end: string): Promise<Blob> {
    const res = await api.get("/export.xlsx", {
      headers: auth(token),
      params: { start, end },
      responseType: "blob",
    });
    return res.data as Blob;
  }
};
