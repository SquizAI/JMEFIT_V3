import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ServiceLayout from './ServiceLayout';

const GroupTraining = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  const services = [
    {
      id: 'gt-hiit',
      title: 'HIIT Classes',
      description: 'High-intensity interval training in a group setting',
      price: 25,
      duration: 'Per Class',
      location: 'In Person',
      features: [
        'Dynamic workout variety',
        'Cardio and strength combined',
        'Modifications for all levels',
        'Heart rate monitoring',
        'Progress tracking'
      ]
    },
    {
      id: 'gt-strength',
      title: 'Strength Classes',
      description: 'Focus on building strength and muscle',
      price: 25,
      duration: 'Per Class',
      location: 'In Person',
      features: [
        'Progressive overload training',
        'Form-focused instruction',
        'Equipment provided',
        'Strength assessments',
        'Technique workshops'
      ]
    },
    {
      id: 'gt-unlimited',
      title: 'Monthly Unlimited',
      description: 'Unlimited access to all group classes',
      price: 149,
      duration: 'Monthly',
      location: 'In Person',
      features: [
        'Access to all class types',
        'Flexible scheduling',
        'Community events',
        'Monthly challenges',
        'Member perks'
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
        type: 'group-training'
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
      type: 'group-training'
    });
    navigate('/cart');
  };

  return (
    <ServiceLayout
      title="Group Training"
      description="Join our energetic fitness community"
      icon={<Users className="w-16 h-16 text-purple-500" />}
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

export default GroupTraining;