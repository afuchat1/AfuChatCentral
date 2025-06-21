import { useState } from "react";
import { Bell, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TopBarProps {
  onSearchFocus?: () => void;
}

export default function TopBar({ onSearchFocus }: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    onSearchFocus?.();
  };

  return (
    <header className="bg-background border-b border-border px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {!isSearchOpen ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">AfuChat</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  toast({
                    title: "Notifications",
                    description: "You have 3 new notifications",
                  });
                }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={handleSearchClick}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-3 w-full">
            <Input 
              placeholder="Search users, posts, products..." 
              className="flex-1 border-border rounded-full px-4 py-2"
              autoFocus
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
