import React from 'react';

const Cart = ({ cartItems, total, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tu Carrito</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.product_id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4 flex-1">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="text-gray-800 font-semibold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded"
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => onRemoveItem(item.product_id)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Proceder al Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
