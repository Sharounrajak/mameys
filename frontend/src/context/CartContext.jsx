'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load saved cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('mameys_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Sync cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('mameys_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        // Don't allow adding more than stock available
        if (updated[existingIndex].quantity < product.stockQuantity) {
          updated[existingIndex].quantity += 1;
        }
        return updated;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto-open cart drawer when an item is added
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.stockQuantity) return item; // Stock limit
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);