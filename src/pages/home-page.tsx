import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Star, 
  Compass, 
  BookOpen, 
  MessageCircle 
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
          Pathlet: Your Personal Self-Discovery Journey
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Unlock the mysteries of your unique identity through Astrology, Human Design, and Numerology
        </p>
        
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { 
              icon: <Star className="w-12 h-12 text-purple-600" />, 
              title: "Astrology Insights",
              description: "Discover your cosmic blueprint"
            },
            { 
              icon: <Compass className="w-12 h-12 text-pink-600" />, 
              title: "Human Design",
              description: "Understand your energy type"
            },
            { 
              icon: <BookOpen className="w-12 h-12 text-indigo-600" />, 
              title: "Numerology",
              description: "Decode your life path"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              {feature.icon}
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <Link href="/auth">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Journey
          </motion.button>
        </Link>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-0 right-0 text-center py-4 text-gray-600"
      >
        <p> Discover. Understand. Grow.</p>
      </motion.div>
    </div>
  );
};

export default HomePage;