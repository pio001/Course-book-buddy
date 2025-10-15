import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, BookOpen, DollarSign, Package, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { booksAPI, ordersAPI, usersAPI, uploadAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [newBook, setNewBook] = useState<any>({ title: "", author: "", price: 0, stock_quantity: 0, category: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, o, u] = await Promise.all([booksAPI.getAll(), ordersAPI.getAll(), usersAPI.getAll()]);
        setBooks(b.data || []);
        setOrders(o.data || []);
        setUsers(u.data || []);
      } catch (e: any) {
        toast({ title: "Failed to load admin data", description: e.response?.data?.msg || "Please try again", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = useMemo(() => orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0), [orders]);
  const activeUsers = useMemo(() => users.length, [users]);
  const booksInStock = useMemo(() => books.reduce((sum: number, b: any) => sum + (b.stock_quantity || 0), 0), [books]);
  const pendingOrders = useMemo(() => orders.filter((o: any) => ["pending", "processing"].includes(o.status)).length, [orders]);
  const lowStockBooks = useMemo(() => books.filter((b: any) => (b.stock_quantity || 0) <= (b.low_stock_threshold || 10)), [books]);

  const handleCreateBook = async () => {
    try {
      let cover_image_url: string | undefined = undefined;
      if (imageFile) {
        const res = await uploadAPI.image(imageFile);
        cover_image_url = res.data.url;
      }
      const payload = { ...newBook, price: Number(newBook.price), stock_quantity: Number(newBook.stock_quantity), cover_image_url };
      const created = await booksAPI.create(payload);
      setBooks([created.data, ...books]);
      setNewBook({ title: "", author: "", price: 0, stock_quantity: 0, category: "" });
      setImageFile(null);
      toast({ title: "Book created", description: "New book added to inventory" });
    } catch (e: any) {
      toast({ title: "Create failed", description: e.response?.data?.msg || "Please check inputs", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookshop operations</p>
          </div>
        </div>

        {/* Stats Grid (dynamic) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Total Revenue</p><p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Active Users</p><p className="text-2xl font-bold">{activeUsers}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Books in Stock</p><p className="text-2xl font-bold">{booksInStock}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Pending Orders</p><p className="text-2xl font-bold">{pendingOrders}</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders (dynamic) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><div className="flex items-center justify-between"><CardTitle>Recent Orders</CardTitle></div></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{order.order_number || order._id}</p>
                        <p className="text-sm text-muted-foreground">{order?.user?.email || "Unknown user"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₦{order.total_amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Low stock + Create Book */}
          <div className="space-y-6">
            <Card className="border-destructive/50">
              <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Low Stock Alert</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockBooks.map((book: any) => (
                    <div key={book._id} className="p-3 bg-destructive/10 rounded-lg">
                      <p className="font-semibold text-sm mb-1">{book.title}</p>
                      <p className="text-xs text-muted-foreground">Only {book.stock_quantity} left</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Add New Book</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <input className="input" placeholder="Title" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
                <input className="input" placeholder="Author" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} />
                <input className="input" placeholder="Category" value={newBook.category} onChange={e => setNewBook({ ...newBook, category: e.target.value })} />
                <input className="input" type="number" placeholder="Price" value={newBook.price} onChange={e => setNewBook({ ...newBook, price: e.target.value })} />
                <input className="input" type="number" placeholder="Stock Qty" value={newBook.stock_quantity} onChange={e => setNewBook({ ...newBook, stock_quantity: e.target.value })} />
                <input className="input" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                <Button className="w-full" onClick={handleCreateBook}>Create Book</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
