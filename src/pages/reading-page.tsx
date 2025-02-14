import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type BirthDetails } from "@shared/schema";
import { useLocation } from "wouter";
import { GoogleAd } from '@/components/ads/google-adsense';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ReadingPageProps {
  reading: {
    humanDesign: {
      lifePurpose: string;
      type: string;
      strategy: string;
      authority: string;
      notSelfTheme: string;
      profile: string;
    };
    astrology: {
      relationships: string;
      career: string;
      transits: string;
    };
    numerology: {
      personalYear: string;
      lifePathNumber: string;
      destinyNumber: string;
    };
  };
  onAskQuestion: (question: string) => Promise<void>;
}

function ReadingPage({ reading, onAskQuestion }: ReadingPageProps) {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-4 pb-24 max-w-3xl">
      {/* Top Ad */}
      <div className="mb-6">
        <GoogleAd 
          slot="YOUR_AD_SLOT_1" // Replace with your ad slot ID
          style={{ display: 'block', textAlign: 'center' }}
        />
      </div>

      {/* Human Design Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Badge variant="outline" className="mr-2">Human Design</Badge>
            {reading.humanDesign.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Authority</h4>
              <p className="text-sm text-muted-foreground">{reading.humanDesign.authority}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Profile</h4>
              <p className="text-sm text-muted-foreground">{reading.humanDesign.profile}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-1">Strategy</h4>
            <p className="text-sm">{reading.humanDesign.strategy}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1">Not-Self Theme</h4>
            <p className="text-sm">{reading.humanDesign.notSelfTheme}</p>
          </div>
        </CardContent>
      </Card>

      {/* Mid-content Ad */}
      <div className="my-6">
        <GoogleAd 
          slot="YOUR_AD_SLOT_2" // Replace with your ad slot ID
          style={{ display: 'block', textAlign: 'center' }}
        />
      </div>

      {/* Astrology Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Badge variant="outline" className="mr-2">Astrology</Badge>
            Relationships & Career
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Relationships</h4>
            <p className="text-sm">{reading.astrology.relationships}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-1">Career Path</h4>
            <p className="text-sm">{reading.astrology.career}</p>
          </div>
        </CardContent>
      </Card>

      {/* Numerology Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Badge variant="outline" className="mr-2">Numerology</Badge>
            Your Numbers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Life Path</h4>
              <p className="text-sm text-muted-foreground">{reading.numerology.lifePathNumber}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Destiny</h4>
              <p className="text-sm text-muted-foreground">{reading.numerology.destinyNumber}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Personal Year</h4>
              <p className="text-sm text-muted-foreground">{reading.numerology.personalYear}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-1">Year Theme</h4>
            <p className="text-sm">{reading.numerology.personalYear}</p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Ad before chat */}
      <div className="mb-6">
        <GoogleAd 
          slot="YOUR_AD_SLOT_3" // Replace with your ad slot ID
          style={{ display: 'block', textAlign: 'center' }}
        />
      </div>

      {/* Fixed Chat Interface */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
        <div className="container mx-auto p-4 max-w-3xl">
          <ChatInterface onAskQuestion={onAskQuestion} />
        </div>
      </div>
    </div>
  );
}

function ReadingPageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch reading
  const {
    data: reading,
    isLoading: isLoadingReading,
    error: readingError,
  } = useQuery({
    queryKey: ["reading", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      try {
        const response = await apiRequest<BirthDetails>(`/api/readings/${user.uid}`);
        return response;
      } catch (error) {
        // If no reading found, redirect to home to submit birth details
        setLocation('/');
        return null;
      }
    },
    retry: 1,
  });

  // Ask question mutation
  const askQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      if (!user?.uid) throw new Error("Not authenticated");
      return apiRequest("/api/readings/ask", {
        method: "POST",
        body: { question },
      });
    },
    onSuccess: () => {
      toast({
        title: "Question Sent",
        description: "Your question has been submitted for AI analysis.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onAskQuestion = async (question: string) => {
    await askQuestionMutation.mutateAsync(question);
  };

  if (isLoadingReading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <p className="mb-6">Please submit your birth details to get your personalized reading.</p>
        <Button onClick={() => setLocation('/')}>
          Submit Birth Details
        </Button>
      </div>
    );
  }

  const content = reading.content;

  return (
    <ReadingPage 
      reading={{
        humanDesign: {
          lifePurpose: content.lifePurpose,
          type: content.type,
          strategy: content.strategy,
          authority: content.authority,
          notSelfTheme: content.notSelfTheme,
          profile: content.profile,
        },
        astrology: {
          relationships: content.relationships,
          career: content.career,
          transits: content.transits,
        },
        numerology: {
          personalYear: content.personalYear,
          lifePathNumber: content.lifePathNumber,
          destinyNumber: content.destinyNumber,
        },
      }}
      onAskQuestion={onAskQuestion}
    />
  );
}

export default ReadingPageContent;