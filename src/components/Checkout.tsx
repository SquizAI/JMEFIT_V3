import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add your payment processing logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated payment processing
      clearCart();
      navigate('/dashboard');
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/services');
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[#3dd8e8] hover:text-[#34c5d3] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>

          <div className="bg-zinc-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-[#3dd8e8] mb-8">Checkout</h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-zinc-800"
                >
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    {item.duration && (
                      <p className="text-sm text-gray-400">{item.duration}</p>
                    )}
                  </div>
                  <span className="font-bold">${item.price}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-4 text-xl">
                <span>Total</span>
                <span className="font-bold text-[#3dd8e8]">${total.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Card Information
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full pl-10 pr-4 py-3 bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dd8e8] text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dd8e8] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full px-4 py-3 bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dd8e8] text-white"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3dd8e8] text-black py-4 rounded-lg font-semibold hover:bg-[#34c5d3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete Purchase
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Your payment is secured with SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;