"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePOS } from "@/context/POSContext";
import { Navbar } from "@/components/Navbar";
import { KitchenStatus } from "@/types/pos";
import { ChefHat, Clock, CheckCircle2, Flame, Play, Check, AlertCircle } from "lucide-react";

export default function KitchenDisplayPage() {
  const { kitchenTickets, updateTicketStatus, toggleKitchenItemFinished } = usePOS();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredTickets = kitchenTickets.filter((t) => {
    if (filterStatus === "ALL") return t.status !== "SERVED";
    return t.status === filterStatus;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#070a12] text-slate-100">
      <Navbar />

      {/* KDS Control Header */}
      <div className="h-14 border-b border-slate-800 bg-[#0d131f] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              Kitchen Display System (KDS)
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono">DAPUR UTAMA</span>
            </h2>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterStatus === "ALL" ? "bg-orange-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Aktif ({kitchenTickets.filter((t) => t.status !== "SERVED").length})
          </button>
          <button
            onClick={() => setFilterStatus("QUEUED")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterStatus === "QUEUED" ? "bg-orange-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Menunggu (Queued)
          </button>
          <button
            onClick={() => setFilterStatus("COOKING")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterStatus === "COOKING" ? "bg-orange-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Sedang Dimasak
          </button>
        </div>
      </div>

      {/* Tickets Board Grid */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        {filteredTickets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <ChefHat className="w-12 h-12 mb-3 stroke-1 opacity-30 text-orange-400" />
            <p className="font-bold text-slate-400">Semua Pesanan Dapur Telah Selesai Disajikan</p>
            <p className="text-[11px] text-slate-500 mt-1">Tiket baru akan otomatis muncul ketika transaksi kasir dibuat.</p>
          </div>
        ) : (
          <div className="flex gap-4 h-full items-start">
            {filteredTickets.map((ticket) => {
              const isQueued = ticket.status === "QUEUED";
              const isCooking = ticket.status === "COOKING";
              const isReady = ticket.status === "READY";

              return (
                <div
                  key={ticket.id}
                  className={`w-80 shrink-0 max-h-full flex flex-col rounded-2xl border shadow-xl transition-all ${
                    isReady
                      ? "bg-[#0b1814] border-emerald-500/50 shadow-emerald-500/5"
                      : isCooking
                      ? "bg-[#1a130b] border-amber-500/50 shadow-amber-500/5"
                      : "bg-[#111827] border-slate-800"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-white font-mono">{ticket.tableNumber}</span>
                      <div className="text-[10px] text-slate-400 font-mono">{ticket.orderNumber}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isReady
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isCooking
                            ? "bg-amber-500/20 text-amber-400 animate-pulse"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-1 font-mono">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{ticket.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
                    {ticket.items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleKitchenItemFinished(ticket.id, idx)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between ${
                          item.isFinished
                            ? "bg-emerald-950/20 border-emerald-500/30 line-through opacity-60 text-slate-400"
                            : "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono text-sm">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                          {item.variantName && (
                            <div className="text-[10px] text-amber-300 font-mono ml-5">
                              {item.variantName}
                            </div>
                          )}
                          {item.notes && (
                            <div className="text-[10px] text-rose-300 italic ml-5 mt-0.5">
                              Catatan: &quot;{item.notes}&quot;
                            </div>
                          )}
                        </div>

                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            item.isFinished ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-600"
                          }`}
                        >
                          {item.isFinished && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Action Controls */}
                  <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 rounded-b-2xl">
                    {isQueued && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, "COOKING")}
                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Mulai Masak</span>
                      </button>
                    )}
                    {isCooking && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, "READY")}
                        className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pesanan Siap Saji</span>
                      </button>
                    )}
                    {isReady && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, "SERVED")}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Sajikan ke Pelanggan (Selesai)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
