import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  duration?: string;
  location?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  price,
  features,
  duration,
  location
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  const handleGetStarted = () => {
    const serviceItem = {
      id,
      title,
      price,
      duration,
      location,
      type: 'service'
    };

    if (!currentUser) {
      // Store service info in session storage for after login
      sessionStorage.setItem('selectedService', JSON.stringify(serviceItem));
      navigate('/login');
      return;
    }

    // Add to cart and navigate to cart page
    addItem(serviceItem);
    navigate('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors"
    >
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-400 mb-4">{description}</p>
      
      {duration && (
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
      )}
      
      {location && (
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      )}

      <div className="text-[#3dd8e8] font-bold text-2xl mb-6">
        ${price}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center text-gray-300">
            <Check className="w-4 h-4 text-[#3dd8e8] mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleGetStarted}
        className="w-full text-center bg-[#3dd8e8] text-black py-3 rounded-lg font-semibold hover:bg-[#34c5d3] transition-colors"
      >
        Get Started
      </button>
    </motion.div>
  );
};

export default ServiceCard;