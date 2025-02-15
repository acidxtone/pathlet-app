import React from 'react';
import { motion } from 'framer-motion';
import { Star, Compass, BookOpen } from 'lucide-react';
import { useInsights } from '@/context/insights-context';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const InsightsPage: React.FC = () => {
  const { insights, birthDetails } = useInsights();
  const [, setLocation] = useLocation();

  if (!insights || !birthDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No insights available. Please enter your birth details.</p>
      </div>
    );
  }

  const insightSections = [
    {
      title: 'Astrology Insights',
      icon: <Star className="w-12 h-12 text-purple-600" />,
      details: [
        `Sun Sign: ${insights.astrology.sunSign}`,
        `Moon Sign: ${insights.astrology.moonSign}`,
        `Rising Sign: ${insights.astrology.risingSign}`
      ]
    },
    {
      title: 'Human Design',
      icon: <Compass className="w-12 h-12 text-pink-600" />,
      details: [
        `Energy Type: ${insights.humanDesign.energyType}`,
        `Strategy: ${insights.humanDesign.strategy}`,
        `Authority: ${insights.humanDesign.authority}`
      ]
    },
    {
      title: 'Numerology',
      icon: <BookOpen className="w-12 h-12 text-indigo-600" />,
      details: [
        `Life Path Number: ${insights.numerology.lifePath}`,
        `Destiny Number: ${insights.numerology.destinyNumber}`,
        `Soul Urge Number: ${insights.numerology.soulUrgeNumber}`
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
          Your Personal Insights
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {insightSections.map((section, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                {section.icon}
              </div>
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="text-gray-700">
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/birth-details')}
            className="bg-white border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Regenerate Insights
          </Button>
          <Button 
            onClick={() => setLocation('/ai-chat')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            Ask AI About My Insights
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default InsightsPage;
