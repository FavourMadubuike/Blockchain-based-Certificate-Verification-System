import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VerifierLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${VITE_BACKEND_URI}/api/verifiers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token, user } = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8 flex flex-col items-center">
        <div className="bg-green-800 rounded-full p-4 mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" />
            <path d="M8 13l2.5 2.5L16 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-1 text-center text-gray-900">Verifier Portal</h2>
        <p className="text-gray-600 mb-6 text-center">Verify FUTO student certificates</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="font-semibold mb-2 block text-gray-900">Email Address</label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4V4zm2 2v2h12V6H6zm0 4v8h12v-8H6z" stroke="#a3a3a3" strokeWidth="1.5" />
              </svg>
            </span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border rounded-lg w-full pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
          <label className="font-semibold mb-2 block text-gray-900">Password</label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M7 11V7a5 5 0 1 1 10 0v4" stroke="#a3a3a3" strokeWidth="1.5" />
                <rect x="5" y="11" width="14" height="8" rx="2" stroke="#a3a3a3" strokeWidth="1.5" />
              </svg>
            </span>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="border rounded-lg w-full pl-7 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Enter your email and password</p>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-800 text-white w-full rounded-md py-2 font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login to Verify"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => navigate("/verifier-register")}
          className="text-green-600 hover:underline mt-2"
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

export default VerifierLoginForm;