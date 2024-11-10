import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserServices = () => {
  const activeServices = [
    {
      id: 1,
      name: 'Personal Training',
      type: '1-on-1 Training',
      nextSession: '2024-03-20 10:00',
      location: 'Main Gym',
      remainingSessions: 8
    },
    {
      id: 2,
      name: 'Nutrition Coaching',
      type: 'Monthly Plan',
      nextSession: '2024-03-22 14:00',
      location: 'Virtual',
      validUntil: '2024-04-15'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#3dd8e8]">My Services</h2>
        <Link
          to="/services"
          className="flex items-center gap-2 text-[#3dd8e8] hover:text-[#34c5d3] transition-colors"
        >
          Browse Services
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid gap-6">
        {activeServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 p-6 rounded-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="text-gray-400">{service.type}</p>
              </div>
              <Link
                to="/dashboard/book"
                className="px-4 py-2 bg-[#3dd8e8] text-black rounded-lg font-semibold hover:bg-[#34c5d3] transition-colors"
              >
                Book Session
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-[#3dd8e8]" />
                <span>Next: {new Date(service.nextSession).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-[#3dd8e8]" />
                <span>{new Date(service.nextSession).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-5 h-5 text-[#3dd8e8]" />
                <span>{service.location}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              {service.remainingSessions ? (
                <p className="text-gray-400">
                  {service.remainingSessions} sessions remaining
                </p>
              ) : (
                <p className="text-gray-400">
                  Valid until {new Date(service.validUntil).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {activeServices.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 rounded-lg">
            <p className="text-gray-400 mb-4">You don't have any active services</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[#3dd8e8] hover:text-[#34c5d3] transition-colors"
            >
              Browse Available Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserServices;