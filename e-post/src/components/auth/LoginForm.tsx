import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Package } from "lucide-react";
import { ToastContainer} from "react-toastify";
import { toastError, toastSuccess } from "../../lib/toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const res = await login(email, password); // now returns full JSON response
    
    if (res.status === 200) {
      toastSuccess("Login Successful");
      navigate("/dashboard");
    }else if (res.status === 500) { 
      toastError("Server Error");
      setIsLoading(false);
      navigate("/login");
    }
    else {
      toastError("Login Unsuccessful."+ res.data.message);
      setIsLoading(false);
      navigate("/login");
    }
    
  };

  return (
    <div>
      <ToastContainer />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            Parcel Management System
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className={`text-sm text-primary hover:underline ${
                    isLoading ? "pointer-events-none opacity-50" : ""
                  }`}
                  tabIndex={isLoading ? -1 : undefined}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-muted-foreground mt-2">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className={`text-primary hover:underline ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
              tabIndex={isLoading ? -1 : undefined}
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
