import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { type BirthDetails } from "@shared/schema";

interface ReadingDisplayProps {
  reading: string;
  isLoading: boolean;
}

export function ReadingDisplay({ reading, isLoading }: ReadingDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sections = reading.split('\n\n').filter(Boolean);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Life Purpose Reading</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {sections.map((section, index) => {
            const [title, ...content] = section.split('\n');
            return (
              <div key={index} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <div className="text-muted-foreground whitespace-pre-line">
                  {content.join('\n')}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
