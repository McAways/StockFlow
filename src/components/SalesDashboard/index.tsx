// src/components/SalesDashboard/index.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import salesAPI from "@/services/salesAPI";
import {
  PieChart, Pie, Tooltip, Legend, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import styles from "./styles.module.scss";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9C27B0", "#03A9F4", "#4CAF50"];

// helpers
function pad2(n: number) { return n.toString().padStart(2, "0"); }
function toLocalIso(date: string, time: string) {
  // date: "2025-10-30", time: "09:00" -> "2025-10-30T09:00:00"
  return `${date}T${time || "00:00"}:00`;
}
function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function dateDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export default function SalesDashboard() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  // Estado “amigável”: datas e horas separadas
  const [startDate, setStartDate] = useState(() => dateDaysAgo(7));
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState(() => todayDate());
  const [endTime, setEndTime] = useState("23:59");

  const [loading, setLoading] = useState(false);
  const [byProduct, setByProduct] = useState<Array<{ productId: number; productName: string; quantity: number; total: number }>>([]);
  const [byDay, setByDay] = useState<Array<{ day: string; total: number; items: number }>>([]);

  async function load() {
    if (!token) return;

    const start = toLocalIso(startDate, startTime);
    const end = toLocalIso(endDate, endTime);

    // validação simples
    if (new Date(start) > new Date(end)) {
      alert("A data/hora inicial deve ser anterior à final.");
      return;
    }

    setLoading(true);
    try {
      const [prod, days] = await Promise.all([
        salesAPI.summaryByProduct(token, start, end),
        salesAPI.summaryByDay(token, start, end),
      ]);
      setByProduct(prod ?? []);
      setByDay(days ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); // carrega uma vez ao montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // KPIs
  const totals = useMemo(() => {
    const totalValue = byDay.reduce((acc, r) => acc + Number(r.total || 0), 0);
    const totalItems = byDay.reduce((acc, r) => acc + Number(r.items || 0), 0);
    return { totalValue, totalItems };
  }, [byDay]);

  const pieData = useMemo(
    () => byProduct.map((p) => ({ name: p.productName ?? `#${p.productId}`, value: Number(p.total || 0) })),
    [byProduct]
  );

  async function handleExport() {
    if (!token) {
      alert("Você precisa estar logado para exportar o Excel.");
      return;
    }

    const start = toLocalIso(startDate, startTime);
    const end = toLocalIso(endDate, endTime);

    try {
      const blob = await salesAPI.exportXlsx(token, start, end);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `vendas_${startDate}_a_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erro ao exportar Excel:", e);
      alert("Falha ao exportar Excel. Veja o console para mais detalhes.");
    }
  }

  // presets rápidos
  function presetHoje() {
    const d = todayDate();
    setStartDate(d); setStartTime("00:00");
    setEndDate(d); setEndTime("23:59");
  }
  function presetOntem() {
    const d = dateDaysAgo(1);
    setStartDate(d); setStartTime("00:00");
    setEndDate(d); setEndTime("23:59");
  }
  function presetUltimos7() {
    setStartDate(dateDaysAgo(7)); setStartTime("00:00");
    setEndDate(todayDate()); setEndTime("23:59");
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.fieldGroup}>
          <label>Início</label>
          <div className={styles.inline}>
            <input className={styles.inputContainer} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input className={styles.inputContainer} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label>Fim</label>
          <div className={styles.inline}>
            <input className={styles.inputContainer} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <input className={styles.inputContainer} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className={styles.presets}>
          <button className={styles.searchButton} type="button" onClick={presetHoje}>Hoje</button>
          <button className={styles.searchButton} type="button" onClick={presetOntem}>Ontem</button>
          <button className={styles.searchButton} type="button" onClick={presetUltimos7}>Últimos 7 dias</button>
        </div>

        <div className={styles.actions}>
          <button className={styles.searchButton} onClick={load} disabled={loading}>
            {loading ? "Carregando..." : "Buscar"}
          </button>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExport}
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <div className={styles.kpis}>
        <div className={styles.kpiCard}>
          <span>Total vendido</span>
          <strong>R$ {totals.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
        </div>
        <div className={styles.kpiCard}>
          <span>Itens vendidos</span>
          <strong>{totals.totalItems}</strong>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h3>Valor total por produto</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Itens vendidos por dia</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byDay.map(d => ({ period: d.day, items: d.items }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="items" name="Itens vendidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
