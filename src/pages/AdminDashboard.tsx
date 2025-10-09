import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Package, 
  AlertTriangle 
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Revenue", value: "₦2.4M", change: "+12.5%", icon: DollarSign, trend: "up" },
    { label: "Active Users", value: "1,234", change: "+8.2%", icon: Users, trend: "up" },
    { label: "Books in Stock", value: "4,567", change: "-3.1%", icon: BookOpen, trend: "down" },
    { label: "Pending Orders", value: "89", change: "+5.4%", icon: Package, trend: "up" },
  ];

  const recentOrders = [
    { id: "ORD-123", student: "John Doe", amount: 15000, status: "Processing" },
    { id: "ORD-124", student: "Jane Smith", amount: 22000, status: "Delivered" },
    { id: "ORD-125", student: "Mike Johnson", amount: 18500, status: "In Transit" },
  ];

  const lowStockBooks = [
    { title: "Introduction to Computer Science", stock: 3 },
    { title: "Advanced Mathematics Vol. 1", stock: 5 },
    { title: "Engineering Mechanics", stock: 2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookshop operations</p>
          </div>
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Add New Book
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-primary' :
                    index === 1 ? 'bg-gradient-secondary' :
                    index === 2 ? 'bg-accent/20' : 'bg-muted'
                  }`}>
                    <stat.icon className={`h-5 w-5 ${
                      index === 0 || index === 1 ? 'text-white' : 
                      index === 2 ? 'text-accent' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <Badge variant={stat.trend === "up" ? "secondary" : "destructive"} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-foreground">
                            {order.student.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.student}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₦{order.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Sales chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockBooks.map((book, index) => (
                    <div key={index} className="p-3 bg-destructive/10 rounded-lg">
                      <p className="font-semibold text-sm mb-1">{book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Only {book.stock} units left
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="destructive" className="w-full mt-4" size="sm">
                  Restock Books
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Manage Inventory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Top Departments */}
            <Card>
              <CardHeader>
                <CardTitle>Top Departments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Computer Science</span>
                  <Badge variant="secondary">245 orders</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engineering</span>
                  <Badge variant="secondary">198 orders</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medicine</span>
                  <Badge variant="secondary">156 orders</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
