import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, LogOut, Sparkles, BookMarked, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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

    if (profileData?.user_type !== "student") {
      toast.error("Access denied. Student account required.");
      navigate("/");
      return;
    }

    setProfile(profileData);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const startQuiz = () => {
    navigate("/quiz");
  };

  const browseProducts = () => {
    navigate("/products");
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
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                StudentMarket
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Student</Badge>
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome back, {profile.full_name}!</h1>
            <p className="text-xl text-muted-foreground">
              Let's find the perfect tech for your needs
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-primary/20"
              onClick={startQuiz}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle>Take AI Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get personalized product recommendations in 30 seconds
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={browseProducts}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <CardTitle>Browse Products</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Explore all available products with student pricing
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <BookMarked className="h-6 w-6" />
                </div>
                <CardTitle>My Bookmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  View your saved products and comparisons
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Featured Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Not sure what you need?</h3>
                  <p className="text-muted-foreground">
                    Our AI-powered quiz helps you find the perfect device based on your course, 
                    budget, and usage patterns.
                  </p>
                </div>
                <Button size="lg" variant="hero" onClick={startQuiz}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;