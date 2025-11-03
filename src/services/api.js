const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Productos
  async getProducts() {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    return data.data;
  },

  async getProductById(id) {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    return data.data;
  },

  // Carrito
  async getCart(userId = 1) {
    const response = await fetch(`${API_URL}/cart/${userId}`);
    const data = await response.json();
    return data.data;
  },

  async addToCart(productId, quantity = 1, userId = 1) {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity, userId }),
    });
    const data = await response.json();
    return data.data;
  },

  async updateCartQuantity(productId, quantity, userId = 1) {
    const response = await fetch(`${API_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity, userId }),
    });
    const data = await response.json();
    return data.data;
  },

  async removeFromCart(productId, userId = 1) {
    const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return data;
  },

  async clearCart(userId = 1) {
    const response = await fetch(`${API_URL}/cart/clear/${userId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  },

  // Órdenes
  async createOrder(shippingAddress, userId = 1) {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shippingAddress, userId }),
    });
    const data = await response.json();
    return data.data;
  },

  async getUserOrders(userId = 1) {
    const response = await fetch(`${API_URL}/orders/user/${userId}`);
    const data = await response.json();
    return data.data;
  },

  async getOrderById(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}`);
    const data = await response.json();
    return data.data;
  },
};
