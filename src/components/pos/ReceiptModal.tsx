"use client";

import React from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { Printer, CheckCircle2, X } from "lucide-react";

export function ReceiptModal() {
  const { activeReceiptOrder, setActiveReceiptOrder } = usePOS();

  if (!activeReceiptOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0e1422] border border-slate-800 rounded-2xl shadow-2xl p-6 relative flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">Transaksi Berhasil!</h3>
        <p className="text-xs text-slate-400 mb-4">Struk Belanja Kasir Siap Dicetak</p>

        {/* Thermal Receipt Paper Layout */}
        <div
          id="thermal-receipt"
          className="w-full bg-white text-slate-900 rounded-xl p-4 font-mono text-[11px] shadow-inner border border-slate-200 leading-tight select-text mb-4"
        >
          <div className="text-center pb-2 border-b border-dashed border-slate-300">
            <h4 className="font-extrabold text-sm tracking-wider">OMNIPOS & RETAIL OS</h4>
            <p className="text-[10px] text-slate-600">Jl. Jenderal Sudirman No. 88, Jakarta</p>
            <p className="text-[10px] text-slate-600">Telp/WA: 0812-8899-7721</p>
          </div>

          <div className="py-2 border-b border-dashed border-slate-300 text-[10px] space-y-0.5">
            <div className="flex justify-between">
              <span>No. Faktur:</span>
              <span className="font-bold">{activeReceiptOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{activeReceiptOrder.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{activeReceiptOrder.cashierName}</span>
            </div>
            {activeReceiptOrder.customer && (
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="font-semibold">{activeReceiptOrder.customer.name}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="py-2 border-b border-dashed border-slate-300 space-y-1.5">
            {activeReceiptOrder.items.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold">
                  <span>{item.name}</span>
                  <span>{formatRupiah(item.finalPrice * item.quantity)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>
                    {item.quantity} x {formatRupiah(item.finalPrice)}
                    {item.selectedVariant && ` (${item.selectedVariant.name})`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal, Tax, Total */}
          <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(activeReceiptOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>PPN (11%):</span>
              <span>{formatRupiah(activeReceiptOrder.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service (5%):</span>
              <span>{formatRupiah(activeReceiptOrder.serviceCharge)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-slate-200">
              <span>TOTAL:</span>
              <span>{formatRupiah(activeReceiptOrder.grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bayar ({activeReceiptOrder.paymentMethod}):</span>
              <span>{formatRupiah(activeReceiptOrder.amountPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembalian:</span>
              <span>{formatRupiah(activeReceiptOrder.change)}</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[9px] text-slate-500">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-2">
          <button
            onClick={() => setActiveReceiptOrder(null)}
            className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Transaksi Baru
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
