import React from 'react';
import { motion } from 'framer-motion';
import { Salad } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ServiceLayout from './ServiceLayout';

const Nutrition = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  const services = [
    {
      id: 'nt-meal-plan',
      title: 'Meal Planning',
      description: 'Custom meal plans and nutrition guidance',
      price: 149,
      duration: 'Monthly',
      location: 'Virtual',
      features: [
        'Personalized meal plans',
        'Grocery shopping lists',
        'Recipe suggestions',
        'Macro tracking guidance',
        'Monthly plan updates'
      ]
    },
    {
      id: 'nt-coaching',
      title: 'Nutrition Coaching',
      description: 'One-on-one nutrition counseling',
      price: 99,
      duration: 'Per Session',
      location: 'Virtual',
      features: [
        'Dietary analysis',
        'Goal setting',
        'Behavior modification',
        'Supplement guidance',
        'Progress monitoring'
      ]
    },
    {
      id: 'nt-complete',
      title: 'Complete Package',
      description: 'Meal planning + weekly coaching calls',
      price: 249,
      duration: 'Monthly',
      location: 'Virtual',
      features: [
        'Custom meal plans',
        'Weekly coaching calls',
        'Daily food logging review',
        'Supplement recommendations',
        '24/7 messaging support'
      ]
    }
  ];

  const handleGetStarted = (service) => {
    if (!currentUser) {
      sessionStorage.setItem('selectedService', JSON.stringify({
        id: service.id,
        title: service.title,
        price: service.price,
        duration: service.duration,
        location: service.location,
        type: 'nutrition'
      }));
      navigate('/login');
      return;
    }

    addItem({
      id: service.id,
      title: service.title,
      price: service.price,
      duration: service.duration,
      location: service.location,
      type: 'nutrition'
    });
    navigate('/cart');
  };

  return (
    <ServiceLayout
      title="Nutrition Services"
      description="Fuel your body for optimal performance"
      icon={<Salad className="w-16 h-16 text-purple-500" />}
    >
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900 rounded-lg overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
              <div className="text-3xl font-bold text-[#3dd8e8] mb-6">
                ${service.price}
                <span className="text-lg text-gray-400">/{service.duration.toLowerCase()}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <span className="mr-2 text-[#3dd8e8]">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleGetStarted(service)}
                className="block w-full text-center bg-[#3dd8e8] text-black py-3 rounded-lg font-semibold hover:bg-[#34c5d3] transition-colors"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </ServiceLayout>
  );
};

export default Nutrition;