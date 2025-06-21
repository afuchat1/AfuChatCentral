import { useState } from "react";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PostCardProps {
  post: {
    id: number;
    userId: string;
    content: string;
    imageUrl?: string;
    isSponsored?: boolean;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    user: {
      id: string;
      username: string;
      profileImageUrl?: string;
      isVerified?: boolean;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: likeStatus } = useQuery({
    queryKey: [`/api/posts/${post.id}/liked`],
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', `/api/posts/${post.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/liked`] });
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
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
        description: "Failed to update like",
        variant: "destructive",
      });
    },
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  return (
    <div className="bg-card border-b border-border">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img 
            src={post.user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
            alt={`${post.user.username}'s avatar`} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-card-foreground">{post.user.username}</span>
              {(post.user.isVerified || post.isSponsored) && (
                <CheckCircle className="w-4 h-4 text-primary" />
              )}
              {post.isSponsored && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  Sponsored
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-card-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-card-foreground leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          className="w-full object-cover max-h-96"
        />
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 transition-colors h-auto p-1 ${
                likeStatus?.liked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <Heart className={`w-5 h-5 ${likeStatus?.liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors h-auto p-1"
              onClick={() => {
                toast({
                  title: "Comments",
                  description: "Comments feature coming soon!",
                });
              }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              onClick={() => {
                toast({
                  title: "Share",
                  description: "Share feature coming soon!",
                });
              }}
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary transition-colors p-1"
            onClick={() => {
              toast({
                title: "Bookmark",
                description: "Bookmark feature coming soon!",
              });
            }}
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments Preview */}
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold text-card-foreground">alex_chen</span>
            <span className="text-muted-foreground ml-2">Absolutely stunning! Love the color palette 🎨</span>
          </p>
          <Button 
            variant="link" 
            className="text-sm text-muted-foreground hover:text-card-foreground p-0 h-auto"
            onClick={() => {
              toast({
                title: "Comments",
                description: "View all comments feature coming soon!",
              });
            }}
          >
            View all comments
          </Button>
        </div>
      </div>
    </div>
  );
}
