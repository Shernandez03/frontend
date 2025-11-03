import { useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'ecommerce_cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Calcular total
  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  // Obtener cantidad total de items
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, {
          id: product.id,
          product_id: product.id, // Para compatibilidad con componentes
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          stock: product.stock,
          quantity: 1
        }];
      }
    });
  };

  // Actualizar cantidad
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId || item.product_id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  // Eliminar del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId && item.product_id !== productId)
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Obtener items del carrito
  const getCartItems = () => {
    return cartItems;
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getTotalItems,
    getCartItems
  };
};
