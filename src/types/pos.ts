export type ProductCategory = "Semua" | "Makanan" | "Minuman" | "Kopi" | "Snack" | "Retail";

export interface ProductVariant {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStockAlert: number;
  unit: string;
  imageColor: string;
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  costPrice: number;
  selectedVariant?: ProductVariant;
  quantity: number;
  itemDiscountPercent: number;
  notes?: string;
  finalPrice: number;
}

export type PaymentMethod = "TUNAI" | "QRIS" | "TRANSFER" | "KASBON";

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  points: number;
  depositBalance: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  joinedDate: string;
  totalSpent: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discountAmount: number;
  grandTotal: number;
  totalHPP: number;
  grossProfit: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  cashierName: string;
  customer?: Customer;
  tableNumber?: string;
  status: "COMPLETED" | "HOLD" | "VOID";
}

export interface CashExpense {
  id: string;
  timestamp: string;
  category: "Bahan Baku" | "Operasional Toko" | "Bensin & Kurir" | "Lainnya";
  amount: number;
  description: string;
  cashierName: string;
}

export interface CashShift {
  id: string;
  openedAt: string;
  closedAt?: string;
  cashierName: string;
  startingCash: number;
  totalCashSales: number;
  totalNonCashSales: number;
  cashOutflow: number;
  expectedCashInDrawer: number;
  actualCashInDrawer?: number;
  discrepancy?: number;
  status: "OPEN" | "CLOSED";
}

export type WarehouseId = "wh-store" | "wh-central" | "wh-depo";

export interface Warehouse {
  id: WarehouseId;
  name: string;
  location: string;
  isPrimary: boolean;
}

export type StockMovementType = "INBOUND" | "OUTBOUND" | "TRANSFER" | "OPNAME" | "SALE";

export interface StockMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  warehouseName: string;
  notes: string;
  actor: string;
}

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "BILLING" | "RESERVED";

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  guestCount?: number;
  activeOrderTotal?: number;
  occupiedSince?: string;
  activeOrderId?: string;
}

export type KitchenStatus = "QUEUED" | "COOKING" | "READY" | "SERVED";

export interface KitchenTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  tableNumber: string;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    notes?: string;
    variantName?: string;
    isFinished: boolean;
  }[];
  status: KitchenStatus;
  elapsedMinutes: number;
}
