import {
  addItem,
  clearCart,
  readCart,
  removeItem,
  subtotal,
  totalItems,
  updateQuantity,
  writeCart,
} from '../../apps/web/src/lib/cart';

describe('Cart library (Unit Tests)', () => {
  it('readCart returns [] when storage is null', () => {
    expect(readCart(null)).toEqual([]);
  });

  it('readCart parses valid cart', () => {
    const storage = { getItem: () => JSON.stringify([{ productId: '1', name: 'Espresso', price: 2.5, quantity: 2 }]) };
    expect(readCart(storage)).toHaveLength(1);
  });

  it('readCart filters invalid entries', () => {
    const storage = { getItem: () => JSON.stringify([{ productId: '1', quantity: 0 }, { foo: 'bar' }]) };
    expect(readCart(storage)).toEqual([]);
  });

  it('writeCart persists cart', () => {
    let stored = '';
    const storage = { setItem: (_k: string, v: string) => { stored = v; } };
    writeCart(storage, [{ productId: '1', name: 'Espresso', price: 2.5, quantity: 1 }]);
    expect(JSON.parse(stored)).toHaveLength(1);
  });

  it('addItem merges same product/size/sugar/ice', () => {
    const cart = addItem([], { productId: '1', name: 'Espresso', price: 2.5, quantity: 1, size: 'M' });
    const merged = addItem(cart, { productId: '1', name: 'Espresso', price: 2.5, quantity: 2, size: 'M' });
    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(3);
  });

  it('addItem adds new line for different size', () => {
    const cart = addItem([], { productId: '1', name: 'Espresso', price: 2.5, quantity: 1, size: 'M' });
    const next = addItem(cart, { productId: '1', name: 'Espresso', price: 2.5, quantity: 1, size: 'L' });
    expect(next).toHaveLength(2);
  });

  it('updateQuantity increments and decrements', () => {
    const cart = [{ productId: '1', name: 'Espresso', price: 2.5, quantity: 2 }];
    expect(updateQuantity(cart, 0, 1)[0].quantity).toBe(3);
    expect(updateQuantity(cart, 0, -1)[0].quantity).toBe(1);
  });

  it('updateQuantity removes item when quantity reaches 0', () => {
    const cart = [{ productId: '1', name: 'Espresso', price: 2.5, quantity: 1 }];
    expect(updateQuantity(cart, 0, -1)).toHaveLength(0);
  });

  it('removeItem removes by index', () => {
    const cart = [
      { productId: '1', name: 'A', price: 1, quantity: 1 },
      { productId: '2', name: 'B', price: 2, quantity: 1 },
    ];
    expect(removeItem(cart, 0)).toHaveLength(1);
    expect(removeItem(cart, 0)[0].productId).toBe('2');
  });

  it('clearCart returns empty array', () => {
    expect(clearCart()).toEqual([]);
  });

  it('subtotal and totalItems compute correctly', () => {
    const cart = [
      { productId: '1', name: 'A', price: 2.5, quantity: 2 },
      { productId: '2', name: 'B', price: 3, quantity: 1 },
    ];
    expect(subtotal(cart)).toBe(8);
    expect(totalItems(cart)).toBe(3);
  });
});