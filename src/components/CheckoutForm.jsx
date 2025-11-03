import React, { useState } from 'react';

const CheckoutForm = ({ onSubmit, onCancel }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Por favor ingresa una dirección de envío');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(address);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Envío</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
            Dirección de Envío
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Ingresa tu dirección completa..."
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-colors duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Procesando...' : 'Confirmar Orden'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
