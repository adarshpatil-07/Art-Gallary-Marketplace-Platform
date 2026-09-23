"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShoppingBag,
  Palette,
  CheckCircle2,
  ArrowRight,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BACKEND INTEGRATION NOTE:
 * Target Django REST Framework endpoint when registering a new user:
 * POST http://localhost:8000/api/auth/register/
 * Body: {
 *   name,
 *   email,
 *   password,
 *   role: "buyer" | "artist",
 *   portfolioUrl?: string (for artist role)
 * }
 */

type UserRole = "buyer" | "artist";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify your entry.");
      return;
    }

    if (!agreedTerms) {
      setErrorMessage("You must accept the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);

    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(role === "artist" ? "/gallery" : "/gallery");
      }, 2000);
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-1.5 focus:outline-none mb-2">
            <span className="font-heading text-3xl font-bold tracking-wider uppercase text-foreground">
              Galleria
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          </Link>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Join the Fine Art Marketplace
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Select your account type to get started with Galleria.
          </p>
        </div>

        {/* Signup Card */}
        <Card className="border-border shadow-sm rounded-none bg-background">
          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {isSuccess ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto animate-bounce" />
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {role === "artist" ? "Artist Account Created!" : "Collector Account Created!"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Welcome to Galleria. Your account profile has been registered in our ledger. Redirecting to collection...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Role Selection Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    I am registering as:
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Buyer Role Card */}
                    <button
                      type="button"
                      onClick={() => setRole("buyer")}
                      className={cn(
                        "p-3.5 border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer",
                        role === "buyer"
                          ? "border-primary bg-accent/40 ring-1 ring-primary/40"
                          : "border-border/80 bg-secondary/20 hover:border-border"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <ShoppingBag className={cn("h-4 w-4", role === "buyer" ? "text-primary" : "text-muted-foreground")} />
                        <span className={cn("h-2 w-2 rounded-full", role === "buyer" ? "bg-primary" : "bg-transparent")} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Buyer / Collector</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                          Discover & acquire original artworks.
                        </p>
                      </div>
                    </button>

                    {/* Artist Role Card */}
                    <button
                      type="button"
                      onClick={() => setRole("artist")}
                      className={cn(
                        "p-3.5 border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer",
                        role === "artist"
                          ? "border-primary bg-accent/40 ring-1 ring-primary/40"
                          : "border-border/80 bg-secondary/20 hover:border-border"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Palette className={cn("h-4 w-4", role === "artist" ? "text-primary" : "text-muted-foreground")} />
                        <span className={cn("h-2 w-2 rounded-full", role === "artist" ? "bg-primary" : "bg-transparent")} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Artist / Creator</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                          Exhibit portfolio & list original works.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        type="text"
                        placeholder={role === "artist" ? "Helena Vance" : "Eleanor Vance"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 h-10 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        type="email"
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-10 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                      />
                    </div>
                  </div>

                  {/* Artist Portfolio Link (Only visible if Artist role) */}
                  {role === "artist" && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        Portfolio / Website URL <span className="text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="url"
                          placeholder="https://artistportfolio.com"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          className="pl-9 h-10 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 pr-8 h-10 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-9 pr-8 h-10 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="flex items-start space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded-none border-border text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-normal select-none cursor-pointer">
                    I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>.
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-11 rounded-none shadow-md"
                >
                  {isLoading
                    ? "Creating Account..."
                    : role === "artist"
                    ? "Create Artist Account"
                    : "Create Collector Account"}
                </Button>

              </form>
            )}

          </CardContent>

          <CardFooter className="bg-secondary/30 border-t border-border/60 p-4 text-center justify-center text-xs text-muted-foreground">
            <span>Already have an account?</span>
            <Link href="/login" className="ml-1.5 font-semibold text-primary hover:underline flex items-center">
              Sign In <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
