import { Home, MessageCircle, Brain, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeSection: 'feed' | 'messages' | 'afuai' | 'afumall' | 'account';
  onSectionChange: (section: 'feed' | 'messages' | 'afuai' | 'afumall' | 'account') => void;
}

export default function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'feed' as const,
      icon: Home,
      label: 'Feed',
      badge: null,
    },
    {
      id: 'messages' as const,
      icon: MessageCircle,
      label: 'Messages',
      badge: 5,
    },
    {
      id: 'afuai' as const,
      icon: Brain,
      label: 'AfuAI',
      badge: null,
    },
    {
      id: 'afumall' as const,
      icon: ShoppingBag,
      label: 'AfuMall',
      badge: null,
    },
    {
      id: 'account' as const,
      icon: User,
      label: 'Account',
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-background border-t border-border px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center space-y-1 p-2 h-auto ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
