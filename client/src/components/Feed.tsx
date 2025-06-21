import { useQuery } from "@tanstack/react-query";
import { Brain, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StoryList from "./StoryList";
import PostCard from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Feed() {
  const { toast } = useToast();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/feed'],
  });

  const { data: stories } = useQuery({
    queryKey: ['/api/stories'],
  });

  return (
    <div className="section">
      {/* AI Search Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center space-x-3 bg-background rounded-full px-4 py-3 shadow-sm border border-border">
          <Brain className="w-5 h-5 text-primary" />
          <Input 
            placeholder="Ask AfuAI anything..." 
            className="flex-1 border-none outline-none bg-transparent text-foreground"
            onFocus={() => {
              toast({
                title: "AfuAI",
                description: "Switch to the AfuAI tab for full AI features!",
              });
            }}
          />
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 transition-colors p-1">
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stories Section */}
      <StoryList stories={stories} />

      {/* Posts Feed */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border-b border-border">
                <div className="flex items-center space-x-3 p-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Start following people to see their posts in your feed!</p>
          </div>
        )}
      </div>
    </div>
  );
}
