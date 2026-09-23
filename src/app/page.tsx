"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCatalog } from "@/components/pos/ProductCatalog";
import { CartDrawer } from "@/components/pos/CartDrawer";

export default function POSPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b0f17]">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Area: Product Catalog Grid (65% width) */}
        <div className="flex-1 h-full overflow-hidden no-print">
          <ProductCatalog />
        </div>

        {/* Right Area: Dynamic Cart Drawer (35% width, min 380px) */}
        <div className="w-[380px] lg:w-[420px] shrink-0 h-full overflow-hidden no-print">
          <CartDrawer />
        </div>
      </div>
    </div>
  );
}
