import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useInsights } from '@/context/insights-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Zod schema for birth details
const BirthDetailsSchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters")
});

type BirthDetailsFormData = z.infer<typeof BirthDetailsSchema>;

const BirthDetailsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setBirthDetails, generateInsights } = useInsights();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<BirthDetailsFormData>({
    resolver: zodResolver(BirthDetailsSchema)
  });

  const onSubmit = async (data: BirthDetailsFormData) => {
    try {
      // Transform data to match InsightsContext expectations
      setBirthDetails({
        date: new Date(data.date),
        time: data.time,
        location: {
          city: data.city,
          country: data.country
        }
      });

      // Generate insights
      await generateInsights();

      // Navigate to insights page
      setLocation('/insights');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process birth details',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-purple-600">
              Enter Your Birth Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <Input 
                  type="date" 
                  {...register('date')}
                  className="mt-1 block w-full"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Time</label>
                <Input 
                  type="time" 
                  {...register('time')}
                  className="mt-1 block w-full"
                />
                {errors.time && (
                  <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth City</label>
                <Input 
                  type="text" 
                  placeholder="Enter birth city"
                  {...register('city')}
                  className="mt-1 block w-full"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Country</label>
                <Input 
                  type="text" 
                  placeholder="Enter birth country"
                  {...register('country')}
                  className="mt-1 block w-full"
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Generate My Insights
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BirthDetailsPage;
