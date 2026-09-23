"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  CartItem,
  Order,
  Customer,
  CashShift,
  PaymentMethod,
  ProductVariant,
  ProductCategory,
  Warehouse,
  StockMovement,
  RestaurantTable,
  KitchenTicket,
  KitchenStatus,
  CashExpense,
} from "@/types/pos";

const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "ES-KOPI-GAYO",
    barcode: "8991001001",
    name: "Kopi Susu Gayo Aren",
    category: "Kopi",
    price: 22000,
    costPrice: 8500,
    stock: 85,
    minStockAlert: 15,
    unit: "Cup",
    imageColor: "from-amber-700 to-amber-900",
    variants: [
      { id: "var-1", name: "Less Sugar", priceAdjustment: 0 },
      { id: "var-2", name: "Extra Shot Espresso", priceAdjustment: 5000 },
      { id: "var-3", name: "Size Large (22oz)", priceAdjustment: 4000 },
    ],
  },
  {
    id: "prod-2",
    sku: "AMERICANO-HOT",
    barcode: "8991001002",
    name: "Americano Hot / Iced",
    category: "Kopi",
    price: 18000,
    costPrice: 5000,
    stock: 120,
    minStockAlert: 20,
    unit: "Cup",
    imageColor: "from-stone-700 to-stone-900",
    variants: [
      { id: "var-4", name: "Iced (Dingin)", priceAdjustment: 2000 },
      { id: "var-5", name: "Hot (Panas)", priceAdjustment: 0 },
    ],
  },
  {
    id: "prod-3",
    sku: "MATCHA-LATTE",
    barcode: "8991001003",
    name: "Kyoto Matcha Latte",
    category: "Minuman",
    price: 26000,
    costPrice: 11000,
    stock: 45,
    minStockAlert: 10,
    unit: "Cup",
    imageColor: "from-emerald-700 to-emerald-900",
    variants: [{ id: "var-6", name: "Oat Milk Swap", priceAdjustment: 6000 }],
  },
  {
    id: "prod-4",
    sku: "NASI-GORENG-SPESIAL",
    barcode: "8992001001",
    name: "Nasi Goreng Wagyu Kecombrang",
    category: "Makanan",
    price: 45000,
    costPrice: 19000,
    stock: 30,
    minStockAlert: 8,
    unit: "Porsi",
    imageColor: "from-orange-700 to-red-900",
    variants: [
      { id: "var-7", name: "Level Pedas Sedang", priceAdjustment: 0 },
      { id: "var-8", name: "Level Pedas Gila", priceAdjustment: 2000 },
      { id: "var-9", name: "Tambah Telur Ceplok", priceAdjustment: 4000 },
    ],
  },
  {
    id: "prod-5",
    sku: "MIE-ACEH-SEAFOOD",
    barcode: "8992001002",
    name: "Mie Aceh Tumis Kepiting",
    category: "Makanan",
    price: 48000,
    costPrice: 21000,
    stock: 22,
    minStockAlert: 5,
    unit: "Porsi",
    imageColor: "from-red-800 to-amber-900",
  },
  {
    id: "prod-6",
    sku: "CROISSANT-ALMOND",
    barcode: "8993001001",
    name: "Almond Butter Croissant",
    category: "Snack",
    price: 28000,
    costPrice: 12000,
    stock: 14,
    minStockAlert: 10,
    unit: "Pcs",
    imageColor: "from-yellow-700 to-amber-800",
  },
  {
    id: "prod-7",
    sku: "KENTANG-TRUFFLE",
    barcode: "8993001002",
    name: "Truffle Fries with Parmesan",
    category: "Snack",
    price: 32000,
    costPrice: 13000,
    stock: 50,
    minStockAlert: 12,
    unit: "Porsi",
    imageColor: "from-amber-600 to-orange-800",
  },
  {
    id: "prod-8",
    sku: "BIJI-KOPI-ARABIKA",
    barcode: "8994001001",
    name: "Roasted Beans Arabika 250g",
    category: "Retail",
    price: 85000,
    costPrice: 48000,
    stock: 18,
    minStockAlert: 5,
    unit: "Pack",
    imageColor: "from-stone-800 to-neutral-900",
  },
  {
    id: "prod-9",
    sku: "TUMBLER-STAINLESS",
    barcode: "8994001002",
    name: "Thermal Tumbler 500ml Hitam",
    category: "Retail",
    price: 135000,
    costPrice: 75000,
    stock: 8,
    minStockAlert: 5,
    unit: "Pcs",
    imageColor: "from-slate-700 to-slate-900",
  },
];

