"use client";

import React, { useState } from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { ProductVariant } from "@/types/pos";
import { X, Check } from "lucide-react";

export function VariantModal() {
  const { variantModalProduct, setVariantModalProduct, addToCart } = usePOS();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  if (!variantModalProduct || !variantModalProduct.variants) return null;

  const handleConfirm = () => {
    addToCart(variantModalProduct, selectedVariant);
    setVariantModalProduct(null);
    setSelectedVariant(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#0d131f] border border-slate-800 rounded-2xl shadow-2xl p-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">{variantModalProduct.name}</h3>
            <p className="text-xs text-slate-400">Pilih varian atau rasa menu</p>
          </div>
          <button
            onClick={() => setVariantModalProduct(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3 space-y-2">
          {variantModalProduct.variants.map((v) => {
            const isSelected = selectedVariant?.id === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-500 text-white shadow-sm"
                    : "bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-amber-500 bg-amber-500 text-slate-950" : "border-slate-600"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="font-semibold">{v.name}</span>
                </div>
                <span className="font-mono text-amber-400 font-bold">
                  {v.priceAdjustment > 0 ? `+${formatRupiah(v.priceAdjustment)}` : "Gratis"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={() => setVariantModalProduct(null)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Tambahkan ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
