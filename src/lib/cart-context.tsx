import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cartAPI, ordersAPI } from './api';

type CartItem = {
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    cover_image_url?: string;
    stock_quantity: number;
  };
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  total: number;
  addItem: (bookId: string, quantity?: number) => Promise<void>;
  updateItem: (bookId: string, quantity: number) => Promise<void>;
  removeItem: (bookId: string) => Promise<void>;
  clear: () => Promise<void>;
  checkout: (options?: { delivery_type?: 'pickup' | 'delivery'; delivery_address?: any; payment_method?: string }) => Promise<string>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();
      setItems(res.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated (token exists)
    if (localStorage.getItem('token')) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * (item.book?.price || 0), 0);
  }, [items]);

  const addItem = async (bookId: string, quantity: number = 1) => {
    const res = await cartAPI.add(bookId, quantity);
    setItems(res.data.items || []);
  };

  const updateItem = async (bookId: string, quantity: number) => {
    const res = await cartAPI.update(bookId, quantity);
    setItems(res.data.items || []);
  };

  const removeItem = async (bookId: string) => {
    const res = await cartAPI.remove(bookId);
    setItems(res.data.items || []);
  };

  const clear = async () => {
    await cartAPI.clear();
    setItems([]);
  };

  const checkout = async (options?: { delivery_type?: 'pickup' | 'delivery'; delivery_address?: any; payment_method?: string }) => {
    if (!items.length) throw new Error('Cart is empty');
    const payload = {
      items: items.map(i => ({ book_id: i.book._id, quantity: i.quantity })),
      delivery_type: options?.delivery_type || 'pickup',
      delivery_address: options?.delivery_address,
      payment_method: options?.payment_method || 'cash',
    };
    const res = await ordersAPI.create(payload);
    // Clear cart on successful order
    await clear();
    return res.data.order_number || res.data._id;
  };

  return (
    <CartContext.Provider value={{ items, loading, total, addItem, updateItem, removeItem, clear, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};