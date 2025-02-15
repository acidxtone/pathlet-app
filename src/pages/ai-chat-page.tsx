import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Send, MessageCircle } from 'lucide-react';
import { useInsights } from '@/context/insights-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const AIChatPage: React.FC = () => {
  const { insights, birthDetails } = useInsights();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Initial AI greeting
  useEffect(() => {
    if (insights && birthDetails) {
      const initialMessage: Message = {
        id: 0,
        text: `Hello! I'm your AI guide for understanding your personal insights. I see you have a ${insights.humanDesign.energyType} energy type with a ${insights.astrology.sunSign} sun sign. What would you like to know more about?`,
        sender: 'ai'
      };
      setMessages([initialMessage]);
    }
  }, [insights, birthDetails]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Placeholder for Hugging Face API call
      const response = await axios.post('https://api-inference.huggingface.co/models/gpt2', {
        inputs: `Context: User has ${insights?.humanDesign.energyType} energy type, ${insights?.astrology.sunSign} sun sign. Question: ${inputMessage}`,
        parameters: { max_new_tokens: 250 }
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse: Message = {
        id: messages.length + 2,
        text: response.data[0]?.generated_text || 'I apologize, but I could not generate a response.',
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI response',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
      <div className="flex-grow flex flex-col max-w-2xl mx-auto w-full p-4">
        <div className="flex items-center mb-4 bg-white shadow-md rounded-lg p-4">
          <MessageCircle className="w-8 h-8 text-purple-600 mr-4" />
          <h1 className="text-2xl font-bold text-purple-600">
            AI Insights Assistant
          </h1>
        </div>

        <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-purple-100 text-purple-800 self-end ml-auto' 
                  : 'bg-gray-100 text-gray-800 mr-auto'
              }`}
            >
              {message.text}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex space-x-2">
          <Input 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your insights..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
