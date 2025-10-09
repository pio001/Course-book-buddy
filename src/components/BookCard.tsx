import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";

interface BookCardProps {
  title: string;
  author: string;
  price: number;
  course: string;
  department: string;
  imageUrl?: string;
  inStock: boolean;
}

const BookCard = ({ 
  title, 
  author, 
  price, 
  course, 
  department, 
  imageUrl = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
  inStock 
}: BookCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-card-hover transition-smooth cursor-pointer">
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {department}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="font-semibold line-clamp-2 mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{author}</p>
        <p className="text-xs text-muted-foreground mb-3">{course}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₦{price.toLocaleString()}</span>
          <Badge variant={inStock ? "default" : "destructive"} className="text-xs">
            {inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
