"use client";

import React from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { Search, Barcode, Plus, AlertTriangle, Coffee, Utensils, ShoppingBag } from "lucide-react";

export function ProductCatalog() {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, addToCart } = usePOS();

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
      {/* Top Bar: Search & Barcode Scan */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu, kode SKU, atau scan barcode..."
            className="w-full bg-[#131b2c] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
        </div>

        <button
          onClick={() => {
            // Quick demo barcode lookup
            const randomProd = products[Math.floor(Math.random() * products.length)];
            setSearchQuery(randomProd.barcode);
          }}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-[#131b2c] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0"
          title="Simulasi scan barcode via scanner / kamera"
        >
          <Barcode className="w-4 h-4 text-amber-400" />
          <span>Scan Barcode</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 shrink-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-[#131b2c] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
            <ShoppingBag className="w-10 h-10 mb-2 stroke-1 opacity-50" />
            <p>Tidak ada produk ditemukan untuk kriteria ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((prod) => {
              const isLowStock = prod.stock <= prod.minStockAlert && prod.stock > 0;
              const isOutOfStock = prod.stock === 0;

              return (
                <div
                  key={prod.id}
                  onClick={() => !isOutOfStock && addToCart(prod)}
                  className={`group bg-[#111827] border rounded-2xl p-3 flex flex-col justify-between transition-all duration-150 relative select-none ${
                    isOutOfStock
                      ? "opacity-40 border-slate-800 cursor-not-allowed"
                      : "border-slate-800/80 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer active:scale-[0.98]"
                  }`}
                >
                  {/* Top Badge: Stock Indicator */}
                  <div className="flex items-center justify-between text-[10px] mb-2">
                    <span className="font-mono text-slate-400 font-medium">{prod.sku}</span>
                    {isOutOfStock ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40 font-bold">
                        Habis
                      </span>
                    ) : isLowStock ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-2.5 h-2.5" /> Sisa {prod.stock}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        Stok: {prod.stock}
                      </span>
                    )}
                  </div>

                  {/* Icon & Category Visual */}
                  <div
                    className={`w-full h-20 rounded-xl bg-gradient-to-br ${prod.imageColor} flex items-center justify-center text-white mb-2 shadow-inner`}
                  >
                    {prod.category === "Kopi" ? (
                      <Coffee className="w-8 h-8 opacity-90 group-hover:scale-110 transition-transform" />
                    ) : prod.category === "Makanan" ? (
                      <Utensils className="w-8 h-8 opacity-90 group-hover:scale-110 transition-transform" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 opacity-90 group-hover:scale-110 transition-transform" />
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {prod.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                      <span className="text-xs font-extrabold text-amber-400 font-mono">
                        {formatRupiah(prod.price)}
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
