import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Trophy,
  Target,
  Brain,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Star,
  Lightbulb,
  Rocket,
  Shield 
} from 'lucide-react';
import client from './apollo';
import Navbar from './components/navbar';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import About from './pages/about';
import StudentAnalytics from './components/student_analytics';
import EducationalChatbot from './pages/chatbot';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userData');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Auth Route Component
const AuthRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userData');
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Enhanced Home Component
const Home = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Learning",
      description: "AI-powered personalized learning paths tailored to your needs"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Real-time monitoring of your academic performance"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Teachers",
      description: "Learn from experienced educators in every subject"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Interactive Learning",
      description: "Engage with dynamic content and live sessions"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Expert Teachers" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <div className="animate-fade-in-down">
              <GraduationCap className="w-20 h-20 mx-auto text-blue-400 mb-8" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">SmartEdu</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Transform your learning journey with our innovative educational platform
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/about"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  Learn More <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose SmartEdu?</h2>
          <p className="text-gray-400">Experience the future of education with our innovative features</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-6 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Component
const Contact = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm p-8 rounded-xl border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
        <p className="text-gray-300 mb-8">
          Get in touch with us for any questions or support. We're here to help you succeed.
        </p>
        {/* Add your contact form or contact details here */}
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Analytics" element={<StudentAnalytics />} />
              <Route path="/Chatbot" element={<EducationalChatbot />} />
              
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

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;