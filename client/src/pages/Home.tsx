import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import BottomNavigation from "@/components/BottomNavigation";
import Feed from "@/components/Feed";
import Messages from "@/components/Messages";
import AfuAI from "@/components/AfuAI";
import AfuMall from "@/components/AfuMall";
import Account from "@/components/Account";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const [activeSection, setActiveSection] = useState<'feed' | 'messages' | 'afuai' | 'afumall' | 'account'>('feed');
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <p className="text-gray-600">Loading AfuChat...</p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'feed':
        return <Feed />;
      case 'messages':
        return <Messages />;
      case 'afuai':
        return <AfuAI />;
      case 'afumall':
        return <AfuMall />;
      case 'account':
        return <Account />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      <TopBar />
      
      <main className="pb-20">
        {renderActiveSection()}
      </main>
      
      <BottomNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* Floating Action Button */}
      <Button
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:scale-110 transition-transform z-40"
        onClick={() => {
          // Handle create post/story action
          toast({
            title: "Create Content",
            description: "Post creation feature coming soon!",
          });
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}
