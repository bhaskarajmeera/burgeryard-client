import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext(null);
const STORAGE_KEY = 'burgerYardCart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((currentItems) => {
      const itemExists = currentItems.find((entry) => entry.id === item.id);

      if (itemExists) {
        return currentItems.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });

    toast.success(`${item.name} added to cart.`);
  };

  const updateQuantity = (itemId, change) => {
    const updatedItem = cartItems.find((entry) => entry.id === itemId);

    setCartItems((currentItems) => {
      const nextItems = currentItems
        .map((entry) =>
          entry.id === itemId
            ? { ...entry, quantity: Math.max(0, entry.quantity + change) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0);

      return nextItems;
    });

    if (updatedItem && change > 0) {
      toast.info(`${updatedItem.name} quantity increased.`);
    }
    if (updatedItem && change < 0) {
      toast.info(`${updatedItem.name} quantity decreased.`);
    }
  };

  const removeFromCart = (itemId) => {
    const removedItem = cartItems.find((entry) => entry.id === itemId);
    setCartItems((currentItems) =>
      currentItems.filter((entry) => entry.id !== itemId),
    );

    if (removedItem) {
      toast.warning(`${removedItem.name} removed from cart.`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Your cart has been cleared.');
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      itemCount,
      subtotal,
    }),
    [cartItems, itemCount, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
