import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { Package, Clock, CheckCircle, BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { booksAPI, ordersAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, o] = await Promise.all([booksAPI.getAll(), ordersAPI.getMyOrders()]);
        setBooks(b.data || []);
        setOrders(o.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalOrders = orders.length;
  const totalSpent = useMemo(() => orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0), [orders]);
  const pendingOrders = orders.filter((o: any) => ["pending", "processing"].includes(o.status)).length;
  const recentOrders = orders.slice(0, 3);
  const recommendedBooks = books.slice(0, 6);

  const getStatusIcon = (status: string) => status === "Delivered" ? <CheckCircle className="h-4 w-4" /> : status === "In Transit" ? <Package className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => status === "Delivered" ? "secondary" : status === "In Transit" ? "default" : "outline";

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back{user ? `, ${user.first_name}!` : "!"}</h1>
          <p className="text-muted-foreground">{user?.department ? "Department • " : ""}{user?.level ? `${user.level} Level` : ""}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Total Orders</p><p className="text-2xl font-bold">{totalOrders}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Books Purchased</p><p className="text-2xl font-bold">{orders.reduce((sum:any,o:any)=>sum+(o.items?.length||0),0)}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Pending Orders</p><p className="text-2xl font-bold">{pendingOrders}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Total Spent</p><p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recommended for Your Courses</h2>
                <Link to="/browse"><Button variant="outline" size="sm">View All</Button></Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedBooks.map((b: any) => (
                  <BookCard
                    key={b._id}
                    title={b.title}
                    author={b.author}
                    price={b.price}
                    course={b.category || ""}
                    department={b.category || ""}
                    imageUrl={b.cover_image_url}
                    inStock={(b.stock_quantity || 0) > 0}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
              <Card><CardContent className="p-0">
                <div className="divide-y">
                  {recentOrders.map((order: any) => (
                    <div key={order._id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusVariant(order.status)} className="gap-1">{getStatusIcon(order.status)}{order.status}</Badge>
                          <span className="font-semibold">{order.order_number || order._id}</span>
                        </div>
                        <span className="font-bold">₦{order.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{order.items?.length || 0} items</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="space-y-2">
              <Link to="/browse"><Button variant="outline" className="w-full justify-start">Browse Books</Button></Link>
              <Link to="/orders"><Button variant="outline" className="w-full justify-start">My Orders</Button></Link>
              <Link to="/wishlist"><Button variant="outline" className="w-full justify-start">Wishlist</Button></Link>
              <Link to="/profile"><Button variant="outline" className="w-full justify-start">My Profile</Button></Link>
            </CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
