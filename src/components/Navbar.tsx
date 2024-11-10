import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, User, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const services = [
    { name: 'Personal Training', path: '/services/personal-training' },
    { name: 'Group Training', path: '/services/group-training' },
    { name: 'Online Coaching', path: '/services/online-coaching' },
    { name: 'Nutrition Coaching', path: '/services/nutrition' }
  ];

  const blogCategories = {
    'Fitness': {
      path: '/category/fitness',
      subcategories: ['Workouts', 'Training Tips', 'Exercise Guides']
    },
    'Nutrition': {
      path: '/category/nutrition',
      subcategories: ['Meal Plans', 'Recipes', 'Supplements']
    },
    'Lifestyle': {
      path: '/category/lifestyle',
      subcategories: ['Success Stories', 'Motivation', 'Recovery']
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Logo className="w-24 h-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-[#3dd8e8] transition-colors">
              Home
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-[#3dd8e8] transition-colors">
                Services <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute -left-4 top-full w-64 bg-zinc-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {services.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    className="block px-4 py-3 hover:bg-zinc-800 transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/contact" className="hover:text-[#3dd8e8] transition-colors">
              Contact
            </Link>

            <motion.a
              href="https://www.instagram.com/jmefit_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-500 hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Instagram className="w-5 h-5" />
              <span>@jmefit_</span>
            </motion.a>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-[#3dd8e8] hover:text-[#34c5d3] transition-colors">
                    <User className="w-5 h-5" />
                    <span>{currentUser.displayName || 'Account'}</span>
                  </button>
                  <div className="absolute right-0 top-full w-48 bg-zinc-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 hover:bg-zinc-800 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-zinc-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-[#3dd8e8] hover:text-[#34c5d3] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/admin-login"
                    className="text-sm text-gray-400 hover:text-[#3dd8e8] transition-colors"
                  >
                    Admin
                  </Link>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-zinc-900 border-t border-zinc-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/"
                className="block text-white hover:text-[#3dd8e8] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              {services.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  className="block text-white hover:text-[#3dd8e8] transition-colors pl-4"
                  onClick={() => setIsOpen(false)}
                >
                  {service.name}
                </Link>
              ))}

              <Link
                to="/contact"
                className="block text-white hover:text-[#3dd8e8] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-zinc-800">
                {currentUser ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block text-[#3dd8e8] hover:text-[#34c5d3] transition-colors mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-[#3dd8e8] hover:text-[#34c5d3] transition-colors mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/admin-login"
                      className="block text-gray-400 hover:text-[#3dd8e8] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;