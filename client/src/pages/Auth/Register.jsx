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

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, loginAsGuest } = useAuth();
  const navigate = useNavigate();

    const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    const result = await loginAsGuest();
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Failed to log in as guest.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

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
        <div className="animated-gradient absolute inset-0 z-0" />

        {/* The rest of the content is given a z-index to ensure it sits on top of the animation. */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <span className="text-2xl font-bold">반디</span>
            <span className="text-2xl font-bold">Bandi</span>
          </Link>

          <div className="space-y-8 max-w-md">
            <h1 className="text-5xl font-bold leading-tight text-balance">
              Start your Korean language journey today
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Move beyond simple memorization. Our AI generates contextual
              sentences to help you learn words faster and more effectively.
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
                  <h3 className="font-semibold text-lg mb-1">
                    Learn in Context
                  </h3>
                  <p className="text-blue-100">
                    AI-powered quizzes turn vocabulary lists into real-world
                    sentences.
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

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-border shadow-lg bg-background">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-base">
                Get started with Amgi for free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
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
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 bg-transparent hover:bg-muted-foreground hover:border-muted-foreground"
                  onClick={handleGuestLogin} disabled={loading}
                >
                  Continue as guest
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Sign in
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
