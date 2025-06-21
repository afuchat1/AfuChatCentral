import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Story {
  id: number;
  userId: string;
  imageUrl: string;
  user: {
    id: string;
    username: string;
    profileImageUrl: string;
  };
}

interface StoryListProps {
  stories?: Story[];
}

export default function StoryList({ stories = [] }: StoryListProps) {
  const { toast } = useToast();

  return (
    <div className="px-4 py-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {/* Add Story Button */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          <Button
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground hover:border-primary transition-colors p-0"
            onClick={() => {
              toast({
                title: "Create Story",
                description: "Story creation feature coming soon!",
              });
            }}
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
          </Button>
          <span className="text-xs text-muted-foreground font-medium">Your Story</span>
        </div>

        {/* User Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="story-border">
              <div className="story-inner">
                <img 
                  src={story.user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                  alt={`${story.user.username}'s story`} 
                  className="w-14 h-14 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => {
                    toast({
                      title: "Story Viewer",
                      description: "Story viewing feature coming soon!",
                    });
                  }}
                />
              </div>
            </div>
            <span className="text-xs text-foreground font-medium truncate max-w-[60px]">
              {story.user.username}
            </span>
          </div>
        ))}

        {/* Demo Stories when no real stories */}
        {stories.length === 0 && (
          <>
            <div className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div className="story-border">
                <div className="story-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Demo story" 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-foreground font-medium">sarah_m</span>
            </div>

            <div className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div className="story-border">
                <div className="story-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Demo story" 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-foreground font-medium">alex_dev</span>
            </div>

            <div className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div className="story-border">
                <div className="story-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Demo story" 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-foreground font-medium">jenny_k</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
