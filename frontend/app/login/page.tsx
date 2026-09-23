"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * BACKEND INTEGRATION NOTE:
 * Target Django REST Framework endpoint when logging in:
 * POST http://localhost:8000/api/auth/login/
 * Body: { email, password }
 * Response: { token, user: { id, name, email, role } }
 */

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/gallery");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-1.5 focus:outline-none mb-2">
            <span className="font-heading text-3xl font-bold tracking-wider uppercase text-foreground">
              Galleria
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          </Link>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Access private viewings, saved artworks, and direct artist communication.
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-sm rounded-none bg-background">
          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto animate-bounce" />
                <h3 className="font-heading text-xl font-bold text-foreground">Welcome Back!</h3>
                <p className="text-xs text-muted-foreground">
                  Authentication verified. Redirecting to gallery collection...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      placeholder="collector@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      Password
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset instructions sent to your email.");
                      }}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 text-xs border-border bg-secondary/20 focus-visible:ring-primary focus-visible:border-primary rounded-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-none border-border text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="remember" className="text-xs text-muted-foreground select-none cursor-pointer">
                    Remember this device for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-widest font-semibold h-11 rounded-none shadow-md mt-2"
                >
                  {isLoading ? "Verifying Credentials..." : "Sign In to Galleria"}
                </Button>

              </form>
            )}

          </CardContent>

          <CardFooter className="bg-secondary/30 border-t border-border/60 p-4 text-center justify-center text-xs text-muted-foreground">
            <span>Don't have an account yet?</span>
            <Link href="/signup" className="ml-1.5 font-semibold text-primary hover:underline flex items-center">
              Create Account <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
