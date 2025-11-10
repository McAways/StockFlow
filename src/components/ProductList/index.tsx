"use client";
import styles from "./page.module.scss";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onEdit: (product: Product) => void; // ✅ novo callback
}

export default function ProductList({ products, setProducts, onEdit }: ProductListProps) {

  return (
    <div>
      <div className={styles.title}>Lista de Produtos</div>
      <main className={styles.container}>

        <div className={styles.productGrid}>
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={product.id ?? `p-${index}`} className={styles.card}>
                {product.imageBase64 && (
                  <img src={product.imageBase64} alt={product.name} />
                )}

                <h3>{product.name}</h3>
                <p>R$ {Number(product.price).toFixed(2)}</p>
                <p>{product.quantity} unidades</p>

                <div className={styles.cardButtons}>
                  <button className={styles.editBtn} onClick={() => onEdit(product)}>Editar</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => {
                      if (confirm("Excluir este produto?")) {
                        setProducts(prev => prev.filter(p => p.id !== product.id));
                      }
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto cadastrado.</p>
          )}
        </div>
      </main>
    </div>
  );
}
