"use client";

import React, { useState } from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { CashExpense } from "@/types/pos";
import { Layers, X, Banknote, Plus, CheckCircle2, AlertTriangle, Printer, Clock } from "lucide-react";

export function CashDrawerModal() {
  const {
    currentShift,
    isCashDrawerModalOpen,
    setIsCashDrawerModalOpen,
    cashExpenses,
    recordCashExpense,
    closeShift,
  } = usePOS();

  const [activeTab, setActiveTab] = useState<"STATUS" | "EXPENSE" | "CLOSE">("STATUS");
  const [expenseAmount, setExpenseAmount] = useState(15000);
  const [expenseCategory, setExpenseCategory] = useState<CashExpense["category"]>("Operasional Toko");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [actualCash, setActualCash] = useState<number>(currentShift.expectedCashInDrawer);
  const [closingReport, setClosingReport] = useState<any>(null);

  if (!isCashDrawerModalOpen) return null;

  const handleSaveExpense = () => {
    if (!expenseDesc || expenseAmount <= 0) return;
    recordCashExpense(expenseAmount, expenseCategory, expenseDesc);
    setExpenseDesc("");
    setActiveTab("STATUS");
  };

  const handleExecuteClose = () => {
    const report = closeShift(actualCash);
    setClosingReport(report);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0d131f] border border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Manajemen Shift & Laci Kas (Cash Drawer)
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  {currentShift.status}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Rekonsiliasi uang fisik kasir, pengeluaran darurat & Laporan Z</p>
            </div>
          </div>
          <button
            onClick={() => setIsCashDrawerModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 my-3 border-b border-slate-800 pb-2 text-xs shrink-0">
          <button
            onClick={() => setActiveTab("STATUS")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "STATUS" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Status Kas Saat Ini
          </button>
          <button
            onClick={() => setActiveTab("EXPENSE")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "EXPENSE" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            + Catat Kas Keluar
          </button>
          <button
            onClick={() => setActiveTab("CLOSE")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "CLOSE" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Tutup Kasir (Closing Shift)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === "STATUS" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Modal Kas Awal Buka:</span>
                  <div className="text-lg font-black text-white font-mono mt-1">
                    {formatRupiah(currentShift.startingCash)}
                  </div>
                  <span className="text-[10px] text-slate-500">Jam Buka: {currentShift.openedAt}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Total Penjualan Tunai:</span>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                    +{formatRupiah(currentShift.totalCashSales)}
                  </div>
                  <span className="text-[10px] text-slate-500">Masuk ke laci</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Total Pengeluaran Kas:</span>
                  <div className="text-lg font-black text-rose-400 font-mono mt-1">
                    -{formatRupiah(currentShift.cashOutflow)}
                  </div>
                  <span className="text-[10px] text-slate-500">{cashExpenses.length} Pengeluaran</span>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30">
                  <span className="text-xs text-amber-300 font-semibold">Total Seharusnya di Laci:</span>
                  <div className="text-lg font-black text-amber-400 font-mono mt-1">
                    {formatRupiah(currentShift.expectedCashInDrawer)}
                  </div>
                  <span className="text-[10px] text-amber-300/80">Wajib cocok saat tutup kasir</span>
                </div>
              </div>

              {/* Expense History */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">Riwayat Kas Keluar Shift Ini:</h4>
                <div className="space-y-1.5">
                  {cashExpenses.map((exp) => (
                    <div key={exp.id} className="p-2.5 rounded-xl bg-[#111827] border border-slate-800 flex justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{exp.description}</div>
                        <div className="text-[10px] text-slate-400">{exp.category} • {exp.timestamp}</div>
                      </div>
                      <span className="font-mono font-bold text-rose-400">
                        -{formatRupiah(exp.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "EXPENSE" && (
            <div className="space-y-3 bg-[#111827] p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-white">Input Pengeluaran Kas Kecil (Petty Cash):</h4>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kategori Pengeluaran:</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Operasional Toko">Operasional Toko (Es Batu, Kantong Kresek, Sabun)</option>
                  <option value="Bahan Baku">Bahan Baku Darurat (Beli Gas LPG, Bumbu Habis)</option>
                  <option value="Bensin & Kurir">Bensin & Kurir Antar</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nominal Uang Keluar (Rp):</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Deskripsi / Keterangan:</label>
                <input
                  type="text"
                  placeholder="Misal: Beli 2 sak es batu kristal"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                onClick={handleSaveExpense}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs mt-2"
              >
                Simpan Kas Keluar
              </button>
            </div>
          )}

          {activeTab === "CLOSE" && (
            <div className="space-y-4">
              {closingReport ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Laporan Z (Tutup Kasir Selesai)</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex justify-between"><span>Kasir:</span><span className="font-bold">{closingReport.cashierName}</span></div>
                    <div className="flex justify-between"><span>Waktu Tutup:</span><span>{closingReport.closedAt}</span></div>
                    <div className="flex justify-between"><span>Total Seharusnya:</span><span className="font-mono">{formatRupiah(closingReport.expectedCashInDrawer)}</span></div>
                    <div className="flex justify-between"><span>Uang Fisik Dihitung:</span><span className="font-mono">{formatRupiah(closingReport.actualCashInDrawer)}</span></div>
                    <div className="flex justify-between font-bold pt-2 border-t border-slate-800">
                      <span>Selisih Rekonsiliasi:</span>
                      <span className={`font-mono ${closingReport.discrepancy === 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {formatRupiah(closingReport.discrepancy)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Laporan Z</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white">Hitung Uang Fisik di Dalam Laci Kasir:</h4>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Uang Fisik Terhitung Riil (Rp):</label>
                    <input
                      type="number"
                      value={actualCash}
                      onChange={(e) => setActualCash(Number(e.target.value))}
                      className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-base font-black text-white font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 text-xs flex justify-between items-center">
                    <span className="text-slate-400">Selisih Kas:</span>
                    <span className={`font-mono font-bold ${actualCash - currentShift.expectedCashInDrawer === 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {formatRupiah(actualCash - currentShift.expectedCashInDrawer)}
                    </span>
                  </div>

                  <button
                    onClick={handleExecuteClose}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/20"
                  >
                    Konfirmasi Tutup Kasir & Kunci Shift
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
