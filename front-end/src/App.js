import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo'; // Make sure this path matches your apollo.js location
import Navbar from './components/navbar';
import RegisterPage from './pages/register';
import dashbaord from './pages/dashboard';
import './index.css';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<dashbaord />} />
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
    <h1 className="text-3xl font-bold">Welcome to SmartEdu</h1>
  </div>
);

const About = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold">About Us</h1>
  </div>
);

const Contact = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold">Contact Us</h1>
  </div>
);

export default App;