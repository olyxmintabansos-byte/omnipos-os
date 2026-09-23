"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import {
  Boxes,
  Warehouse,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  ClipboardList,
  Search,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function InventoryPage() {
  const {
    products,
    warehouses,
    selectedWarehouse,
    setSelectedWarehouse,
    stockMovements,
    addRestock,
    setIsOpnameModalOpen,
  } = usePOS();

  const [search, setSearch] = useState("");
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockProdId, setRestockProdId] = useState(products[0]?.id || "");
  const [restockQty, setRestockQty] = useState(10);
  const [restockCost, setRestockCost] = useState(10000);
  const [restockNotes, setRestockNotes] = useState("");

  const totalAssetValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  const handleConfirmRestock = () => {
    addRestock(restockProdId, restockQty, restockCost, restockNotes);
    setIsRestockOpen(false);
    setRestockNotes("");
  };

  const filteredMovements = stockMovements.filter((m) =>
    m.productName.toLowerCase().includes(search.toLowerCase()) ||
    m.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b0f17]">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header & Warehouse Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Smart Inventory & Multi-Warehouse OS
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
                REAL-TIME
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Pelacak pergerakan stok, perhitungan modal HPP rata-rata, dan multi-lokasi gudang
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedWarehouse.id}
              onChange={(e) => {
                const found = warehouses.find((w) => w.id === e.target.value);
                if (found) setSelectedWarehouse(found);
              }}
              className="bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  📍 {w.name} ({w.location})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsOpnameModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-600/20"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Stock Opname</span>
            </button>

            <button
              onClick={() => setIsRestockOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Restock Masuk</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Total Nilai Aset Stok:</span>
            <div className="text-xl font-extrabold text-white font-mono mt-1">
              {formatRupiah(totalAssetValue)}
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Berdasarkan HPP Pembelian
            </span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Total Varian & SKU Aktif:</span>
            <div className="text-xl font-extrabold text-white font-mono mt-1">
              {products.length} SKU
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Tersedia di katalog POS</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Peringatan Stok Menipis:</span>
            <div className={`text-xl font-extrabold font-mono mt-1 ${lowStockCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {lowStockCount} Produk
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Di bawah batas minimum</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Lokasi Gudang Terpilih:</span>
            <div className="text-base font-bold text-amber-400 mt-1 truncate">
              {selectedWarehouse.name}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{selectedWarehouse.location}</span>
          </div>
        </div>

        {/* Two Columns: Products Stock Table (Left 7 cols) & Movement Logs (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Products Stock Table */}
          <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>Status Stok Katalog</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">{products.length} Item</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="pb-2">Produk</th>
                    <th className="pb-2 text-right">Modal (HPP)</th>
                    <th className="pb-2 text-right">Jual</th>
                    <th className="pb-2 text-center">Stok</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => {
                    const isLow = p.stock <= p.minStockAlert;
                    return (
                      <tr key={p.id} className="hover:bg-slate-900/40">
                        <td className="py-2.5">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{p.sku}</div>
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-300">
                          {formatRupiah(p.costPrice)}
                        </td>
                        <td className="py-2.5 text-right font-mono text-amber-400 font-bold">
                          {formatRupiah(p.price)}
                        </td>
                        <td className="py-2.5 text-center font-mono font-bold text-white">
                          {p.stock}
                        </td>
                        <td className="py-2.5 text-center">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                              Kritis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                              Aman
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Movement History */}
          <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-indigo-400" />
                <span>Log Riwayat Mutasi Stok</span>
              </h2>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
              {filteredMovements.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">Belum ada mutasi stok.</div>
              ) : (
                filteredMovements.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white">{m.productName}</div>
                        <div className="text-[10px] text-slate-400">{m.notes}</div>
                      </div>
                      <span
                        className={`font-mono font-black text-xs ${
                          m.quantity > 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </div>
                    <div className="mt-2 pt-1 border-t border-slate-800 flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{m.warehouseName}</span>
                      <span>{m.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Restock Inbound Modal */}
      {isRestockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0d131f] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Input Barang Masuk (Restock Supplier)</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Pilih Produk:</label>
              <select
                value={restockProdId}
                onChange={(e) => {
                  setRestockProdId(e.target.value);
                  const p = products.find((x) => x.id === e.target.value);
                  if (p) setRestockCost(p.costPrice);
                }}
                className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stok Saat Ini: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Jumlah Masuk:</label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Harga Beli Satuan (Rp):</label>
                <input
                  type="number"
                  value={restockCost}
                  onChange={(e) => setRestockCost(Number(e.target.value))}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Catatan PO / Supplier:</label>
              <input
                type="text"
                placeholder="Misal: Beli dari Supplier Gayo PO #902"
                value={restockNotes}
                onChange={(e) => setRestockNotes(e.target.value)}
                className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsRestockOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRestock}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md"
              >
                Simpan Stok Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
