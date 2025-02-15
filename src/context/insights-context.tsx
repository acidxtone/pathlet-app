import React, { createContext, useState, useContext, ReactNode } from 'react';
import { z } from 'zod';

// Zod schema for birth details
export const BirthDetailsSchema = z.object({
  date: z.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  location: z.object({
    city: z.string().min(2),
    country: z.string().min(2)
  })
});

export type BirthDetails = z.infer<typeof BirthDetailsSchema>;

// Insights data structure
export interface InsightsData {
  astrology: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
  };
  humanDesign: {
    energyType: string;
    strategy: string;
    authority: string;
  };
  numerology: {
    lifePath: number;
    destinyNumber: number;
    soulUrgeNumber: number;
  };
}

// Context type
interface InsightsContextType {
  birthDetails: BirthDetails | null;
  insights: InsightsData | null;
  setBirthDetails: (details: BirthDetails) => void;
  generateInsights: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create context
const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

// Provider component
export function InsightsProvider({ children }: { children: ReactNode }) {
  const [birthDetails, setBirthDetailsState] = useState<BirthDetails | null>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setBirthDetails = (details: BirthDetails) => {
    setBirthDetailsState(details);
  };

  const generateInsights = async () => {
    if (!birthDetails) {
      setError('Birth details are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Placeholder for actual microservice call
      const mockInsights: InsightsData = {
        astrology: {
          sunSign: 'Leo',
          moonSign: 'Pisces',
          risingSign: 'Scorpio'
        },
        humanDesign: {
          energyType: 'Generator',
          strategy: 'Wait to Respond',
          authority: 'Sacral'
        },
        numerology: {
          lifePath: 7,
          destinyNumber: 22,
          soulUrgeNumber: 9
        }
      };

      setInsights(mockInsights);
    } catch (err) {
      setError('Failed to generate insights');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    birthDetails,
    insights,
    setBirthDetails,
    generateInsights,
    isLoading,
    error
  };

  return (
    <InsightsContext.Provider value={value}>
      {children}
    </InsightsContext.Provider>
  );
}

// Custom hook to use the insights context
export function useInsights() {
  const context = useContext(InsightsContext);
  if (context === undefined) {
    throw new Error('useInsights must be used within an InsightsProvider');
  }
  return context;
}
