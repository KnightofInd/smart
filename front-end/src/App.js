import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo';
import Navbar from './components/navbar';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userData');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Auth Route Component (for login/register - redirects to dashboard if already logged in)
const AuthRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userData');
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={
                  <AuthRoute>
                    <LoginPage />
                  </AuthRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <AuthRoute>
                    <RegisterPage />
                  </AuthRoute>
                } 
              />

              {/* Protected Dashboard Route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Public Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Catch all route - redirects to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
};

// Placeholder components for other routes
const Home = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to SmartEdu
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your comprehensive platform for educational excellence
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="/register"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </a>
        <a
          href="/about"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
);

const About = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About Us</h1>
      <p className="text-gray-600">
        SmartEdu is dedicated to providing quality education through innovative technology.
      </p>
    </div>
  </div>
);

const Contact = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-gray-600">
        Get in touch with us for any questions or support.
      </p>
    </div>
  </div>
);

export default App;