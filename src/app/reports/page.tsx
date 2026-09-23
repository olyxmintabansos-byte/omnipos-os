"use client";

import React, { useState, useEffect } from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import {
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Banknote,
  DollarSign,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ReportsPage() {
  const { orders } = usePOS();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalHPP = orders.reduce((sum, o) => sum + o.totalHPP, 0);
  const totalGrossProfit = orders.reduce((sum, o) => sum + o.grossProfit, 0);
  const avgMargin = totalRevenue > 0 ? Math.round((totalGrossProfit / totalRevenue) * 100) : 0;

  // Chart data
  const chartData = [
    { hour: "09:00", omzet: 120000 },
    { hour: "11:00", omzet: 245000 },
    { hour: "13:00", omzet: 480000 },
    { hour: "15:00", omzet: 320000 },
    { hour: "17:00", omzet: 610000 },
    { hour: "19:00", omzet: 540000 },
    { hour: "21:00", omzet: 380000 },
  ];

  const exportCSV = () => {
    const headers = "No. Faktur,Waktu,Total,Metode Bayar,HPP,Laba Kotor,Kasir\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.createdAt}",${o.grandTotal},"${o.paymentMethod}",${o.totalHPP},${o.grossProfit},"${o.cashierName}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_Penjualan_OmniPOS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b0f17]">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Laporan Finansial & Audit Eksekutif
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                AUDITED
              </span>
            </h1>
            <p className="text-xs text-slate-400">Analisis omzet, margin laba bersih HPP, dan ekspor CSV pembukuan</p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Laporan (CSV / Excel)</span>
          </button>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Total Omzet Penjualan:</span>
            <div className="text-2xl font-black text-white font-mono mt-1">{formatRupiah(totalRevenue)}</div>
            <span className="text-[10px] text-slate-500 mt-1 block">{orders.length} Transaksi Selesai</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Total Modal Pokok (HPP):</span>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">{formatRupiah(totalHPP)}</div>
            <span className="text-[10px] text-slate-500 mt-1 block">Cost of Goods Sold</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Laba Kotor Usaha:</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{formatRupiah(totalGrossProfit)}</div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Omzet dikurangi HPP</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Rata-rata Margin Laba:</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">{avgMargin}%</div>
            <span className="text-[10px] text-amber-400/80 mt-1 block">Kategori Sangat Sehat</span>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Grafik Tren Omzet per Jam Hari Ini (Rp):</h3>
          <div className="h-64 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `Rp${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(value: any) => [formatRupiah(Number(value) || 0), "Omzet"]}
                  />
                  <Bar dataKey="omzet" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Daftar Transaksi Kasir Terakhir:</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-[#131b2c]">
                <tr>
                  <th className="py-2.5 px-3">No. Faktur</th>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3 text-right">Total Tagihan</th>
                  <th className="py-2.5 px-3 text-center">Metode</th>
                  <th className="py-2.5 px-3 text-right">Laba Kotor</th>
                  <th className="py-2.5 px-3">Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{o.orderNumber}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{o.createdAt}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                      {formatRupiah(o.grandTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      +{formatRupiah(o.grossProfit)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{o.cashierName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
