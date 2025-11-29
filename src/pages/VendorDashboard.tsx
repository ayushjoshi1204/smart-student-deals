import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, LogOut, Plus, Package, BarChart3, Settings } from "lucide-react";
import { toast } from "sonner";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileData?.user_type !== "vendor") {
      toast.error("Access denied. Vendor account required.");
      navigate("/");
      return;
    }

    setProfile(profileData);
    
    // Fetch product count
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", session.user.id);
    
    setProductCount(count || 0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                StudentMarket
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Vendor</Badge>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Vendor Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Manage your products and reach thousands of students
              </p>
            </div>
            <Button size="lg" variant="hero" onClick={() => navigate("/vendor/add-product")}>
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount}</div>
                <p className="text-xs text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Product impressions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Student saves</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <CardTitle>Manage Products</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  View, edit, and manage your product catalog
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle>View Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track views, clicks, and student engagement
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          {productCount === 0 && (
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Ready to start selling?</h3>
                    <p className="text-muted-foreground">
                      Add your first product and start reaching students looking for 
                      great deals on tech.
                    </p>
                  </div>
                  <Button size="lg" variant="hero" onClick={() => navigate("/vendor/add-product")}>
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;