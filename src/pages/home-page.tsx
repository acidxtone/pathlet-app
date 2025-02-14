import React from "react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBirthDetailsSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

function HomePageContent() {
  const { user, isAuthenticated, loading, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const birthForm = useForm({
    resolver: zodResolver(insertBirthDetailsSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
    },
  });

  const submitBirthDetails = useMutation({
    mutationFn: async (data: any) => {
      if (!user) {
        throw new Error("Please log in first");
      }
      const res = await apiRequest("POST", "/api/birth-details", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your birth details have been processed. Redirecting to your reading...",
      });
      setLocation("/reading");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: any) => {
    await submitBirthDetails.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">Pathlet</h1>
          <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Birth Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={birthForm.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...birthForm.register("name")} />
                {birthForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {birthForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...birthForm.register("birthDate")}
                />
                {birthForm.formState.errors.birthDate && (
                  <p className="text-sm text-destructive">
                    {birthForm.formState.errors.birthDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthTime">Birth Time (HH:MM)</Label>
                <Input
                  id="birthTime"
                  type="time"
                  {...birthForm.register("birthTime")}
                />
                {birthForm.formState.errors.birthTime && (
                  <p className="text-sm text-destructive">
                    {birthForm.formState.errors.birthTime.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthPlace">Birth Place (City, Country)</Label>
                <Input
                  id="birthPlace"
                  placeholder="e.g. London, United Kingdom"
                  {...birthForm.register("birthPlace")}
                />
                {birthForm.formState.errors.birthPlace && (
                  <p className="text-sm text-destructive">
                    {birthForm.formState.errors.birthPlace.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={submitBirthDetails.isPending}>
                {submitBirthDetails.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting</>
                ) : (
                  "Get Your Reading"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomePageContent />
    </AuthProvider>
  );
}