import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PaymentForm from "@/components/PaymentForm";

const Cart = () => {
  const { items, total, updateItem, removeItem, checkout, loading } = useCart();
  const { toast } = useToast();
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [address, setAddress] = useState<any>({ street: "", city: "", state: "", country: "", zip: "" });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleCheckout = async () => {
    try {
      // If card payment is selected, show payment form instead of completing checkout
      if (paymentMethod === 'card') {
        setShowPaymentForm(true);
        return;
      }
      
      const options: any = { delivery_type: deliveryType, payment_method: paymentMethod };
      if (deliveryType === 'delivery') {
        const required = ['street', 'city', 'state', 'country'];
        for (const key of required) {
          if (!address[key]?.trim()) {
            toast({ title: "Address required", description: "Please fill in your delivery address", variant: "destructive" });
            return;
          }
        }
        options.delivery_address = address;
      }
      const orderNumber = await checkout(options);
      toast({ title: "Order placed", description: `Order reference: ${orderNumber}` });
    } catch (e: any) {
      toast({ title: "Checkout failed", description: e.response?.data?.msg || e.message || "Please try again", variant: "destructive" });
    }
  };
  
  const handlePaymentSuccess = async () => {
    try {
      const options: any = { 
        delivery_type: deliveryType, 
        payment_method: 'paystack',
        payment_status: 'paid'
      };
      
      if (deliveryType === 'delivery') {
        options.delivery_address = address;
      }
      
      const orderNumber = await checkout(options);
      setShowPaymentForm(false);
      toast({ title: "Order placed", description: `Order reference: ${orderNumber}` });
    } catch (e: any) {
      toast({ title: "Checkout failed", description: e.response?.data?.msg || e.message || "Please try again", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }
  
  if (showPaymentForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Payment</h1>
          <PaymentForm 
            amount={total} 
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.book._id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{item.book.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.book.author}</p>
                      <p className="text-sm">₦{item.book.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => updateItem(item.book._id, Math.max(item.quantity - 1, 0))}>-</Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button variant="outline" onClick={() => updateItem(item.book._id, item.quantity + 1)}>+</Button>
                      <Button variant="destructive" onClick={() => removeItem(item.book._id)}>Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">₦{total.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Type</Label>
                    <select
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value as 'pickup' | 'delivery')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Paystack</option>
                    </select>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-2">
                      <Label>Delivery Address</Label>
                      <Input
                        placeholder="Street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Country"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        className="mb-2"
                      />
                      <Input
                        placeholder="ZIP/Postal Code"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      />
                    </div>
                  )}

                  <Button className="w-full" onClick={handleCheckout}>
                    {paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;