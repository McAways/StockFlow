// app/(sua rota)/HubPage/page.tsx (ou equivalente)
"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import HeaderBar from "@/components/HeaderBar";
import DriveTable from "@/components/DriveTable";
import Chart from "@/components/Chart";
import ProductManager from "@/components/ProductManager";
import ProductList from "@/components/ProductList";
import SaleForm from "@/components/SaleForm";
import productAPI from "@/services/productAPI";
import type { Product } from "@/types/product";
import SalesDashboard from "@/components/SalesDashboard";
import Image from "next/image";

export default function HubPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const list = await productAPI.getProducts(token);
        setProducts(list);
      } catch (e) {
        console.error("Falha ao carregar produtos:", e);
      }
    }
    load();
  }, [token]);

  return (
    <main className={styles.mainContainer}>

      <Image
        alt=''
        src={'/stockFlow.png'}
        width={700}
        height={700}
        className={styles.systemLogo}
        priority
      />

      <div className={styles.mainContainerTitle}>
        <HeaderBar />
      </div>
      <div className={styles.backgroundFilter}>


        <div className={styles.stageTitle}>
          <h3>Análise de dados</h3>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.driveTableContainer}>
            <DriveTable />
          </div>
          <div>
            <SalesDashboard />
          </div>
        </div>

        <div className={styles.stageTitle2}>
          <h3>Controladores</h3>
        </div>

        <div className={styles.contentContainer}>
          {/* Gerenciamento de produtos (criar/editar) */}
          <div className={styles.productComponentContainer}>
            <ProductManager products={products} setProducts={setProducts} editingProduct={editingProduct} setEditingProduct={setEditingProduct} />
            <ProductList products={products} setProducts={setProducts} onEdit={setEditingProduct} />
            <SaleForm products={products} setProducts={setProducts} />
          </div>

        </div>
      </div>
    </main>
  );
}
