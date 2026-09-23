"use client";

import React, { useState } from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { PaymentMethod } from "@/types/pos";
import { X, Banknote, QrCode, CreditCard, Clock, Check, ArrowRight } from "lucide-react";

export function PaymentModal() {
  const { isPaymentModalOpen, setIsPaymentModalOpen, cartGrandTotal, processPayment, selectedCustomer } = usePOS();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("TUNAI");
  const [cashTendered, setCashTendered] = useState<number>(cartGrandTotal);

  if (!isPaymentModalOpen) return null;

  const quickPecahan = [
    cartGrandTotal, // Uang Pas
    Math.ceil(cartGrandTotal / 10000) * 10000,
    Math.ceil(cartGrandTotal / 20000) * 20000,
    Math.ceil(cartGrandTotal / 50000) * 50000,
    100000,
    200000,
  ].filter((val, idx, self) => val >= cartGrandTotal && self.indexOf(val) === idx);

  const changeAmount = Math.max(0, cashTendered - cartGrandTotal);
  const isPayDisabled = selectedMethod === "TUNAI" && cashTendered < cartGrandTotal;

  const handleConfirmPay = () => {
    processPayment(selectedMethod, selectedMethod === "TUNAI" ? cashTendered : cartGrandTotal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0d131f] border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Pilih Pembayaran</h3>
            <p className="text-xs text-slate-400">Total Tagihan Transaksi</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-amber-400 font-mono">
              {formatRupiah(cartGrandTotal)}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <button
            onClick={() => setSelectedMethod("TUNAI")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedMethod === "TUNAI"
                ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span>Tunai</span>
          </button>

          <button
            onClick={() => setSelectedMethod("QRIS")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedMethod === "QRIS"
                ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>QRIS</span>
          </button>

          <button
            onClick={() => setSelectedMethod("TRANSFER")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedMethod === "TRANSFER"
                ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Transfer</span>
          </button>

          <button
            onClick={() => setSelectedMethod("KASBON")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedMethod === "KASBON"
                ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Kasbon</span>
          </button>
        </div>

        {/* Method Detail Area */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 my-4">
          {selectedMethod === "TUNAI" && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Nominal Uang Diterima dari Pelanggan:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={cashTendered || ""}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full bg-[#131b2c] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-base font-extrabold text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Quick Pecahan Buttons */}
              <div>
                <span className="text-[10px] text-slate-400 block mb-1.5">Pecahan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPecahan.map((nominal, i) => (
                    <button
                      key={i}
                      onClick={() => setCashTendered(nominal)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-bold cursor-pointer"
                    >
                      {nominal === cartGrandTotal ? "Uang Pas" : formatRupiah(nominal)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kembalian */}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Kembalian Kasir:</span>
                <span className={`text-xl font-black font-mono ${changeAmount > 0 ? "text-emerald-400" : "text-slate-300"}`}>
                  {formatRupiah(changeAmount)}
                </span>
              </div>
            </div>
          )}

          {selectedMethod === "QRIS" && (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-36 h-36 bg-white rounded-xl p-2.5 flex items-center justify-center shadow-lg mb-2">
                <div className="w-full h-full border-2 border-dashed border-slate-900 flex flex-col items-center justify-center text-slate-900">
                  <QrCode className="w-20 h-20" />
                  <span className="text-[8px] font-black tracking-widest mt-1">QRIS STATIS POS</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-white">Scan dengan GoPay, OVO, BCA, Dana</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Kode Ref: QRIS-{Date.now().toString().slice(-6)}</p>
            </div>
          )}

          {selectedMethod === "TRANSFER" && (
            <div className="space-y-2 text-xs">
              <p className="text-slate-300">Pilih Rekening Tujuan Transfer:</p>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Bank BCA</div>
                  <div className="text-[11px] text-slate-400 font-mono">8830-192-881 (Omni Retail)</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">BCA</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Bank Mandiri</div>
                  <div className="text-[11px] text-slate-400 font-mono">132-00-992211-8 (Omni POS)</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold">MANDIRI</span>
              </div>
            </div>
          )}

          {selectedMethod === "KASBON" && (
            <div className="text-xs space-y-2">
              <p className="text-slate-300">Catat sebagai Tagihan Piutang (Kasbon Pelanggan):</p>
              {selectedCustomer ? (
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300">
                  <div className="font-bold">{selectedCustomer.name} ({selectedCustomer.whatsapp})</div>
                  <div className="text-[11px] text-amber-200/80 mt-1">
                    Tagihan senilai {formatRupiah(cartGrandTotal)} akan dicatat ke buku kasbon member ini.
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-[11px]">
                  Peringatan: Harap pilih Member / Pelanggan terlebih dahulu di keranjang untuk transaksi Kasbon!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmPay}
            disabled={isPayDisabled}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>SELESAIKAN TRANSAKSI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
