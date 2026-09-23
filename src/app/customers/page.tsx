"use client";

import React, { useState } from "react";
import { usePOS } from "@/context/POSContext";
import { formatRupiah } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Customer } from "@/types/pos";
import { Users, UserPlus, Award, Search, CreditCard, Sparkles } from "lucide-react";

export default function CustomersPage() {
  const { customers, addCustomer } = usePOS();
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newWA, setNewWA] = useState("");
  const [newTier, setNewTier] = useState<Customer["tier"]>("Bronze");
  const [newDeposit, setNewDeposit] = useState(50000);

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.whatsapp.includes(search);
    const matchTier = selectedTier === "ALL" || c.tier === selectedTier;
    return matchSearch && matchTier;
  });

  const handleSaveCustomer = () => {
    if (!newName || !newWA) return;
    addCustomer(newName, newWA, newTier, newDeposit);
    setNewName("");
    setNewWA("");
    setIsAddOpen(false);
  };

  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const totalDeposit = customers.reduce((sum, c) => sum + c.depositBalance, 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b0f17]">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              CRM & Loyalitas Pelanggan
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
                MEMBERSHIP OS
              </span>
            </h1>
            <p className="text-xs text-slate-400">Database member pelanggan, poin belanja reward & saldo deposit</p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Member Baru</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Total Member Terdaftar:</span>
            <div className="text-2xl font-black text-white font-mono mt-1">{customers.length} Orang</div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Aktif Bertransaksi</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Total Poin Loyalitas:</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">{totalPoints} Pts</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Reward Siap Ditukar</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Total Saldo Deposit Member:</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{formatRupiah(totalDeposit)}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Prabayar Mengendap</span>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400">Member Platinum / VIP:</span>
            <div className="text-2xl font-black text-purple-400 font-mono mt-1">
              {customers.filter((c) => c.tier === "Platinum").length} Member
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Tier Belanja Tertinggi</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pelanggan atau nomor WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
            />
          </div>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-[#111827] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
          >
            <option value="ALL">Semua Tier</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
        </div>

        {/* Customers Table */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-[#131b2c]">
              <tr>
                <th className="py-3 px-4">Nama Pelanggan</th>
                <th className="py-3 px-4">No. WhatsApp</th>
                <th className="py-3 px-4 text-center">Tier</th>
                <th className="py-3 px-4 text-center">Poin Reward</th>
                <th className="py-3 px-4 text-right">Saldo Deposit</th>
                <th className="py-3 px-4 text-right">Total Akumulasi Belanja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{c.whatsapp}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        c.tier === "Platinum"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : c.tier === "Gold"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : c.tier === "Silver"
                          ? "bg-slate-400/20 text-slate-300"
                          : "bg-orange-800/20 text-orange-400"
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">{c.points} Pts</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatRupiah(c.depositBalance)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    {formatRupiah(c.totalSpent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d131f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Daftarkan Member Baru</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Nama Lengkap:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Misal: Andi Wijaya"
                className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">No. WhatsApp / HP:</label>
              <input
                type="text"
                value={newWA}
                onChange={(e) => setNewWA(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tier Awal:</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as any)}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Deposit Awal (Rp):</label>
                <input
                  type="number"
                  value={newDeposit}
                  onChange={(e) => setNewDeposit(Number(e.target.value))}
                  className="w-full bg-[#131b2c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Batal</button>
              <button onClick={handleSaveCustomer} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs">Simpan Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
