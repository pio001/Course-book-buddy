import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// @ts-ignore
import { PaystackButton } from "react-paystack";

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ amount, onSuccess, onCancel }: PaymentFormProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  // Paystack public key - use environment variable or fallback key
  const publicKey =
    import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
    "pk_test_02f7331d32693aa05af79d8c23d0a7021cf08776";

  // Convert amount to kobo (Paystack requires smallest currency unit)
  const amountInKobo = Math.round(amount * 100);

  // Generate unique transaction reference
  const reference = new Date().getTime().toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const componentProps = {
    email: formData.email,
    amount: amountInKobo,
    metadata: {
      name: formData.name,
      phone: formData.phone,
    },
    publicKey,
    reference, // ✅ required by Paystack
    text: `Pay ₦${amount.toLocaleString()}`,
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: `Your payment of ₦${amount.toLocaleString()} has been processed successfully.`,
      });
      onSuccess();
    },
    onClose: () => {
      toast({
        title: "Payment Cancelled",
        description: "You have cancelled the payment.",
        variant: "destructive",
      });
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name) {
      toast({
        title: "Name Required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="08012345678"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Amount to Pay:{" "}
              <span className="font-bold text-primary">
                ₦{amount.toLocaleString()}
              </span>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <PaystackButton
            {...componentProps}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentForm;
