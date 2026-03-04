import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PricingPage = () => {
  const { user } = useAuth();
  const currentPlan = user?.plan || "free";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-4">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Upgrade to Pro
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Contact me on Telegram to complete payment.
          </p>
        </div>

        <div className="max-w-2xl mx-auto grid gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Crown className="h-5 w-5" />
                  Pro Plan
                </CardTitle>
                <Badge
                  variant={currentPlan === "pro" ? "default" : "secondary"}
                >
                  {currentPlan === "pro" ? "Current Plan" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Higher usage limits for templates and email designs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Priority access for growth features
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Plan status reflected across frontend and backend
                </li>
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button asChild className="w-full sm:w-auto">
                  <a
                    href="https://t.me/hubo_ai"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact @hubo_ai on Telegram
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/tools">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
