import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: 'all', name: 'All' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'home', name: 'Home' },
  { id: 'beauty', name: 'Beauty' },
];

export default function AfuMall() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', selectedCategory === 'all' ? undefined : selectedCategory],
  });

  return (
    <div className="section">
      {/* Mall Header */}
      <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">AfuMall</h2>
            <p className="text-white/90">Discover amazing products</p>
          </div>
          <Button 
            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
            onClick={() => {
              toast({
                title: "Shopping Cart",
                description: "Cart feature coming soon!",
              });
            }}
          >
            <ShoppingCart className="w-6 h-6" />
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-3 bg-white/20 rounded-full px-4 py-3">
          <Search className="w-5 h-5 text-white/80" />
          <Input 
            placeholder="Search products..." 
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/70"
          />
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white p-1">
            <Mic className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Categories */}
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            // Loading skeletons
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                  <Skeleton className="w-full h-32" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </>
          ) : products && products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Demo products when no real products
            <>
              <ProductCard 
                product={{
                  id: 1,
                  name: "Trendy Summer Dress",
                  description: "Comfortable cotton blend",
                  price: "49.99",
                  imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
                  rating: "4.8",
                  reviewsCount: 124,
                  seller: { username: "fashionstore" }
                }}
              />
              
              <ProductCard 
                product={{
                  id: 2,
                  name: "Wireless Headphones",
                  description: "Premium sound quality",
                  price: "129.99",
                  imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
                  rating: "4.6",
                  reviewsCount: 89,
                  seller: { username: "techstore" }
                }}
              />
              
              <ProductCard 
                product={{
                  id: 3,
                  name: "Skincare Set",
                  description: "Natural ingredients",
                  price: "79.99",
                  imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
                  rating: "4.9",
                  reviewsCount: 67,
                  seller: { username: "beautystore" }
                }}
              />
              
              <ProductCard 
                product={{
                  id: 4,
                  name: "Smart Phone",
                  description: "Latest technology",
                  price: "699.99",
                  imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
                  rating: "4.7",
                  reviewsCount: 203,
                  seller: { username: "techstore" }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
