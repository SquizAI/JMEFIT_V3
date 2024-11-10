import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ServiceBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableTimes = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    // Add booking logic here
    console.log('Booking:', { date: selectedDate, time: selectedTime });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#3dd8e8] mb-8">Book Your Session</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Select Date</h3>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
            className="bg-black rounded-lg p-4 w-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Select Time</h3>
          <div className="grid grid-cols-2 gap-4">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  selectedTime === time
                    ? 'bg-[#3dd8e8] text-black'
                    : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                {time}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-zinc-900 p-6 rounded-lg"
      >
        <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-4">
          {selectedDate && (
            <div className="flex items-center gap-2 text-gray-300">
              <CalendarIcon className="w-5 h-5 text-[#3dd8e8]" />
              <span>{selectedDate.toLocaleDateString()}</span>
            </div>
          )}
          {selectedTime && (
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5 text-[#3dd8e8]" />
              <span>{selectedTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5 text-[#3dd8e8]" />
            <span>Main Gym Location</span>
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime}
          className="mt-6 w-full bg-[#3dd8e8] text-black py-3 rounded-lg font-semibold hover:bg-[#34c5d3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
      </motion.div>
    </div>
  );
};

export default ServiceBooking;