import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Calendar,
  Award
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Learning",
      description: "Personalized learning paths tailored to your needs",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Tracking",
      description: "Set and achieve your academic goals",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Progress Rewards",
      description: "Earn rewards as you learn and grow",
      color: "from-green-500 to-green-600"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Expert Teachers" },
    { value: "1000+", label: "Learning Resources" },
    { value: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="space-y-8">
            <div className="animate-fade-in-down">
              <GraduationCap className="w-20 h-20 mx-auto text-blue-400 mb-8" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">SmartEdu</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Empowering students with innovative learning solutions and personalized education journeys.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up">
              <button onClick={() => navigate('/login')} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2 hover:shadow-lg">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/about')} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-2">
                Learn More <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose SmartEdu?</h2>
          <p className="text-gray-400">Experience the future of education with our innovative features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-6 text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning with SmartEdu. Start your journey today!
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          >
            Join Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">SmartEdu</span>
              </div>
              <p className="text-gray-400">Empowering education through innovation</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-blue-400 cursor-pointer">Home</li>
                <li className="hover:text-blue-400 cursor-pointer">About</li>
                <li className="hover:text-blue-400 cursor-pointer">Courses</li>
                <li className="hover:text-blue-400 cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-blue-400 cursor-pointer">Blog</li>
                <li className="hover:text-blue-400 cursor-pointer">Documentation</li>
                <li className="hover:text-blue-400 cursor-pointer">Community</li>
                <li className="hover:text-blue-400 cursor-pointer">Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@smartedu.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Education St.</li>
                <li>Learning City, ED 12345</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartEdu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;