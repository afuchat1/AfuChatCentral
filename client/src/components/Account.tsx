import { useQuery } from "@tanstack/react-query";
import { 
  Edit, 
  Settings, 
  TrendingUp, 
  Users, 
  Palette, 
  Globe, 
  HelpCircle, 
  LogOut, 
  Wallet,
  Plus,
  CheckCircle,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import AdminPanel from "@/components/AdminPanel";

export default function Account() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/stats`],
    enabled: !!user?.id,
  });

  const handleSignOut = () => {
    toast({
      title: "Signing Out",
      description: "Redirecting to sign out...",
    });
    setTimeout(() => {
      window.location.href = "/api/logout";
    }, 1000);
  };

  if (userLoading) {
    return (
      <div className="section">
        {/* Profile Header Skeleton */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
          <div className="flex justify-around mt-6 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-1">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="p-4 space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="flex items-center space-x-4">
          <img 
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
            alt="Profile picture" 
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-white/90">
              @{user?.username || user?.email?.split('@')[0] || 'username'}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Verified</span>
            </div>
          </div>
          <Button 
            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
            onClick={() => {
              toast({
                title: "Edit Profile",
                description: "Profile editing feature coming soon!",
              });
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-6 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : userStats?.posts || 0}
            </div>
            <div className="text-sm text-white/80">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : userStats?.followers || 0}
            </div>
            <div className="text-sm text-white/80">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : userStats?.following || 0}
            </div>
            <div className="text-sm text-white/80">Following</div>
          </div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-card-foreground">AfuWallet</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary/80"
            onClick={() => {
              toast({
                title: "Add Funds",
                description: "Wallet funding feature coming soon!",
              });
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Card className="bg-gradient-to-r from-accent to-primary border-none">
          <CardContent className="p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Balance</span>
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-4">
              ${user?.walletBalance || '0.00'}
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                onClick={() => {
                  toast({
                    title: "Deposit",
                    description: "Deposit feature coming soon!",
                  });
                }}
              >
                Deposit
              </Button>
              <Button 
                className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                onClick={() => {
                  toast({
                    title: "Withdraw",
                    description: "Withdraw feature coming soon!",
                  });
                }}
              >
                Withdraw
              </Button>
              <Button 
                className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                onClick={() => {
                  toast({
                    title: "Transfer",
                    description: "Transfer feature coming soon!",
                  });
                }}
              >
                Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-1">
        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors justify-start"
          onClick={() => {
            toast({
              title: "Account Settings",
              description: "Settings feature coming soon!",
            });
          }}
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground">Account Settings</span>
          <div className="ml-auto" />
        </Button>

        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors justify-start"
          onClick={() => {
            toast({
              title: "Analytics",
              description: "Analytics feature coming soon! Upgrade to Premium for access.",
            });
          }}
        >
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground">Analytics</span>
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-auto">
            Premium
          </div>
        </Button>

        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors justify-start"
          onClick={() => {
            toast({
              title: "Referral Program",
              description: "Referral feature coming soon! Earn points by inviting friends.",
            });
          }}
        >
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground">Referral Program</span>
          <span className="bg-accent text-white text-xs px-2 py-1 rounded-full ml-auto">
            +50 pts
          </span>
        </Button>

        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors justify-start"
          onClick={toggleTheme}
        >
          <Palette className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground">Theme Settings</span>
          <span className="text-xs text-muted-foreground ml-auto capitalize">
            {theme}
          </span>
        </Button>

        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors justify-start"
          onClick={() => {
            toast({
              title: "Language & Region",
              description: "Language settings feature coming soon!",
            });
          }}
        >
          <Globe className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground">Language & Region</span>
          <div className="ml-auto" />
        </Button>

        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors justify-start"
          onClick={() => {
            toast({
              title: "Help & Support",
              description: "Support feature coming soon!",
            });
          }}
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground">Help & Support</span>
          <div className="ml-auto" />
        </Button>

        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="text-red-600 dark:text-red-400">Sign Out</span>
          <div className="ml-auto" />
        </Button>
      </div>
    </div>
  );
}
