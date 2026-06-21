'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Release } from '@/data/releases';

export interface CartItem {
  release: Release;
  format: 'WAV' | 'MP3' | 'VINYL';
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (releaseId: string, format: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pt_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('pt_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      // Prevent duplicates of same release+format
      const exists = prev.find(i => i.release.id === item.release.id && i.format === item.format);
      if (exists) return prev;
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (releaseId: string, format: string) => {
    setItems((prev) => prev.filter(i => !(i.release.id === releaseId && i.format === format)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
