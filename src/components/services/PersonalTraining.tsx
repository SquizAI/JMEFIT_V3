import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ServiceLayout from './ServiceLayout';

const PersonalTraining = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  const services = [
    {
      id: 'pt-1on1',
      title: '1-on-1 Training',
      description: 'Personalized attention and custom workout plans',
      price: 75,
      duration: 'Per Session',
      location: 'In Person',
      features: [
        'Customized workout programming',
        'Form correction and technique guidance',
        'Progress tracking and adjustments',
        'Nutrition recommendations',
        'Flexible scheduling'
      ]
    },
    {
      id: 'pt-online',
      title: 'Online Coaching',
      description: 'Remote training with weekly check-ins',
      price: 199,
      duration: 'Monthly',
      location: 'Virtual',
      features: [
        'Custom workout plans',
        'Weekly video check-ins',
        'Form analysis via video',
        'Nutrition guidance',
        '24/7 messaging support'
      ]
    },
    {
      id: 'pt-program',
      title: 'Program Design',
      description: 'Custom workout program without live coaching',
      price: 99,
      duration: 'Monthly',
      location: 'Virtual',
      features: [
        'Personalized workout plan',
        'Monthly program updates',
        'Exercise video library',
        'Basic nutrition guidelines',
        'Email support'
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
        type: 'personal-training'
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
      type: 'personal-training'
    });
    navigate('/cart');
  };

  return (
    <ServiceLayout
      title="Personal Training"
      description="Achieve your fitness goals with expert guidance"
      icon={<Dumbbell className="w-16 h-16 text-purple-500" />}
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

export default PersonalTraining;