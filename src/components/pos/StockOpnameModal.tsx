"use client";

import React, { useState } from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { ClipboardList, X, Check, AlertTriangle, ArrowRight } from "lucide-react";

export function StockOpnameModal() {
  const { products, isOpnameModalOpen, setIsOpnameModalOpen, applyStockOpname, selectedWarehouse } = usePOS();
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    products.forEach((p) => {
      initial[p.id] = p.stock;
    });
    return initial;
  });
  const [notes, setNotes] = useState<Record<string, string>>({});

  if (!isOpnameModalOpen) return null;

  const handleCountChange = (productId: string, val: number) => {
    setCounts((prev) => ({ ...prev, [productId]: Math.max(0, val) }));
  };

  const handleApply = () => {
    const adjustments = products
      .filter((p) => counts[p.id] !== undefined && counts[p.id] !== p.stock)
      .map((p) => ({
        productId: p.id,
        physicalCount: counts[p.id],
        notes: notes[p.id] || "Penyesuaian Stock Opname Rutin",
      }));

    if (adjustments.length > 0) {
      applyStockOpname(adjustments);
    }
    setIsOpnameModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-[#0d131f] border border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Stock Opname Fisik vs Sistem
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  {selectedWarehouse.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Koreksi perbedaan stok riil di gudang dengan catatan komputer</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpnameModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Products Table */}
        <div className="flex-1 overflow-y-auto py-3">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-[#101726] sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Produk / SKU</th>
                <th className="py-2.5 px-2 text-center">Stok Sistem</th>
                <th className="py-2.5 px-2 text-center w-28">Hitung Fisik</th>
                <th className="py-2.5 px-2 text-center">Selisih</th>
                <th className="py-2.5 px-3">Alasan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p) => {
                const physical = counts[p.id] !== undefined ? counts[p.id] : p.stock;
                const diff = physical - p.stock;

                return (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.sku}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-300">
                      {p.stock} {p.unit}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={physical}
                        onChange={(e) => handleCountChange(p.id, Number(e.target.value))}
                        className="w-20 bg-[#131b2c] border border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold">
                      {diff === 0 ? (
                        <span className="text-slate-500">Pas (0)</span>
                      ) : diff > 0 ? (
                        <span className="text-emerald-400">+{diff}</span>
                      ) : (
                        <span className="text-rose-400">{diff}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        placeholder="Contoh: pecah / kadaluarsa..."
                        value={notes[p.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })}
                        className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 text-slate-300 text-[11px] py-0.5 focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center shrink-0">
          <p className="text-[11px] text-slate-400">
            Perubahan akan otomatis mencatat riwayat ke log mutasi stok & menyelaraskan saldo sistem.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpnameModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
            >
              Simpan & Rekonsiliasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
