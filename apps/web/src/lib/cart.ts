export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: 'S' | 'M' | 'L';
  sugar?: string;
  ice?: string;
  toppings?: string[];
};

export function readCart(storage: { getItem: (key: string) => string | null } | null): CartItem[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem('brewlite_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) =>
        i &&
        typeof i.productId === 'string' &&
        typeof i.name === 'string' &&
        typeof i.price === 'number' &&
        typeof i.quantity === 'number' &&
        i.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function writeCart(
  storage: { setItem: (key: string, value: string) => void } | null,
  cart: CartItem[],
): void {
  if (!storage) return;
  try {
    storage.setItem('brewlite_cart', JSON.stringify(cart));
  } catch {
    // ignore
  }
}

export function addItem(cart: CartItem[], item: CartItem): CartItem[] {
  const existingIndex = cart.findIndex(
    (c) =>
      c.productId === item.productId &&
      c.size === item.size &&
      c.sugar === item.sugar &&
      c.ice === item.ice,
  );
  if (existingIndex >= 0) {
    const next = [...cart];
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: next[existingIndex].quantity + item.quantity,
    };
    return next;
  }
  return [...cart, item];
}

export function updateQuantity(cart: CartItem[], index: number, delta: number): CartItem[] {
  if (index < 0 || index >= cart.length) return cart;
  const next = [...cart];
  const item = next[index];
  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    next.splice(index, 1);
  } else {
    next[index] = { ...item, quantity: newQty };
  }
  return next;
}

export function removeItem(cart: CartItem[], index: number): CartItem[] {
  if (index < 0 || index >= cart.length) return cart;
  return cart.filter((_, i) => i !== index);
}

export function clearCart(): CartItem[] {
  return [];
}

export function subtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function totalItems(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}