"use client";
import { signInAnonymously } from "firebase/auth";
import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!auth) {
        setError(
          "Firebase not configured. Please use the Demo button to test the app.",
        );
        setLoading(false);
        return;
      }

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!auth) {
        setError("Firebase is not configured properly");
        return;
      }

      await signInAnonymously(auth);

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to access demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-border bg-card">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl">Smart Expense Tracker</CardTitle>
            <CardDescription>Manage your finances with ease</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">
                Welcome back!
              </h3>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to track your income and expenses
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </span>
              )}
            </Button>

            <Button
              onClick={handleDemoAccess}
              disabled={loading}
              variant="outline"
              className="w-full text-foreground border-border hover:bg-secondary font-medium h-11"
            >
              {loading ? "Loading..." : "Try Demo"}
            </Button>

            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                This is a demo app. Sign in with your Google account to get
                started.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Track income • Manage expenses • Set budgets • Analyze spending</p>
        </div>
      </div>
    </div>
  );
}
