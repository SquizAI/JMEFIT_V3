import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({
  title,
  description,
  icon,
  children
}) => {
  return (
    <div className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-[#3dd8e8] hover:text-[#34c5d3] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Services
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="mb-6">{icon}</div>
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </motion.div>

        {children}
      </div>
    </div>
  );
};

export default ServiceLayout;