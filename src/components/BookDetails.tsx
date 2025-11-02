import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { wishlistAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BookDetailsProps {
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    category?: string;
    description?: string;
    stock_quantity: number;
    cover_image_url?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWishlist?: (bookId: string) => Promise<void>;
}

const BookDetails = ({ book, isOpen, onClose, onAddToWishlist }: BookDetailsProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!book) return null;

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addItem(book._id, 1);
      toast({ title: "Added to cart", description: "Book added to your cart" });
    } catch (e: any) {
      toast({ 
        title: "Unable to add", 
        description: e?.response?.data?.message || "Please try again", 
        variant: "destructive" 
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (onAddToWishlist) {
      await onAddToWishlist(book._id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{book.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 md:grid-cols-2">
          <div className="aspect-[3/4] overflow-hidden bg-muted rounded-md">
            <img 
              src={book.cover_image_url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400"} 
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-muted-foreground">{book.author}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {book.category || "General"}
              </Badge>
              <Badge variant={book.stock_quantity > 0 ? "default" : "destructive"} className="text-xs">
                {book.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            
            <p className="text-2xl font-bold text-primary">₦{book.price.toLocaleString()}</p>
            
            {book.description && (
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{book.description}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2 pt-4">
              <Button 
                className="w-full gap-2" 
                disabled={book.stock_quantity <= 0 || isAddingToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-4 w-4" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetails;