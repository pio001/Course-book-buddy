import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { wishlistAPI } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const [items, setItems] = useState<any[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  const load = async () => {
    const res = await wishlistAPI.get();
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (bookId: string) => {
    await wishlistAPI.remove(bookId);
    await load();
    toast({ title: "Removed", description: "Removed from wishlist" });
  };

  const add = async (bookId: string) => {
    try {
      await addItem(bookId, 1);
      toast({ title: "Added to cart", description: "Book added to your cart" });
    } catch (e: any) {
      toast({ title: "Unable to add", description: e.response?.data?.msg || "Please try again", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Wishlist</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((i: any) => (
            <BookCard
              key={i._id}
              title={i.book.title}
              author={i.book.author}
              price={i.book.price}
              course={i.book.category || ""}
              department={i.book.category || ""}
              imageUrl={i.book.cover_image_url}
              inStock={i.book.stock_quantity > 0}
              onAddToCart={() => add(i.book._id)}
              onToggleWishlist={() => toggle(i.book._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;