const SEED_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Budi Santoso", whatsapp: "081299887766", points: 420, depositBalance: 50000, tier: "Gold", joinedDate: "12 Jan 2026", totalSpent: 1240000 },
  { id: "cust-2", name: "Siti Rahmawati", whatsapp: "085711223344", points: 180, depositBalance: 0, tier: "Silver", joinedDate: "03 Feb 2026", totalSpent: 540000 },
  { id: "cust-3", name: "Dimas Anggara", whatsapp: "081344556677", points: 65, depositBalance: 120000, tier: "Bronze", joinedDate: "18 Mar 2026", totalSpent: 220000 },
  { id: "cust-4", name: "Jessica Tan", whatsapp: "081900112233", points: 1250, depositBalance: 350000, tier: "Platinum", joinedDate: "20 Nov 2025", totalSpent: 4180000 },
];

const SEED_ORDERS: Order[] = [
  {
    id: "ord-seed-1",
    orderNumber: "INV-20260923-1001",
    createdAt: "10:15",
    items: [
      { id: "c-1", productId: "prod-1", name: "Kopi Susu Gayo Aren", basePrice: 22000, costPrice: 8500, quantity: 2, itemDiscountPercent: 0, finalPrice: 22000 },
      { id: "c-2", productId: "prod-6", name: "Almond Butter Croissant", basePrice: 28000, costPrice: 12000, quantity: 1, itemDiscountPercent: 0, finalPrice: 28000 },
    ],
    subtotal: 72000,
    tax: 7920,
    serviceCharge: 3600,
    discountAmount: 0,
    grandTotal: 83520,
    totalHPP: 29000,
    grossProfit: 54520,
    paymentMethod: "QRIS",
    amountPaid: 83520,
    change: 0,
    cashierName: "Rian (Kasir 1)",
    status: "COMPLETED",
  },
  {
    id: "ord-seed-2",
    orderNumber: "INV-20260923-1002",
    createdAt: "11:40",
    items: [
      { id: "c-3", productId: "prod-4", name: "Nasi Goreng Wagyu Kecombrang", basePrice: 45000, costPrice: 19000, quantity: 2, itemDiscountPercent: 0, finalPrice: 45000 },
      { id: "c-4", productId: "prod-7", name: "Truffle Fries with Parmesan", basePrice: 32000, costPrice: 13000, quantity: 1, itemDiscountPercent: 0, finalPrice: 32000 },
    ],
    subtotal: 122000,
    tax: 13420,
    serviceCharge: 6100,
    discountAmount: 0,
    grandTotal: 141520,
    totalHPP: 51000,
    grossProfit: 90520,
    paymentMethod: "TUNAI",
    amountPaid: 150000,
    change: 8480,
    cashierName: "Rian (Kasir 1)",
    status: "COMPLETED",
  },
];

const SEED_WAREHOUSES: Warehouse[] = [
  { id: "wh-store", name: "Gudang Display Toko", location: "Lantai 1 - Bar Kasir", isPrimary: true },
  { id: "wh-central", name: "Gudang Sentral Jakarta", location: "Jl. Gatot Subroto No. 42", isPrimary: false },
  { id: "wh-depo", name: "Depo Transit Logistik", location: "Bandung Hub", isPrimary: false },
];

const SEED_TABLES: RestaurantTable[] = Array.from({ length: 16 }, (_, i) => {
  const num = i + 1;
  const isOccupied = num === 3 || num === 7;
  const isBilling = num === 5;
  return {
    id: `tbl-${num}`,
    tableNumber: `Meja ${num < 10 ? "0" + num : num}`,
    capacity: num % 4 === 0 ? 6 : num % 2 === 0 ? 4 : 2,
    status: isOccupied ? "OCCUPIED" : isBilling ? "BILLING" : "AVAILABLE",
    guestCount: isOccupied ? 3 : isBilling ? 2 : undefined,
    activeOrderTotal: isOccupied ? 124000 : isBilling ? 88000 : undefined,
    occupiedSince: isOccupied ? "13:20" : isBilling ? "12:45" : undefined,
  };
});

