import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { Package, Clock, CheckCircle, BookOpen } from "lucide-react";

const StudentDashboard = () => {
  const recommendedBooks = [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      author: "Dr. Robert Williams",
      price: 14500,
      course: "CSC 201",
      department: "Computer Science",
      inStock: true,
    },
    {
      id: 2,
      title: "Database Management Systems",
      author: "Prof. Lisa Anderson",
      price: 13000,
      course: "CSC 202",
      department: "Computer Science",
      inStock: true,
    },
    {
      id: 3,
      title: "Operating Systems Concepts",
      author: "Dr. James Wilson",
      price: 16000,
      course: "CSC 301",
      department: "Computer Science",
      inStock: true,
    },
  ];

  const orders = [
    { id: "ORD-001", status: "Delivered", items: 2, total: 27000, date: "2025-01-15" },
    { id: "ORD-002", status: "In Transit", items: 1, total: 15000, date: "2025-01-18" },
    { id: "ORD-003", status: "Processing", items: 3, total: 42500, date: "2025-01-20" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "In Transit":
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "Delivered":
        return "secondary";
      case "In Transit":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Computer Science • 300 Level</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Books Purchased</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-gradient-secondary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-2xl font-bold">₦284K</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Books */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recommended for Your Courses</h2>
                <Link to="/browse">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedBooks.map((book) => (
                  <BookCard key={book.id} {...book} />
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={getStatusVariant(order.status)} className="gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                            <span className="font-semibold">{order.id}</span>
                          </div>
                          <span className="font-bold">₦{order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{order.items} items</span>
                          <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/browse">
                  <Button variant="outline" className="w-full justify-start">
                    Browse Books
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  Track Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  My Profile
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Deliveries */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Order #ORD-002</p>
                    <p className="text-xs text-muted-foreground">Estimated: Jan 22, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">CSC 201</Badge>
                <Badge variant="outline" className="w-full justify-start">CSC 202</Badge>
                <Badge variant="outline" className="w-full justify-start">CSC 301</Badge>
                <Badge variant="outline" className="w-full justify-start">MTH 201</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
