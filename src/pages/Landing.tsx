import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Brain, Target, Shield, Zap, PiggyBank, BarChart3, Users } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized financial recommendations based on your unique money personality"
    },
    {
      icon: PiggyBank,
      title: "Smart Savings Buckets",
      description: "Organize your money into custom buckets for different goals and watch them grow"
    },
    {
      icon: TrendingUp,
      title: "Investment Made Easy",
      description: "Choose AI-managed portfolios or pick your own investments with expert guidance"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track your spending, savings, and investments with beautiful, actionable dashboards"
    },
    {
      icon: Zap,
      title: "Automated Rules",
      description: "Set up smart rules to automate your finances and reach your goals faster"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted and protected with industry-leading security standards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Limited Time: Get 3 months premium free when you sign up today</span>
            <button 
              onClick={() => navigate("/auth")}
              className="ml-2 text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              Claim Offer
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Your Financial Future Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Take control of your money with intelligent tools that adapt to your unique financial personality and goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/auth")}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/auth")}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10">
            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10">
            <div className="text-4xl font-bold text-primary mb-2">$50M+</div>
            <div className="text-muted-foreground">Money Managed</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10">
            <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-muted-foreground">User Rating</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make managing your money effortless and effective
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in border-primary/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
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

        {/* How It Works */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes, not hours
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your account and tell us about your financial personality" },
              { step: "2", title: "Set Goals", description: "Define your financial goals and let our AI create a personalized plan" },
              { step: "3", title: "Achieve Success", description: "Watch your wealth grow with automated insights and smart recommendations" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Loved by Thousands</h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.", role: "Entrepreneur", text: "This app completely changed how I manage my finances. The AI recommendations are spot on!" },
              { name: "James K.", role: "Software Engineer", text: "I've tried many finance apps, but this one actually helps me reach my goals faster." },
              { name: "Emily R.", role: "Teacher", text: "Finally, an app that understands my financial personality. It's like having a personal financial advisor." }
            ].map((testimonial, index) => (
              <Card key={index} className="border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12 border border-primary/20">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Financial Future?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already taking control of their finances
          </p>
          <Button 
            size="lg" 
            className="text-lg px-12 py-6 h-auto"
            onClick={() => navigate("/auth")}
          >
            Start Your Journey Today
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free to start • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
