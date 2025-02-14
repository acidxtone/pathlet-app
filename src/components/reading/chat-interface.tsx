import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  onAskQuestion: (question: string) => Promise<void>;
  isLoading?: boolean;
}

export function ChatInterface({ onAskQuestion, isLoading }: ChatInterfaceProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    try {
      await onAskQuestion(question);
      setQuestion('');
    } catch (error) {
      console.error('Failed to ask question:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ask Follow-up Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Textarea
              placeholder="Ask a question about your reading..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              rows={2}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Ask about specific aspects of your reading. For deeper insights, consider exploring the topics mentioned above.
            </p>
          </div>
          <Button 
            type="submit" 
            disabled={!question.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Answer...
              </>
            ) : (
              'Ask Question'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
