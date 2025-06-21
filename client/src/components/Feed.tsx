import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, SendHorizontal, Plus, Camera, Image, Type, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import StoryList from "./StoryList";
import PostCard from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Feed() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const { toast } = useToast();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/feed'],
  });

  const { data: stories } = useQuery({
    queryKey: ['/api/stories'],
  });

  const handleCreatePost = () => {
    toast({
      title: "Post Created",
      description: "Your post has been shared with your followers!",
    });
    setIsCreatePostOpen(false);
    setPostContent("");
  };

  return (
    <div className="section">
      {/* AI Search Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center space-x-3 bg-background rounded-full px-4 py-3 shadow-sm border border-border">
          <Brain className="w-5 h-5 text-primary" />
          <Input 
            placeholder="Search with AI: users, products, trending topics..." 
            className="flex-1 border-none outline-none bg-transparent text-foreground"
            onFocus={() => {
              toast({
                title: "Global AI Search",
                description: "Search across posts, users, products, and get AI recommendations",
              });
            }}
          />
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 transition-colors p-1">
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center space-x-3 overflow-x-auto">
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 bg-primary text-primary-foreground rounded-full px-4 py-2 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="What's happening?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-24 resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Type className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={handleCreatePost} disabled={!postContent.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center space-x-2 rounded-full px-4 py-2 whitespace-nowrap">
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </Button>

          <Badge variant="secondary" className="rounded-full px-3 py-1">
            #Technology
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            #Fashion
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            #Shopping
          </Badge>
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
            <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to AfuChat!</h3>
            <p className="text-muted-foreground mb-4">Start following people and discover amazing content</p>
            <Button onClick={() => setIsCreatePostOpen(true)} className="bg-primary text-primary-foreground">
              Create Your First Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