const SEED_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: "kds-1",
    orderId: "ord-demo-1",
    orderNumber: "INV-20260923-4412",
    tableNumber: "Meja 03",
    createdAt: "14:10",
    elapsedMinutes: 8,
    status: "COOKING",
    items: [
      { name: "Nasi Goreng Wagyu Kecombrang", quantity: 2, variantName: "Level Pedas Sedang", isFinished: false },
      { name: "Truffle Fries with Parmesan", quantity: 1, isFinished: true },
      { name: "Kopi Susu Gayo Aren", quantity: 2, variantName: "Less Sugar", isFinished: true },
    ],
  },
  {
    id: "kds-2",
    orderId: "ord-demo-2",
    orderNumber: "INV-20260923-8831",
    tableNumber: "Meja 07",
    createdAt: "14:15",
    elapsedMinutes: 3,
    status: "QUEUED",
    items: [
      { name: "Mie Aceh Tumis Kepiting", quantity: 1, notes: "Kuah dipisah", isFinished: false },
      { name: "Kyoto Matcha Latte", quantity: 1, variantName: "Oat Milk Swap", isFinished: false },
    ],
  },
];

interface POSContextType {
  products: Product[];
  categories: ProductCategory[];
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemDiscount: (itemId: string, discountPercent: number) => void;
  updateCartItemNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  addCustomer: (name: string, whatsapp: string, tier: Customer["tier"], deposit: number) => void;
  orders: Order[];
  currentShift: CashShift;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  activeReceiptOrder: Order | null;
  setActiveReceiptOrder: (order: Order | null) => void;
  variantModalProduct: Product | null;
  setVariantModalProduct: (p: Product | null) => void;
  processPayment: (method: PaymentMethod, amountPaid: number) => Order;
  cartSubtotal: number;
  cartTax: number;
  cartService: number;
  cartDiscount: number;
  cartGrandTotal: number;
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse;
  setSelectedWarehouse: (w: Warehouse) => void;
  stockMovements: StockMovement[];
  addRestock: (productId: string, quantity: number, costPrice: number, notes: string) => void;
  applyStockOpname: (adjustments: { productId: string; physicalCount: number; notes: string }[]) => void;
  isOpnameModalOpen: boolean;
  setIsOpnameModalOpen: (open: boolean) => void;
  tables: RestaurantTable[];
  selectedTable: RestaurantTable | null;
  setSelectedTable: (t: RestaurantTable | null) => void;
  isTableModalOpen: boolean;
  setIsTableModalOpen: (open: boolean) => void;
  assignCartToTable: (tableId: string) => void;
  freeTable: (tableId: string) => void;
  kitchenTickets: KitchenTicket[];
  updateTicketStatus: (ticketId: string, status: KitchenStatus) => void;
  toggleKitchenItemFinished: (ticketId: string, itemIdx: number) => void;
  isCashDrawerModalOpen: boolean;
  setIsCashDrawerModalOpen: (open: boolean) => void;
  cashExpenses: CashExpense[];
  recordCashExpense: (amount: number, category: CashExpense["category"], description: string) => void;
  closeShift: (actualCash: number) => CashShift;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(SEED_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  const [warehouses] = useState<Warehouse[]>(SEED_WAREHOUSES);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>(SEED_WAREHOUSES[0]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([
    { id: "mov-1", timestamp: "Hari ini, 09:30", productId: "prod-1", productName: "Kopi Susu Gayo Aren", type: "INBOUND", quantity: 50, warehouseName: "Gudang Display Toko", notes: "Restock PO #8892", actor: "Supervisor Gudang" },
  ]);
  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);

  const [tables, setTables] = useState<RestaurantTable[]>(SEED_TABLES);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [kitchenTickets, setKitchenTickets] = useState<KitchenTicket[]>(SEED_KITCHEN_TICKETS);

  const [isCashDrawerModalOpen, setIsCashDrawerModalOpen] = useState(false);
  const [cashExpenses, setCashExpenses] = useState<CashExpense[]>([
    { id: "exp-1", timestamp: "11:20", category: "Operasional Toko", amount: 25000, description: "Beli Es Batu Balok 2 Karung", cashierName: "Rian (Kasir 1)" },
    { id: "exp-2", timestamp: "13:00", category: "Bensin & Kurir", amount: 15000, description: "Bensin motor kurir antar pesanan", cashierName: "Rian (Kasir 1)" },
  ]);

  const [currentShift, setCurrentShift] = useState<CashShift>({
    id: "shift-01",
    openedAt: "08:00",
    cashierName: "Rian (Kasir 1)",
    startingCash: 250000,
    totalCashSales: 150000,
    totalNonCashSales: 83520,
    cashOutflow: 40000,
    expectedCashInDrawer: 360000,
    status: "OPEN",
  });

  useEffect(() => {
    const savedOrders = localStorage.getItem("omnipos_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {}
    }
  }, []);

  const categories: ProductCategory[] = ["Semua", "Kopi", "Minuman", "Makanan", "Snack", "Retail"];

  const addToCart = (product: Product, variant?: ProductVariant) => {
    if (product.variants && product.variants.length > 0 && !variant) {
      setVariantModalProduct(product);
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      const adj = variant ? variant.priceAdjustment : 0;
      const basePrice = product.price + adj;
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        name: product.name,
        basePrice,
        costPrice: product.costPrice,
        selectedVariant: variant,
        quantity: 1,
        itemDiscountPercent: 0,
        finalPrice: basePrice,
      };
      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartItemDiscount = (itemId: string, discountPercent: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const discounted = item.basePrice * (1 - discountPercent / 100);
          return { ...item, itemDiscountPercent: discountPercent, finalPrice: Math.round(discounted) };
        }
        return item;
      })
    );
  };

  const updateCartItemNotes = (itemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, notes } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setSelectedTable(null);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
  const cartDiscount = 0;
  const cartTax = Math.round(cartSubtotal * 0.11);
  const cartService = Math.round(cartSubtotal * 0.05);
  const cartGrandTotal = cartSubtotal + cartTax + cartService - cartDiscount;

  const processPayment = (method: PaymentMethod, amountPaid: number): Order => {
    const totalHPP = cart.reduce((acc, item) => acc + item.costPrice * item.quantity, 0);
    const grossProfit = cartGrandTotal - totalHPP;
    const change = Math.max(0, amountPaid - cartGrandTotal);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `INV-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      serviceCharge: cartService,
      discountAmount: cartDiscount,
      grandTotal: cartGrandTotal,
      totalHPP,
      grossProfit,
      paymentMethod: method,
      amountPaid,
      change,
      cashierName: currentShift.cashierName,
      customer: selectedCustomer || undefined,
      tableNumber: selectedTable?.tableNumber,
      status: "COMPLETED",
    };

    if (method === "TUNAI") {
      setCurrentShift((prev) => ({
        ...prev,
        totalCashSales: prev.totalCashSales + cartGrandTotal,
        expectedCashInDrawer: prev.expectedCashInDrawer + cartGrandTotal,
      }));
    } else {
      setCurrentShift((prev) => ({
        ...prev,
        totalNonCashSales: prev.totalNonCashSales + cartGrandTotal,
      }));
    }

    if (selectedCustomer) {
      const earnedPoints = Math.floor(cartGrandTotal / 10000);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? { ...c, points: c.points + earnedPoints, totalSpent: c.totalSpent + cartGrandTotal }
            : c
        )
      );
    }

    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.filter((c) => c.productId === prod.id);
        if (cartMatch.length > 0) {
          const totalQtySold = cartMatch.reduce((sum, c) => sum + c.quantity, 0);
          return { ...prod, stock: Math.max(0, prod.stock - totalQtySold) };
        }
        return prod;
      })
    );

    const kitchenItems = cart
      .filter((c) => {
        const prod = products.find((p) => p.id === c.productId);
        return prod?.category === "Makanan" || prod?.category === "Minuman" || prod?.category === "Kopi";
      })
      .map((c) => ({
        name: c.name,
        quantity: c.quantity,
        notes: c.notes,
        variantName: c.selectedVariant?.name,
        isFinished: false,
      }));

    if (kitchenItems.length > 0) {
      const newTicket: KitchenTicket = {
        id: `kds-${Date.now()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        tableNumber: selectedTable?.tableNumber || "Takeaway",
        createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        items: kitchenItems,
        status: "QUEUED",
        elapsedMinutes: 0,
      };
      setKitchenTickets((prev) => [newTicket, ...prev]);
    }

    if (selectedTable) {
      setTables((prev) =>
        prev.map((t) => (t.id === selectedTable.id ? { ...t, status: "AVAILABLE", activeOrderTotal: undefined } : t))
      );
    }

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("omnipos_orders", JSON.stringify(updatedOrders));

    clearCart();
    setIsPaymentModalOpen(false);
    setActiveReceiptOrder(newOrder);

    return newOrder;
  };

  const addCustomer = (name: string, whatsapp: string, tier: Customer["tier"], deposit: number) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      whatsapp,
      tier,
      depositBalance: deposit,
      points: 100,
      joinedDate: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      totalSpent: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const recordCashExpense = (amount: number, category: CashExpense["category"], description: string) => {
    const newExp: CashExpense = {
      id: `exp-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      amount,
      category,
      description,
      cashierName: currentShift.cashierName,
    };
    setCashExpenses((prev) => [newExp, ...prev]);
    setCurrentShift((prev) => ({
      ...prev,
      cashOutflow: prev.cashOutflow + amount,
      expectedCashInDrawer: prev.expectedCashInDrawer - amount,
    }));
  };

  const closeShift = (actualCash: number): CashShift => {
    const discrepancy = actualCash - currentShift.expectedCashInDrawer;
    const closed: CashShift = {
      ...currentShift,
      actualCashInDrawer: actualCash,
      discrepancy,
      closedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: "CLOSED",
    };
    setCurrentShift(closed);
    return closed;
  };

  const addRestock = (productId: string, quantity: number, costPrice: number, notes: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = p.stock + quantity;
          const newAvgCost = Math.round((p.costPrice * p.stock + costPrice * quantity) / newStock);
          return { ...p, stock: newStock, costPrice: newAvgCost };
        }
        return p;
      })
    );

    const prod = products.find((p) => p.id === productId);
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      timestamp: "Baru saja",
      productId,
      productName: prod?.name || "Produk",
      type: "INBOUND",
      quantity,
      warehouseName: selectedWarehouse.name,
      notes: notes || "Restock Barang Masuk",
      actor: currentShift.cashierName,
    };
    setStockMovements((prev) => [newMovement, ...prev]);
  };

  const applyStockOpname = (adjustments: { productId: string; physicalCount: number; notes: string }[]) => {
    adjustments.forEach((adj) => {
      const prod = products.find((p) => p.id === adj.productId);
      if (!prod) return;
      const diff = adj.physicalCount - prod.stock;

      setProducts((prev) =>
        prev.map((p) => (p.id === adj.productId ? { ...p, stock: adj.physicalCount } : p))
      );

      const opnameMovement: StockMovement = {
        id: `mov-opname-${Date.now()}-${adj.productId}`,
        timestamp: "Baru saja",
        productId: adj.productId,
        productName: prod.name,
        type: "OPNAME",
        quantity: diff,
        warehouseName: selectedWarehouse.name,
        notes: `Opname Fisik (${adj.physicalCount} ${prod.unit}). Selisih: ${diff > 0 ? "+" : ""}${diff}. ${adj.notes}`,
        actor: currentShift.cashierName,
      };
      setStockMovements((prev) => [opnameMovement, ...prev]);
    });
  };

  const assignCartToTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, status: "OCCUPIED", activeOrderTotal: cartGrandTotal, occupiedSince: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }
          : t
      )
    );
    setSelectedTable(table);
    setIsTableModalOpen(false);
  };

  const freeTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, status: "AVAILABLE", activeOrderTotal: undefined, occupiedSince: undefined } : t
      )
    );
  };

  const updateTicketStatus = (ticketId: string, status: KitchenStatus) => {
    setKitchenTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const toggleKitchenItemFinished = (ticketId: string, itemIdx: number) => {
    setKitchenTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newItems = [...t.items];
          newItems[itemIdx].isFinished = !newItems[itemIdx].isFinished;
          return { ...t, items: newItems };
        }
        return t;
      })
    );
  };

  return (
    <POSContext.Provider
      value={{
        products,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        updateCartItemDiscount,
        updateCartItemNotes,
        clearCart,
        customers,
        selectedCustomer,
        setSelectedCustomer,
        addCustomer,
        orders,
        currentShift,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        activeReceiptOrder,
        setActiveReceiptOrder,
        variantModalProduct,
        setVariantModalProduct,
        processPayment,
        cartSubtotal,
        cartTax,
        cartService,
        cartDiscount,
        cartGrandTotal,
        warehouses,
        selectedWarehouse,
        setSelectedWarehouse,
        stockMovements,
        addRestock,
        applyStockOpname,
        isOpnameModalOpen,
        setIsOpnameModalOpen,
        tables,
        selectedTable,
        setSelectedTable,
        isTableModalOpen,
        setIsTableModalOpen,
        assignCartToTable,
        freeTable,
        kitchenTickets,
        updateTicketStatus,
        toggleKitchenItemFinished,
        isCashDrawerModalOpen,
        setIsCashDrawerModalOpen,
        cashExpenses,
        recordCashExpense,
        closeShift,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) throw new Error("usePOS must be used within POSProvider");
  return context;
}
