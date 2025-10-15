import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { booksAPI, wishlistAPI } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Browse = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await booksAPI.getAll();
      setBooks(res.data);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b: any) =>
      [b.title, b.author, b.category].some((f: string) => f?.toLowerCase().includes(q))
    );
  }, [search, books]);

  const handleAddToCart = async (bookId: string) => {
    try {
      await addItem(bookId, 1);
      toast({ title: "Added to cart", description: "Book added to your cart" });
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        toast({ title: "Login required", description: "Please login to add items to your cart" });
        navigate('/auth');
        return;
      }
      toast({ title: "Unable to add", description: e.response?.data?.msg || "Please try again", variant: "destructive" });
    }
  };

  const handleToggleWishlist = async (bookId: string) => {
    try {
      await wishlistAPI.add(bookId);
      toast({ title: "Wishlisted", description: "Book added to your wishlist" });
    } catch {
      // If already exists, try remove
      await wishlistAPI.remove(bookId);
      toast({ title: "Wishlist updated", description: "Book removed from wishlist" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title, author, category..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((b: any) => (
            <BookCard
              key={b._id}
              title={b.title}
              author={b.author}
              price={b.price}
              course={b.category || ""}
              department={b.category || ""}
              imageUrl={b.cover_image_url}
              inStock={b.stock_quantity > 0}
              onAddToCart={() => handleAddToCart(b._id)}
              onToggleWishlist={() => handleToggleWishlist(b._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;