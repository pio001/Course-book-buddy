import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { authAPI, usersAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({
    first_name: "",
    last_name: "",
    phone: "",
    address: { street: "", city: "", state: "", country: "", zip: "" },
  });

  useEffect(() => {
    const load = async () => {
      const me = await authAPI.getMe();
      const u = me.data;
      setForm({
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        phone: u.phone || "",
        address: u.address || { street: "", city: "", state: "", country: "", zip: "" },
      });
    };
    load();
  }, []);

  const setField = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));
  const setAddr = (key: string, value: any) => setForm((f: any) => ({ ...f, address: { ...f.address, [key]: value } }));

  const save = async () => {
    try {
      await usersAPI.updateMe(form);
      await refreshProfile();
      toast({ title: "Profile updated", description: "Your changes have been saved" });
    } catch (e: any) {
      toast({ title: "Update failed", description: e.response?.data?.msg || "Please try again", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="First Name" value={form.first_name} onChange={e => setField("first_name", e.target.value)} />
            <Input placeholder="Last Name" value={form.last_name} onChange={e => setField("last_name", e.target.value)} />
            <Input placeholder="Phone" value={form.phone} onChange={e => setField("phone", e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Street" value={form.address.street} onChange={e => setAddr("street", e.target.value)} />
              <Input placeholder="City" value={form.address.city} onChange={e => setAddr("city", e.target.value)} />
              <Input placeholder="State" value={form.address.state} onChange={e => setAddr("state", e.target.value)} />
              <Input placeholder="Country" value={form.address.country} onChange={e => setAddr("country", e.target.value)} />
              <Input placeholder="Zip" value={form.address.zip} onChange={e => setAddr("zip", e.target.value)} />
            </div>
            <Button onClick={save} className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;