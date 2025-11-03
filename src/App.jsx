import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import { useCart } from './hooks/useCart';
import { api } from './services/api';

function App() {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getTotalItems
  } = useCart();

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} agregado al carrito ✓`);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) return;
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    setShowCheckout(true);
  };

  const handleSubmitOrder = async (address) => {
    try {
      // Intentar guardar en la base de datos
      const orderData = {
        shippingAddress: address,
        items: cartItems.map(item => ({
          product_id: item.id || item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: getTotal()
      };

      // Guardar la orden (puede fallar si el backend no está disponible)
      try {
        await api.createOrder(address);
      } catch (apiError) {
        console.log('No se pudo guardar en BD, guardando localmente');
        // Guardar orden localmente
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
          ...orderData,
          id: Date.now(),
          status: 'pending',
          created_at: new Date().toISOString()
        });
        localStorage.setItem('orders', JSON.stringify(orders));
      }

      // Limpiar carrito y mostrar éxito
      clearCart();
      setOrderSuccess(true);
      setShowCheckout(false);
      setShowCart(false);

      setTimeout(() => {
        setOrderSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar la orden');
    }
  };

  const cartItemsCount = getTotalItems();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header cartItemsCount={cartItemsCount} onCartClick={() => setShowCart(!showCart)} />

      <div className="container mx-auto px-4 py-8">
        {orderSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">¡Orden creada exitosamente!</strong>
            <span className="block sm:inline"> Tu pedido ha sido procesado.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductList onAddToCart={handleAddToCart} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {showCheckout ? (
                <CheckoutForm
                  onSubmit={handleSubmitOrder}
                  onCancel={() => setShowCheckout(false)}
                />
              ) : showCart ? (
                <Cart
                  cartItems={cartItems}
                  total={getTotal()}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">
                    Haz clic en el botón del carrito para ver tus productos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
