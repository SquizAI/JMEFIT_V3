import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ServiceLayout from './ServiceLayout';

const OnlineCoaching = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  const services = [
    {
      id: 'oc-basic',
      title: 'Basic Package',
      description: 'Perfect for beginners starting their fitness journey',
      price: 99,
      duration: 'Monthly',
      location: 'Virtual',
      features: [
        'Custom workout program',
        'Monthly program updates',
        'Exercise technique videos',
        'Basic nutrition guidelines',
        'Email support'
      ]
    },
    {
      id: 'oc-premium',
      title: 'Premium Package',
      description: 'Comprehensive coaching with personalized attention',
      price: 199,
      duration: 'Monthly',
      location: 'Virtual',
      features: [
        'Customized workout plans',
        'Weekly video check-ins',
        'Form analysis & feedback',
        'Nutrition coaching',
        '24/7 messaging support'
      ]
    },
    {
      id: 'oc-elite',
      title: 'Elite Package',
      description: 'Maximum support for optimal results',
      price: 299,
      duration: 'Monthly',
      location: 'Virtual',
      features: [
        'Advanced programming',
        'Bi-weekly video calls',
        'Priority support',
        'Custom meal plans',
        'Progress analytics'
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
        type: 'online-coaching'
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
      type: 'online-coaching'
    });
    navigate('/cart');
  };

  return (
    <ServiceLayout
      title="Online Coaching"
      description="Expert guidance and support, anywhere in the world"
      icon={<Globe className="w-16 h-16 text-purple-500" />}
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

export default OnlineCoaching;