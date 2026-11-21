export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  MOMO = 'MOMO',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
}

export enum PickupType {
  TAKEAWAY = 'TAKEAWAY',
  DINE_IN = 'DINE_IN',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  size?: 'S' | 'M' | 'L';
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  pickupType: PickupType;
  tableNumber?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
