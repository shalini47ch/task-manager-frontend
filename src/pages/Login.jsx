import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        userName,
        password,
      });

      localStorage.setItem("token", res.data);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Please check your username & password.", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main login container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white bg-opacity-10 rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 transform transition-all duration-500 hover:scale-105">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white text-opacity-70 text-sm">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username field */}
            <div className="relative group">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                  focusedField === "username" ? "opacity-30" : ""
                }`}
              ></div>
              <div className="relative">
                <User
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "username"
                      ? "text-purple-400"
                      : "text-white text-opacity-50"
                  }`}
                />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Username"
                  className={`w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-purple-400 transition-all duration-300 ${
                    focusedField === "username" ? "bg-opacity-20" : ""
                  }`}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="relative group">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                  focusedField === "password" ? "opacity-30" : ""
                }`}
              ></div>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "password"
                      ? "text-purple-400"
                      : "text-white text-opacity-50"
                  }`}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Password"
                  className={`w-full pl-12 pr-12 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-purple-400 transition-all duration-300 ${
                    focusedField === "password" ? "bg-opacity-20" : ""
                  }`}
                />
              </div>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full relative overflow-hidden rounded-2xl py-4 font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:scale-100 group ${
                isLoading
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-2xl"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>

              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent transform skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            {/* Forgot password */}
            <div className="text-center">
              <a
                href="#"
                className="text-white text-opacity-70 hover:text-purple-400 text-sm transition-colors duration-300 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Register link */}
          <div className="mt-8 pt-6 border-t border-white border-opacity-10 text-center">
            <p className="text-white text-opacity-70 text-sm mb-4">
              Don't have an account yet?
            </p>
            <a
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-white border-opacity-20 rounded-2xl text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">Create Account</span>
              <Sparkles className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 flex justify-center space-x-6 text-white text-opacity-50 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
