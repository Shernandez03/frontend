import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../hooks/useCart';

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getTotal()).toBe(0);
    expect(result.current.getTotalItems()).toBe(0);
  });

  it('should add product to cart', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10
    };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].name).toBe('Laptop');
    expect(result.current.cartItems[0].quantity).toBe(1);
  });

  it('should increment quantity when adding existing product', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10
    };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  it('should update product quantity', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10
    };

    act(() => {
      result.current.addToCart(product);
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10
    };

    act(() => {
      result.current.addToCart(product);
      result.current.removeFromCart(1);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCart());
    const product1 = {
      id: 1,
      name: 'Laptop',
      price: 1000,
      image_url: 'test.jpg',
      stock: 10
    };
    const product2 = {
      id: 2,
      name: 'Mouse',
      price: 50,
      image_url: 'test2.jpg',
      stock: 20
    };

    act(() => {
      result.current.addToCart(product1);
      result.current.addToCart(product2);
    });

    expect(result.current.getTotal()).toBe(1050);
  });

  it('should calculate total items correctly', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10
    };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.getTotalItems()).toBe(3);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10
    };

    act(() => {
      result.current.addToCart(product);
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.getTotal()).toBe(0);
  });

  it('should persist cart in localStorage', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10
    };

    act(() => {
      result.current.addToCart(product);
    });

    const savedCart = localStorage.getItem('ecommerce_cart');
    expect(savedCart).toBeTruthy();

    const parsedCart = JSON.parse(savedCart);
    expect(parsedCart).toHaveLength(1);
    expect(parsedCart[0].name).toBe('Laptop');
  });

  it('should load cart from localStorage on init', () => {
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 10,
      product_id: 1,
      quantity: 2
    };

    localStorage.setItem('ecommerce_cart', JSON.stringify([product]));

    const { result } = renderHook(() => useCart());

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].name).toBe('Laptop');
    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  it('should respect stock limit when updating quantity', () => {
    const { result } = renderHook(() => useCart());
    const product = {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image_url: 'test.jpg',
      stock: 5
    };

    act(() => {
      result.current.addToCart(product);
      result.current.updateQuantity(1, 10);
    });

    // Should not exceed stock
    expect(result.current.cartItems[0].quantity).toBe(5);
  });
});
