import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, Target, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Investments = () => {
  const [selectedMode, setSelectedMode] = useState<"ai" | "manual" | null>(null);

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Start Investing Today</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Grow your wealth with intelligent investment strategies tailored to your financial goals and risk tolerance.
        </p>
      </div>

      <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900 dark:text-amber-100">
          <strong>Investment Risk:</strong> All investments carry risk and may result in partial or total loss of capital. Past performance does not guarantee future results. Please invest responsibly.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMode === "ai" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedMode("ai")}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-10 h-10 text-primary" />
              {selectedMode === "ai" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">AI-Powered Portfolio</CardTitle>
            <CardDescription>Let our models do the work</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Personalized based on your financial character</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Automatically rebalanced and optimized</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Risk-adjusted to match your tolerance</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Hands-off investment experience</span>
              </li>
            </ul>
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              Recommended for beginners
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMode === "manual" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedMode("manual")}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Target className="w-10 h-10 text-primary" />
              {selectedMode === "manual" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">Manual Selection</CardTitle>
            <CardDescription>Build your own portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Full control over your investments</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Choose specific stocks, ETFs, and funds</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Customize your asset allocation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-sm">Research tools and insights provided</span>
              </li>
            </ul>
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              For experienced investors
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          disabled={!selectedMode}
          className="min-w-[200px]"
        >
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default Investments;
