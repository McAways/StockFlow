// src/components/SaleForm/index.tsx
"use client";
import styles from './page.module.scss'
import { useState } from "react";
import { Product } from "@/types/product";
import { SaleCreate } from "@/types/sale";
import salesAPI from "@/services/salesAPI";

export default function SaleForm({
  products,
  setProducts,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}) {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<{ productId: number; quantity: number; unitPrice?: number }[]>([]);
  const [productId, setProductId] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  function addItem() {
    if (!productId || qty <= 0) return;
    const p = products.find(p => p.id === productId);
    if (!p) return;
    setItems(prev => [...prev, { productId, quantity: qty, unitPrice: p.price }]);
    setProductId(0);
    setQty(1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || items.length === 0) return;

    const payload: SaleCreate = { customerName, items };
    const sale = await salesAPI.create(token, payload);

    // baixa estoque local
    setProducts(prev =>
      prev.map(p => {
        const it = sale.items.find(i => i.productId === p.id);
        return it ? { ...p, quantity: p.quantity - it.quantity } : p;
      })
    );

    // limpa form
    setItems([]);
    setCustomerName("");
    alert(`Venda ${sale.id} registrada! Total: R$ ${sale.total.toFixed(2)}`);
  }

  return (
    <div>
      <div className={styles.title}> Contole de Vendas</div>

      <div className={styles.container}>

        <form onSubmit={handleSubmit} className={styles.formInput}>
          <input
            placeholder="Cliente (opcional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={styles.inputContainer}
          />

          <div>
            <select className={styles.inputContainer} value={productId} onChange={(e) => setProductId(Number(e.target.value))}>
              <option value={0} >Selecione um produto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (estoque: {p.quantity})
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className={styles.inputContainer}
            />

            <button className={styles.addButton} type="button" onClick={addItem}>Adicionar item</button>
          </div>

          <ul className={styles.registerList}>
            {items.map((it, idx) => {
              const p = products.find(p => p.id === it.productId);
              return (
                <li key={idx}>
                  {p?.name} - {it.quantity} x R$ {(it.unitPrice ?? p?.price ?? 0).toFixed(2)}
                </li>
              );
            })}
          </ul>

          <button className={styles.registerButton} type="submit">Registrar venda</button>
        </form>
      </div>
    </div>
  );
}
