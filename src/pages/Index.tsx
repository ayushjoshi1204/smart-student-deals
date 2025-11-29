import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-image.jpg";
import { 
  Sparkles, 
  Target, 
  ShieldCheck, 
  TrendingDown, 
  GraduationCap, 
  Store, 
  LogOut 
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    setProfile(data);
    
    if (data?.user_type === "student") {
      navigate("/student");
    } else if (data?.user_type === "vendor") {
      navigate("/vendor");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Recommendations",
      description: "30-second quiz to find your perfect tech match",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Budget Optimizer",
      description: "Smart suggestions within your budget range",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Trusted Vendors",
      description: "Verified sellers with quality ratings",
    },
    {
      icon: <TrendingDown className="h-6 w-6" />,
      title: "Student-Only Pricing",
      description: "Exclusive discounts verified students",
    },
  ];

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
              {user ? (
                <>
                  <Badge variant="secondary" className="hidden sm:flex">
                    {profile?.user_type === "student" ? "Student" : "Vendor"}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="default" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <Badge variant="secondary" className="w-fit">
                AI-Powered Student Marketplace
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Get the Best{" "}
                <span className="gradient-hero bg-clip-text text-transparent">
                  Student Prices
                </span>{" "}
                on Tech
              </h1>
              <p className="text-xl text-muted-foreground">
                AI-driven recommendations, verified vendors, and exclusive student discounts 
                on laptops, phones, tablets, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="hero" 
                  onClick={() => navigate("/auth")}
                  className="text-lg"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  I'm a Student
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/auth")}
                  className="text-lg"
                >
                  <Store className="mr-2 h-5 w-5" />
                  I'm a Vendor
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img 
                src={heroImage} 
                alt="Tech products showcase" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Why StudentMarket?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We solve real problems students face when buying tech
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-border hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Find Your Perfect Tech?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of students getting the best deals on tech products
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => navigate("/auth")}
                className="text-lg"
              >
                Start Shopping Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 StudentMarket. Empowering students with smart tech choices.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;