import type { Metadata } from "next";
import "./globals.css";
import { POSProvider } from "@/context/POSContext";
import { PaymentModal } from "@/components/pos/PaymentModal";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { VariantModal } from "@/components/pos/VariantModal";
import { TableManagementModal } from "@/components/pos/TableManagementModal";
import { StockOpnameModal } from "@/components/pos/StockOpnameModal";
import { CashDrawerModal } from "@/components/pos/CashDrawerModal";

export const metadata: Metadata = {
  title: "OmniPOS & Retail OS - Enterprise Point-of-Sale & Store Management",
  description: "Offline-First Enterprise POS, Inventory, FnB Table Management, and Executive Financial Ledger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#0b0f17] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <POSProvider>
          {children}
          <PaymentModal />
          <ReceiptModal />
          <VariantModal />
          <TableManagementModal />
          <StockOpnameModal />
          <CashDrawerModal />
        </POSProvider>
      </body>
    </html>
  );
}
