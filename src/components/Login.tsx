import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'aadyanvi123' && password === 'pass@123') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl">
        {/* Left side image */}
        <div className="hidden md:block w-1/2 bg-gradient-to-r from-[#08AFF1] to-[#A4CE3A]">
          <div className="p-12">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
            <p className="text-white/90">Manage your investments and track your portfolio with ease</p>
          </div>
        </div>

        {/* Right side login form */}
        <div className="w-full md:w-1/2 px-8 py-12">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Login</h2>
                <p className="mt-2 text-sm text-gray-600">Welcome back! Please login to your account.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#AACF45] text-white hover:bg-[#99bb3f]"
                >
                  Login
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p className="mt-4">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      className="text-[#08AFF1] hover:text-[#0899d1]"
                      onClick={() => navigate('/register')}
                    >
                      Sign Up
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
