import type React from "react";
import { useState } from "react"; // Standard React hook
import { useNavigate, Link } from "react-router-dom"; // Standard client-side routing
import { useAuth } from "../auth-provider"; // Your auth context hook
import { Button } from "../ui/button"; // Your UI components
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
import { Package } from "lucide-react"; // Icon library
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"; // Radio group UI
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../lib/toast";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications CSS

export function SignupForm() {
  // --- State for form fields ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("staff"); // Default role
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // --- Hooks ---
  const { signup } = useAuth(); // Get signup function from context
  const navigate = useNavigate();

  // --- Validation Handlers ---
  const validateName = () => {
    if (!name.trim()) {
      toastError("Full Name is required.");
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      toastError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toastError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!password.trim()) {
      toastError("Password is required.");
      return false;
    }
    if (password.length < 8) {
      toastError("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      toastError("Passwords do not match. Please ensure both passwords are the same.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateName() || !validateEmail() || !validatePassword() || !validateConfirmPassword()) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await signup(name, email, password, role);

      if (res.status === 201) {
        toastSuccess("User Registered Successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 10000); 
      } 
      else if (res.status === 400) {
        toastError(res.data.message);
        setTimeout(() => {
        navigate("/login");
        }, 2000); 
      }
      else {
        toastError(res.data.message || "Signup failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      toastError(`Signup Failed. ${error?.message || "An error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="w-full flex justify-center mt-24">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName} // Validate on blur
                required
                disabled={isLoading}
              />
            </div>
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail} // Validate on blur
                required
                disabled={isLoading}
              />
            </div>
            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword} // Validate on blur
                required
                disabled={isLoading}
              />
            </div>
            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateConfirmPassword} // Validate on blur
                required
                disabled={isLoading}
              />
            </div>
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                defaultValue="customer"
                value={role}
                onValueChange={setRole}
                className="flex space-x-4"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="r_customer" />
                  <Label htmlFor="r_customer">Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="r_staff" />
                  <Label htmlFor="r_staff">Staff</Label>
                </div>
              </RadioGroup>
            </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className={`text-primary hover:underline ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
              tabIndex={isLoading ? -1 : undefined}
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
  );
}