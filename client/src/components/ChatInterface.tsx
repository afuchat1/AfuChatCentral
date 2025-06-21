import { useState, useEffect, useRef } from "react";
import { SendHorizontal, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Message {
  id: number;
  senderId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatInterfaceProps {
  conversationId: string;
  otherUser: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
  onClose: () => void;
}

export default function ChatInterface({ conversationId, otherUser, onClose }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: [`/api/conversations/${conversationId}/messages`],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content,
        messageType: 'text',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversationId}/messages`] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setNewMessage("");
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
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Setup WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      setWsConnection(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message' && data.conversationId === conversationId) {
          queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversationId}/messages`] });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setWsConnection(null);
    };

    return () => {
      ws.close();
    };
  }, [conversationId, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col max-w-md mx-auto">
      {/* Chat Header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img 
            src={otherUser.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
            alt={`${otherUser.username}'s avatar`} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-foreground">{otherUser.username}</h3>
            <p className="text-xs text-muted-foreground">
              {wsConnection ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-muted-foreground hover:text-primary"
            onClick={() => {
              toast({
                title: "Voice Call",
                description: "Voice calling feature coming soon!",
              });
            }}
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-muted-foreground hover:text-primary"
            onClick={() => {
              toast({
                title: "Video Call",
                description: "Video calling feature coming soon!",
              });
            }}
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === otherUser.id ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === otherUser.id
                  ? 'bg-muted text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === otherUser.id
                    ? 'text-muted-foreground'
                    : 'text-primary-foreground/70'
                }`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isPending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !newMessage.trim()}
            className="bg-primary text-primary-foreground p-2 hover:bg-primary/90"
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
