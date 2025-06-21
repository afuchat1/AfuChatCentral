import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const { toast } = useToast();
  
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['/api/conversations'],
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div className="section">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3 bg-muted rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="flex-1 bg-transparent border-none outline-none text-foreground"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-border">
        {isLoading ? (
          // Loading skeletons
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="w-5 h-5 rounded-full" />
              </div>
            ))}
          </>
        ) : conversations && conversations.length > 0 ? (
          conversations.map((conversation: any) => (
            <Button
              key={conversation.id}
              variant="ghost"
              className="w-full justify-start p-0 h-auto"
              onClick={() => {
                toast({
                  title: "Chat",
                  description: "Opening chat feature coming soon!",
                });
              }}
            >
              <div className="flex items-center space-x-3 p-4 w-full">
                <div className="relative">
                  {conversation.isGroup ? (
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <img 
                      src={conversation.otherUser?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                      alt="Contact avatar" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-accent rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">
                      {conversation.name || conversation.otherUser?.username || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Last message preview...
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </div>
                </div>
              </div>
            </Button>
          ))
        ) : (
          // Demo conversations when no real conversations
          <>
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto hover:bg-muted/50"
              onClick={() => {
                toast({
                  title: "Demo Chat",
                  description: "This is a demo conversation",
                });
              }}
            >
              <div className="flex items-center space-x-3 p-4 w-full">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Contact avatar" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-accent rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">David Wilson</h3>
                    <span className="text-xs text-muted-foreground">2:30 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Hey! Did you see the new AfuMall deals?
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">2</div>
                </div>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto hover:bg-muted/50"
              onClick={() => {
                toast({
                  title: "Demo Chat",
                  description: "This is a demo conversation",
                });
              }}
            >
              <div className="flex items-center space-x-3 p-4 w-full">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Contact avatar" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">Emma Johnson</h3>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Thanks for the recommendation! 👍
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto hover:bg-muted/50"
              onClick={() => {
                toast({
                  title: "Demo Group Chat",
                  description: "This is a demo group conversation",
                });
              }}
            >
              <div className="flex items-center space-x-3 p-4 w-full">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">Design Team</h3>
                    <span className="text-xs text-muted-foreground">1:15 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Alex: Let's review the new mockups
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">5</div>
                </div>
              </div>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
