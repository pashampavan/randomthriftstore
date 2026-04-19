import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

function readCartFromStorage() {
  try {
    const raw = localStorage.getItem('rewago-cart');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCartFromStorage);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('rewago-cart', JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      items,
      addToCart: (product) => {
        const existing = items.find((item) => item.id === product.id);
        if (existing) {
          const next = items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          persist(next);
          return;
        }
        persist([...items, { ...product, quantity: 1 }]);
      },
      updateQuantity: (id, quantity) => {
        const next = items
          .map((item) => (item.id === id ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0);
        persist(next);
      },
      removeFromCart: (id) => persist(items.filter((item) => item.id !== id)),
      clearCart: () => persist([]),
      cartTotal: items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
      cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
