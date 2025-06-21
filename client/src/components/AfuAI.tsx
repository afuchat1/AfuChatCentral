import { useState } from "react";
import { Brain, WandSparkles, Filter, Lightbulb, Languages, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export default function AfuAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! How can I help you today? I can assist with product recommendations, content suggestions, or answer any questions you have.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/ai/chat', { message });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: data.response,
        timestamp: data.timestamp,
      }]);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="section">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AfuAI Assistant</h2>
          <p className="text-white/90">Your intelligent companion for smarter conversations</p>
        </div>
      </div>

      {/* AI Features */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-primary/20">
            <CardContent className="p-4 text-center">
              <WandSparkles className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Smart Replies</h3>
              <p className="text-xs text-muted-foreground">AI-powered response suggestions</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardContent className="p-4 text-center">
              <Filter className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Content Filter</h3>
              <p className="text-xs text-muted-foreground">Intelligent content moderation</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="p-4 text-center">
              <Lightbulb className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Recommendations</h3>
              <p className="text-xs text-muted-foreground">Personalized content suggestions</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Languages className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Translation</h3>
              <p className="text-xs text-muted-foreground">Real-time language translation</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Chat with AfuAI</h3>
          </div>

          <div className="h-96 flex flex-col">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg px-4 py-2 max-w-xs ${
                    message.type === 'ai' 
                      ? 'bg-muted text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.type === 'user' && (
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm text-foreground">Thinking...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Ask AfuAI anything..." 
                  className="flex-1 border-border rounded-full px-4 py-2 outline-none focus:border-primary transition-colors"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={chatMutation.isPending}
                />
                <Button 
                  className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
                  onClick={handleSendMessage}
                  disabled={chatMutation.isPending || !inputMessage.trim()}
                >
                  <SendHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
