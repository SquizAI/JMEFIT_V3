import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import BlogPost from './pages/BlogPost';
import CategoryPage from './pages/CategoryPage';
import PersonalTrainingFAQ from './pages/PersonalTrainingFAQ';
import GroupTrainingFAQ from './pages/GroupTrainingFAQ';
import NutritionFAQ from './pages/NutritionFAQ';
import Checkout from './components/Checkout';
import Cart from './components/Cart';
import Services from './pages/Services';
import ContactPage from './pages/ContactPage';

// Service Pages
import PersonalTraining from './components/services/PersonalTraining';
import GroupTraining from './components/services/GroupTraining';
import OnlineCoaching from './components/services/OnlineCoaching';
import Nutrition from './components/services/Nutrition';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-black text-white flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  {/* Service Routes */}
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/personal-training" element={<PersonalTraining />} />
                  <Route path="/services/group-training" element={<GroupTraining />} />
                  <Route path="/services/online-coaching" element={<OnlineCoaching />} />
                  <Route path="/services/nutrition" element={<Nutrition />} />
                  
                  <Route path="/faq/personal-training" element={<PersonalTrainingFAQ />} />
                  <Route path="/faq/group-training" element={<GroupTrainingFAQ />} />
                  <Route path="/faq/nutrition" element={<NutritionFAQ />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout/:package" element={<Checkout />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;