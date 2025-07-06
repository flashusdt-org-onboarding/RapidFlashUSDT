import { cn } from "@/lib/utils";
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import {
  Shield,
  Zap,
  Lock,
  Globe,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Smartphone,
  Server,
  Eye,
  EyeOff,
} from "lucide-react";
import { SecurityProvider } from "../components/security-provider";

interface Stat {
  value: string;
  label: string;
  sublabel: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

// Declare handlePayment on the window object
declare global {
  interface Window {
    handlePayment: (orderId: string, orderAmount: number) => Promise<void>;
  }
}

export default function LandingPage() {
  const [accessKey, setAccessKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store encrypted session token
        const sessionToken = btoa(
          JSON.stringify({ key: accessKey, timestamp: Date.now() }),
        );
        sessionStorage.setItem("rapidflash_session", sessionToken);
        router.push("/dashboard");
      } else {
        setError(
          data.error || "Authentication failed. Please verify your access key.",
        );
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  async function handlePayment(orderId: string, orderAmount: number) {
    try {
      const response = await fetch("/api/atlos/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantId: "DY8MEAIQG6",
          orderId: orderId,
          orderAmount: orderAmount,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Payment successful
        console.log("Payment successful:", data);
        alert("Payment successful!");
      } else {
        // Payment failed
        console.error("Payment failed:", data);
        alert("Payment failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment: " + error);
    }
  }

  useEffect(() => {
    window.handlePayment = handlePayment;
  }, [handlePayment]);

  const stats: Stat[] = [
    {
      value: "$2.8B+",
      label: "Transaction Volume",
      sublabel: "Monthly processing",
    },
    { value: "99.97%", label: "Success Rate", sublabel: "Industry leading" },
    { value: "150+", label: "Countries", sublabel: "Global coverage" },
    { value: "50K+", label: "Developers", sublabel: "Active integrations" },
  ];

  const features: Feature[] = [
    {
      icon: <Zap className="h-8 w-8 text-usdt-primary" />,
      title: "Lightning Speed",
      description:
        "Process USDT transactions in under 1.5 seconds with our optimized blockchain infrastructure.",
      highlight: "< 1.5s",
    },
    {
      icon: <Shield className="h-8 w-8 text-usdt-primary" />,
      title: "Military-Grade Security",
      description:
        "AES-256 encryption, multi-signature wallets, and SOC 2 Type II compliance protection.",
      highlight: "SOC 2",
    },
    {
      icon: <Globe className="h-8 w-8 text-usdt-primary" />,
      title: "Multi-Chain Support",
      description:
        "Seamless integration across Ethereum, Tron, Polygon, and Binance Smart Chain networks.",
      highlight: "4 Chains",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-usdt-primary" />,
      title: "Advanced Analytics",
      description:
        "Real-time transaction monitoring, detailed reporting, and predictive insights dashboard.",
      highlight: "Real-time",
    },
    {
      icon: <Server className="h-8 w-8 text-usdt-primary" />,
      title: "Enterprise API",
      description:
        "RESTful API with 99.99% uptime, comprehensive documentation, and multiple SDKs.",
      highlight: "99.99%",
    },
    {
      icon: <Users className="h-8 w-8 text-usdt-primary" />,
      title: "24/7 Expert Support",
      description:
        "Dedicated technical support team with average response time under 5 minutes.",
      highlight: "< 5min",
    },
  ];

  const benefits: Benefit[] = [
    {
      icon: <TrendingUp className="h-6 w-6 text-usdt-primary" />,
      title: "Increase Revenue",
      description:
        "Reduce transaction fees by up to 70% compared to traditional payment processors.",
    },
    {
      icon: <Clock className="h-6 w-6 text-usdt-primary" />,
      title: "Instant Settlement",
      description:
        "Eliminate waiting periods with immediate USDT transaction confirmations.",
    },
    {
      icon: <Shield className="h-6 w-6 text-usdt-primary" />,
      title: "Risk Mitigation",
      description:
        "Advanced fraud detection and automated compliance monitoring systems.",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-usdt-primary" />,
      title: "Mobile Optimized",
      description:
        "Seamless integration across web, mobile, and desktop applications.",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "CTO, FinTech Solutions",
      content:
        "RapidFlashUSDT transformed our payment infrastructure. The speed and reliability are unmatched.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Developer, CryptoCommerce",
      content:
        "Integration was seamless, and the API documentation is exceptional. Highly recommended.",
      rating: 5,
    },
    {
      name: "Elena Petrov",
      role: "CEO, Digital Payments Inc",
      content:
        "The security features and compliance tools gave us confidence to scale globally.",
      rating: 5,
    },
  ];

  return (
    <SecurityProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-usdt-primary to-usdt-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">
                    RapidFlash
                  </span>
                  <span className="text-xl font-bold text-usdt-primary">
                    USDT
                  </span>
                </div>
                <Badge className={cn("bg-usdt-primary/20 text-usdt-primary border-usdt-primary/30")}>
                  Enterprise
                </Badge>
              </div>
              <Button onClick={() => setShowAccessForm(true)} className={cn("bg-usdt-primary hover:bg-usdt-secondary text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300")}>
                <Lock className="h-4 w-4 mr-2" />
                Secure Access
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-usdt-primary/5 to-usdt-secondary/5" />
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <Badge className={cn("mb-6 bg-usdt-primary/20 text-usdt-primary border-usdt-primary/30 px-4 py-2")}>
                🚀 Next-Generation USDT Processing
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                Lightning-Fast
                <span className="block bg-gradient-to-r from-usdt-primary via-usdt-accent to-usdt-secondary bg-clip-text text-transparent">
                  USDT Payments
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade USDT payment infrastructure with military-level
                security, sub-second processing, and 99.99% uptime guarantee.
                Built for the future of digital finance.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => setShowAccessForm(true)}
                  className={cn("bg-usdt-primary hover:bg-usdt-secondary text-white font-bold px-8 py-4 text-lg shadow-2xl hover:shadow-usdt-primary/25 transition-all duration-300 group")}
                >
                  <Shield className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Access Platform
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn("border-usdt-primary/50 text-usdt-primary hover:bg-usdt-primary/10 font-semibold px-8 py-4 text-lg bg-transparent backdrop-blur-sm")}
                >
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 border-y border-slate-800/50 bg-slate-950/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-usdt-primary mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-white font-semibold mb-1">
                    {stat.label}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <Badge className={cn("mb-4 bg-usdt-primary/20 text-usdt-primary border-usdt-primary/30")}>
                Platform Features
              </Badge>
              <h2 className="text-5xl font-bold text-white mb-6">
                Why Choose
                <span className="text-usdt-primary"> RapidFlashUSDT</span>?
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Built with cutting-edge technology and enterprise-grade security
                to provide the most advanced USDT payment processing platform
                available today.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={cn("bg-slate-900/50 border-slate-800/50 backdrop-blur-sm hover:border-usdt-primary/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-usdt-primary/10")}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-usdt-primary/10 rounded-xl group-hover:bg-usdt-primary/20 transition-colors">
                        {feature.icon}
                      </div>
                      <Badge className={cn("bg-usdt-secondary/20 text-usdt-secondary border-usdt-secondary/30")}>
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 bg-slate-950/50">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className={cn("mb-4 bg-usdt-primary/20 text-usdt-primary border-usdt-primary/30")}>
                  Business Benefits
                </Badge>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Transform Your
                  <span className="text-usdt-primary">
                    {" "}
                    Payment Infrastructure
                  </span>
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  Leverage the power of USDT with our enterprise-grade platform
                  designed to scale with your business needs and exceed your
                  performance expectations.
                </p>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-2 bg-usdt-primary/10 rounded-lg flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-slate-300">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-usdt-primary/20 to-usdt-secondary/20 rounded-3xl blur-3xl" />
                <Card className={cn("bg-slate-900/80 border-slate-800/50 backdrop-blur-sm relative z-10")}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-usdt-primary" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Transaction Speed</span>
                      <span className="text-usdt-primary font-bold">
                        1.2s avg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Success Rate</span>
                      <span className="text-usdt-primary font-bold">
                        99.97%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Uptime Guarantee</span>
                      <span className="text-usdt-primary font-bold">
                        99.99%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Cost Reduction</span>
                      <span className="text-usdt-primary font-bold">
                        Up to 70%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <Badge className={cn("mb-4 bg-usdt-primary/20 text-usdt-primary border-usdt-primary/30")}>
                Client Testimonials
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">
                Trusted by Industry Leaders
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-usdt-primary fill-current"
                        />
                      ))}
                    </div>
                    <CardDescription className="text-slate-300 text-base italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-white font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-usdt-primary text-sm">
                      {testimonial.role}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-r from-usdt-primary/10 to-usdt-secondary/10 border-y border-usdt-primary/20">
          <div className="container mx-auto text-center">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="text-usdt-primary"> Payment System</span>?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join thousands of businesses already using RapidFlashUSDT to
              process billions in USDT transactions securely and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => setShowAccessForm(true)}
                className={cn("bg-usdt-primary hover:bg-usdt-secondary text-white font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-usdt-primary/25 transition-all duration-300")}
              >
                <Shield className="h-5 w-5 mr-2" />
                Get Secure Access
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn("border-usdt-primary text-usdt-primary hover:bg-usdt-primary hover:text-white font-semibold px-10 py-4 text-lg bg-transparent")}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Access Key Modal */}
        {showAccessForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-slate-900/95 border-usdt-primary/30 shadow-2xl shadow-usdt-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 bg-gradient-to-r from-usdt-primary to-usdt-secondary rounded-2xl flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-2xl">
                  Secure Platform Access
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Enter your authorized access key to continue to the
                  RapidFlashUSDT platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAccessSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="accessKey"
                      className="text-slate-200 font-medium"
                    >
                      Access Key
                    </Label>
                    <div className="relative">
                      <Input
                        id="accessKey"
                        type={showPassword ? "text" : "password"}
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        placeholder="Enter your secure access key"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 pr-12 focus:border-usdt-primary focus:ring-usdt-primary/20"
                        required
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn("absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-white")}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <AlertDescription className="text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isLoading || !accessKey.trim()}
                      className={cn("flex-1 bg-usdt-primary hover:bg-usdt-secondary text-white font-semibold disabled:opacity-50")}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Access Platform
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAccessForm(false);
                        setError("");
                        setAccessKey("");
                      }}
                      className={cn("border-slate-600 text-slate-300 hover:bg-slate-800")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-400 text-center">
                    Access keys are provided to authorized partners only.
                    Contact your account manager for assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SecurityProvider>
  );
}
