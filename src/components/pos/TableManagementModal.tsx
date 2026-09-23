"use client";

import React from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { Utensils, X, Check, Users, Clock, AlertCircle } from "lucide-react";

export function TableManagementModal() {
  const { tables, isTableModalOpen, setIsTableModalOpen, selectedTable, assignCartToTable, freeTable, cart } = usePOS();

  if (!isTableModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#0d131f] border border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Denah Meja Restoran & FnB Dining Room
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono">16 MEJA</span>
              </h3>
              <p className="text-xs text-slate-400">Pilih meja untuk menautkan pesanan dine-in atau membebaskan meja</p>
            </div>
          </div>
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 py-3 border-b border-slate-800/80 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Kosong (Available)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-300">Terisi (Occupied)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-300">Menunggu Tagihan (Billing)</span>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tables.map((tbl) => {
              const isAvailable = tbl.status === "AVAILABLE";
              const isOccupied = tbl.status === "OCCUPIED";
              const isBilling = tbl.status === "BILLING";
              const isCurrentSelected = selectedTable?.id === tbl.id;

              return (
                <div
                  key={tbl.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all select-none ${
                    isCurrentSelected
                      ? "ring-2 ring-amber-400 bg-amber-500/10 border-amber-500/50"
                      : isAvailable
                      ? "bg-[#111827] border-emerald-500/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5"
                      : isOccupied
                      ? "bg-[#1a1710] border-amber-500/40"
                      : "bg-[#0f172a] border-blue-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-white font-mono">{tbl.tableNumber}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isAvailable
                          ? "bg-emerald-500/20 text-emerald-400"
                          : isOccupied
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {tbl.status}
                    </span>
                  </div>

                  <div className="space-y-1 my-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>Kapasitas: {tbl.capacity} Kursi</span>
                    </div>
                    {tbl.occupiedSince && (
                      <div className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Mulai: {tbl.occupiedSince}</span>
                      </div>
                    )}
                    {tbl.activeOrderTotal && (
                      <div className="font-mono text-amber-400 font-bold mt-1 text-xs">
                        Tagihan: {formatRupiah(tbl.activeOrderTotal)}
                      </div>
                    )}
                  </div>

                  {/* Table Action Buttons */}
                  <div className="pt-2 border-t border-slate-800/60 flex gap-1.5 mt-2">
                    {isAvailable ? (
                      <button
                        onClick={() => assignCartToTable(tbl.id)}
                        disabled={cart.length === 0}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white text-[11px] font-bold cursor-pointer transition-all"
                        title={cart.length === 0 ? "Masukkan pesanan ke keranjang dulu" : "Tautkan keranjang ke meja ini"}
                      >
                        Pilih Meja Ini
                      </button>
                    ) : (
                      <button
                        onClick={() => freeTable(tbl.id)}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-[11px] font-semibold cursor-pointer transition-all"
                      >
                        Bebaskan Meja
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-400">
            {selectedTable ? (
              <span className="text-amber-400 font-semibold">
                Meja Aktif Terpilih: <strong>{selectedTable.tableNumber}</strong>
              </span>
            ) : (
              <span>Belum ada meja dipilih untuk pesanan saat ini</span>
            )}
          </div>
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
