// ProductManager.tsx
"use client";

import { useEffect, useState } from "react";
import ProductService from "@/services/productAPI";
import styles from "./page.module.scss";
import type { Product, ProductForm } from "@/types/product";

interface ProductManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  editingProduct: Product | null;                         // 👈 novo
  setEditingProduct: (p: Product | null) => void;         // 👈 novo
}

export default function ProductManager({
  products,
  setProducts,
  editingProduct,
  setEditingProduct,
}: ProductManagerProps) {
  const [form, setForm] = useState<ProductForm>({
    id: undefined,
    name: "",
    quantity: 0,
    price: 0,
    imageBase64: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  // Preenche o form quando um produto é selecionado para edição
  useEffect(() => {
    if (editingProduct) {
      setForm({
        id: editingProduct.id,
        name: editingProduct.name,
        quantity: editingProduct.quantity,
        price: Number(editingProduct.price ?? 0),
        imageBase64: editingProduct.imageBase64 ?? "",
      });
      setImagePreview(editingProduct.imageBase64 ?? null);
    }
  }, [editingProduct]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    const isEdit = !!form.id;

    const payload = {
      name: form.name,
      quantity: form.quantity,
      price: form.price,
      imageBase64: form.imageBase64 || undefined,
    };

    const saved = isEdit
      ? await ProductService.updateProduct(token, form.id!, payload)
      : await ProductService.createProduct(token, payload);

    // normaliza number
    saved.price = Number(saved.price);

    // atualiza lista
    setProducts(prev =>
      isEdit
        ? prev.map(p => (p.id === saved.id ? saved : p))
        : [...prev, saved]
    );

    // limpa edição + form
    handleCancelEdit();
  }

  function handleCancelEdit() {
    setEditingProduct(null);
    setForm({ id: undefined, name: "", quantity: 0, price: 0, imageBase64: "" });
    setImagePreview(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(prev => ({ ...prev, imageBase64: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {form.id ? "Editar Produto" : "Gerenciar Produtos"}
      </h2>

      <form onSubmit={handleSave} className={styles.form}>
        <input
          type="text"
          placeholder="Produto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className={styles.input}
        />

        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          required
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Preço"
          value={
            form.price
              ? form.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              : ""
          }
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, "");
            const value = Number(raw) / 100;
            setForm({ ...form, price: value });
          }}
          required
          className={styles.input}
        />

        <div className={styles.imageUpload}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" className={styles.preview} />}
        </div>

        <div className={styles.actionsRow}>
          <button type="submit" className={styles.submitBtn}>
            {form.id ? "Salvar alterações" : "Adicionar Produto"}
          </button>

          {form.id && (
            <button type="button" className={styles.deleteBtn} onClick={handleCancelEdit}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
