import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageCircle, ShoppingBag, Users, Wallet } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to AfuChat</h1>
          <p className="text-white/90">The ultimate social commerce platform</p>
        </header>

        {/* Features */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Social Feed</h3>
                <p className="text-xs text-gray-600 mt-1">Connect with friends</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Messaging</h3>
                <p className="text-xs text-gray-600 mt-1">Real-time chat</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold text-sm">AfuAI</h3>
                <p className="text-xs text-gray-600 mt-1">AI assistant</p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20">
              <CardContent className="p-4 text-center">
                <ShoppingBag className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">AfuMall</h3>
                <p className="text-xs text-gray-600 mt-1">Shop products</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-semibold">AfuWallet</h3>
                  <p className="text-sm text-gray-600">Integrated payment system</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="px-6 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose AfuChat?</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">All-in-One Platform</h3>
                <p className="text-xs text-gray-600">Social media, messaging, shopping, and AI in one app</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Smart AI Assistant</h3>
                <p className="text-xs text-gray-600">Get personalized recommendations and smart replies</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Secure Wallet</h3>
                <p className="text-xs text-gray-600">Safe and easy payments with AfuWallet</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full p-6 bg-white border-t border-gray-200">
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 text-lg font-semibold"
          >
            Get Started
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Join millions of users worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
