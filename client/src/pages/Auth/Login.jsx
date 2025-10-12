import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AmgiLogo from "@/components/AmgiLogo";

import { BookOpen, Sparkles } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the login function from our AuthContext
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    const result = await loginAsGuest();
    if (result.success) {
      navigate("/"); // Navigate to the dashboard on success
    } else {
      setError(result.error || "Failed to log in as guest.");
    }
    setLoading(false);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use the actual login function from the context
    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate("/"); // Navigate to dashboard on success
    } else {
      setError(result.error || "An unknown error occurred.");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Branding and visual */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative animated background */}
        <div className="animated-gradient absolute inset-0 z-0" />

        {/* The rest of your content correctly sits on top. */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <span className="text-2xl font-bold">반디</span>
            <span className="text-2xl font-bold">Bandi</span>
          </Link>

          <div className="space-y-8 max-w-md">
            <h1 className="text-5xl font-bold leading-tight text-balance">
              Unlock Korean fluency with smarter flashcards
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Move beyond simple memorization. Our AI generates contextual sentences
              to help you learn words faster and more effectively.
            </p>

            <div className="space-y-6 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Build Your Vocabulary
                  </h3>
                  <p className="text-blue-100">
                    Create custom decks for every lesson and topic.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Learn in Context</h3>
                  <p className="text-blue-100">
                    AI-powered quizzes turn vocabulary lists into real-world sentences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-blue-200 relative z-10">
          This app is intended to be used as a demo and not for commercial
          purposes.
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-border shadow-lg bg-background">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base">Enter your credentials to access your flashcards.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-muted-foreground hover:bg-foreground text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 bg-transparent hover:bg-muted-foreground hover:border-muted-foreground"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                  Continue as guest
                </Button>
                
                <p className="text-center text-sm text-muted-foreground pt-4">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Sign up for free
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

