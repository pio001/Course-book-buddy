import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, TrendingUp, Shield, Truck } from "lucide-react";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import heroImage from "@/assets/hero-bookshop.jpg";

const Index = () => {
  // Sample data - will be replaced with API calls
  const featuredBooks = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      author: "Dr.A Wahid Okahi",
      price: 15000,
      course: "CSC 101",
      department: "Computer Science",
      inStock: true,
    },
    {
      id: 2,
      title: "Advanced Mathematics Vol. 1",
      author: "Prof. Sarah Asadu",
      price: 12000,
      course: "MTH 201",
      department: "Mathematics",
      inStock: true,
    },
    {
      id: 3,
      title: "Engineering Mechanics",
      author: "Dr. Amina ",
      price: 18000,
      course: "ENG 301",
      department: "Engineering",
      inStock: false,
    },
    {
      id: 4,
      title: "Organic Chemistry Fundamentals",
      author: "Dr. Peter Adeleke",
      price: 16500,
      course: "CHM 102",
      department: "Chemistry",
      inStock: true,
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Course-Based Recommendations",
      description: "Get personalized book suggestions based on your department and courses",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Inventory",
      description: "Check book availability instantly with live stock updates",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and verified transactions with multiple payment options",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick delivery to your campus location or pickup at the bookshop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="University Bookshop" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative container py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Your Academic Success Starts Here
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              Find all your course materials in one place. Personalized recommendations, 
              verified authenticity, and seamless delivery to campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse">
                <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                  Browse Books
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose UniBookshop?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make it easy for students to get the right books at the right time
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-lg p-6 border hover:shadow-card-hover transition-smooth"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Best Sellers
              </h2>
              <p className="text-muted-foreground">
                Most popular textbooks this semester
              </p>
            </div>
            <Link to="/browse">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Link to="/auth" key={book.id}>
                <BookCard {...{...book, id: book.id.toString()}} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who trust UniBookshop for their course materials
            </p>
            <Link to="/auth">
              <Button 
                size="lg" 
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Create Account
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                UniBookshop
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for academic excellence and course materials.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Browse Books</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Departments</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Track Order</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 UniBookshop. All rights reserved.
              Developed and Maintained by PROSPER OFORAH C 
              07080773518
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
