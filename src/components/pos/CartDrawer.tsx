"use client";

import React from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  User,
  CreditCard,
  Tag,
  MessageSquare,
} from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    setIsPaymentModalOpen,
    cartSubtotal,
    cartTax,
    cartService,
    cartGrandTotal,
    updateCartItemNotes,
  } = usePOS();

  return (
    <div className="flex flex-col h-full bg-[#0d131f] border-l border-slate-800 select-none">
      {/* Header */}
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white">Keranjang Pesanan</h2>
            <p className="text-[10px] text-slate-400">{cart.length} Jenis Menu Dipilih</p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Customer Picker */}
      <div className="p-3 border-b border-slate-800/80 bg-[#101726] shrink-0">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <User className="w-3 h-3 text-amber-400" /> Pelanggan / Member:
          </span>
          {selectedCustomer && (
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
              {selectedCustomer.tier} ({selectedCustomer.points} Poin)
            </span>
          )}
        </div>
        <select
          value={selectedCustomer?.id || ""}
          onChange={(e) => {
            const found = customers.find((c) => c.id === e.target.value) || null;
            setSelectedCustomer(found);
          }}
          className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="">-- Tamu Reguler (Non-Member) --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.whatsapp}) - {c.tier}
            </option>
          ))}
        </select>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6">
            <ShoppingCart className="w-12 h-12 mb-3 stroke-1 opacity-30 text-amber-400" />
            <p className="font-semibold text-slate-400">Keranjang Masih Kosong</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Klik menu di sebelah kiri untuk memasukkan pesanan pelanggan.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-[#131b2c] border border-slate-800/80 flex flex-col gap-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                  {item.selectedVariant && (
                    <span className="text-[10px] text-amber-400 font-mono">
                      + {item.selectedVariant.name}
                    </span>
                  )}
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {formatRupiah(item.finalPrice)}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                  title="Hapus menu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Notes Input */}
              <div className="flex items-center gap-1.5 text-[10px] bg-slate-900/60 rounded-lg px-2 py-1 border border-slate-800/60">
                <MessageSquare className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Catatan pesanan (misal: manis dikit)..."
                  value={item.notes || ""}
                  onChange={(e) => updateCartItemNotes(item.id, e.target.value)}
                  className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                <div className="flex items-center gap-1.5 bg-[#0b0f17] border border-slate-800 rounded-lg p-0.5">
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-400 font-mono">
                    {formatRupiah(item.finalPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Checkout */}
      <div className="p-4 border-t border-slate-800 bg-[#101726] shrink-0 space-y-2">
        <div className="space-y-1 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal Menu</span>
            <span className="font-mono text-slate-200">{formatRupiah(cartSubtotal)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>PB1 / PPN Resto (11%)</span>
            <span className="font-mono text-slate-300">{formatRupiah(cartTax)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>Service Charge (5%)</span>
            <span className="font-mono text-slate-300">{formatRupiah(cartService)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
          <span className="text-xs font-bold text-white">Total Tagihan:</span>
          <span className="text-lg font-extrabold text-amber-400 font-mono">
            {formatRupiah(cartGrandTotal)}
          </span>
        </div>

        <button
          onClick={() => setIsPaymentModalOpen(true)}
          disabled={cart.length === 0}
          className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <CreditCard className="w-4 h-4 text-slate-950" />
          <span>PROSES BAYAR ({formatRupiah(cartGrandTotal)})</span>
        </button>
      </div>
    </div>
  );
}
