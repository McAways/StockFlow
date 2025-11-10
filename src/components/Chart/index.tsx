'use client'
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ExcelJS from "exceljs";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import styles from "./page.module.scss";

interface Venda {
  Id: string;
  IdVenda: string;
  Categoria: string;
  Nome: string;
  QtdVendida: number;
  Valor: number;
  QtdEstoqueRestante: number;
}

export default function SalesDashboard() {
  const [dados, setDados] = useState<Venda[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const buffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    const headerRow = worksheet.getRow(1).values as string[];

    const vendas: Venda[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const rowValues = row.values as any[];

      const venda: Venda = {
        Id: rowValues[headerRow.indexOf("Id")],
        IdVenda: rowValues[headerRow.indexOf("Id da venda")],
        Categoria: rowValues[headerRow.indexOf("Categoria")],
        Nome: rowValues[headerRow.indexOf("Nome")],
        QtdVendida: Number(rowValues[headerRow.indexOf("Qtd Vendida")]),
        Valor: Number(rowValues[headerRow.indexOf("Valor")]),
        QtdEstoqueRestante: Number(rowValues[headerRow.indexOf("Qtd em estoque restante")]),
      };

      vendas.push(venda);
    });

    setDados(vendas);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const vendasPorCategoria = Object.values(
    dados.reduce((acc: any, item) => {
      acc[item.Categoria] = acc[item.Categoria] || { name: item.Categoria, value: 0 };
      acc[item.Categoria].value += item.QtdVendida;
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className={styles.salesDashboard}>
      {dados.length === 0 && (
        <div {...getRootProps()} className={styles.dropzone}>
          <input {...getInputProps()} />
          <p>Arraste o arquivo Excel aqui ou clique para selecionar</p>
        </div>
      )}

      {dados.length > 0 && (
        <div className={styles.chartsFlex}>
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h2>Vendas por Categoria</h2>
              <button
                className={styles.closeButton}
                onClick={() => setDados([])}
              >
                ✕
              </button>
            </div>
            <PieChart width={400} height={300}>
              <Pie
                data={vendasPorCategoria}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {vendasPorCategoria.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      )}
    </div>
  );
}
