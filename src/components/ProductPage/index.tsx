"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductService from "@/services/productAPI";
import ProductManager from "@/components/ProductManager";
import ProductList from "@/components/ProductList";
import styles from "./styles.module.scss";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    if (!token) return;
    const productsFromApi = await ProductService.getProducts(token);
    setProducts(productsFromApi);
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.productManager}>
        <ProductManager
          products={products}
          setProducts={setProducts}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </div>

      <div className={styles.productList}>
        <ProductList
          products={products}
          setProducts={setProducts}
          onEdit={setEditingProduct}
        />
      </div>
    </main>
  );
}
