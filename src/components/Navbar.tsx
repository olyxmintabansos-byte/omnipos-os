"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { Store, UserCheck, Layers, Utensils, Boxes, ChefHat, Users, TrendingUp } from "lucide-react";

export function Navbar() {
  const { currentShift, setIsTableModalOpen, setIsCashDrawerModalOpen, selectedTable } = usePOS();
  const pathname = usePathname();

  const isPOS = pathname === "/";
  const isInventory = pathname === "/inventory";
  const isKDS = pathname === "/kds";
  const isCustomers = pathname === "/customers";
  const isReports = pathname === "/reports";

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0d131f] flex items-center justify-between px-6 z-30 select-none shrink-0 no-print">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
              OmniPOS <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">RETAIL OS</span>
            </h1>
            <p className="text-[10px] text-slate-400">Enterprise Point-of-Sale, Stock & KDS</p>
          </div>
        </Link>
      </div>

      {/* Middle Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[#111827] border border-slate-800 p-1 rounded-xl text-xs">
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            isPOS ? "bg-amber-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Kasir POS</span>
        </Link>

        <button
          onClick={() => setIsTableModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white cursor-pointer transition-all"
        >
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
          <span>Denah Meja</span>
          {selectedTable && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
              {selectedTable.tableNumber}
            </span>
          )}
        </button>

        <Link
          href="/inventory"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            isInventory ? "bg-amber-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Gudang</span>
        </Link>

        <Link
          href="/kds"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            isKDS ? "bg-amber-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <ChefHat className="w-3.5 h-3.5 text-orange-400" />
          <span>Dapur KDS</span>
        </Link>

        <Link
          href="/customers"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            isCustomers ? "bg-amber-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>Member CRM</span>
        </Link>

        <Link
          href="/reports"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            isReports ? "bg-amber-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Laporan</span>
        </Link>
      </div>

      {/* Cash Drawer & Shift Stats */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={() => setIsCashDrawerModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2c] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-all"
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Laci: <strong className="text-amber-400 font-mono">{formatRupiah(currentShift.expectedCashInDrawer)}</strong></span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2c] border border-slate-800 text-slate-300">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>{currentShift.cashierName}</span>
        </div>
      </div>
    </header>
  );
}
