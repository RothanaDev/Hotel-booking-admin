"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { setUserStorage } from "@/lib/auth";
import * as api from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.loginUser({ email, password });

      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;

      if (!accessToken) {
        throw new Error("No token received from server");
      }

      const role = response.role || "ADMIN";

      if (typeof window !== "undefined") {
        const userData = {
          id: response.id || response.currentUser,
          email: email,
          name: response.currentUser?.split('@')[0] || email.split('@')[0],
          role: role,
          accessToken: accessToken,
          refreshToken: refreshToken,
          token: accessToken,
        };
        console.log("Storing user data:", userData);

        setUserStorage(userData);
      }

      setShowToast(true);
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      let errorMessage = "Login failed. Please check your credentials.";

      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "Your account does not exist Please register";
        } else if (err.response.status === 401) {
          errorMessage = "Invalid password. Please try again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('/images/bg-image.avif')] px-4 relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      {/* Toast Notification */}
      <div
        className={`fixed top-5 right-5 bg-white rounded-xl shadow-2xl border border-green-100 p-4 flex items-start gap-3 min-w-[320px] transition-all duration-500 z-50 ${showToast
          ? "translate-x-0 opacity-100"
          : "translate-x-[500px] opacity-0"
          }`}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            Login Successful!
          </h3>
          <p className="text-sm text-gray-600">
            Welcome back! Redirecting to dashboard...
          </p>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-md bg-white/95 shadow-2xl border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-24 w-24 rounded-2xl bg-white p-2 flex items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                <img
                  src="/images/logo.png"
                  alt="RN HOTEL Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">
            RN HOTEL
          </CardTitle>
          <CardDescription className="text-gray-500 font-medium">
            Sign in to your premium hotel management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
