import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    rating: string;
    reviewsCount: number;
    seller: {
      username: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart!`,
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-32 object-cover cursor-pointer hover:scale-105 transition-transform"
        onClick={() => {
          toast({
            title: "Product Details",
            description: "Product detail view coming soon!",
          });
        }}
      />
      <div className="p-3">
        <h3 className="font-semibold text-card-foreground text-sm mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>
        </div>
        <Button 
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
