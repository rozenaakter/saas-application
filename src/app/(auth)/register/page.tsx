"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, RegisterFormData } from "@/lib/validation";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Update password validation checks
    if (name === "password") {
      setPasswordChecks({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value)
      });
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Clear previous errors
  setErrors({});
  
  // Validate with zod
  const validationResult = registerSchema.safeParse(formData);
  
  if (!validationResult.success) {
    // Validation failed
    const errorMap: Record<string, string> = {};
    
    validationResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      if (fieldName) {
        errorMap[fieldName as string] = issue.message;
      }
    });
    
    setErrors(errorMap);
    return;
  }

  // If validation passes
  setIsLoading(true);

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      toast.error(data.error || "Registration failed");
      return;
    }
    
    toast.success("Account created!");
    setTimeout(() => router.push("/signin"), 1500);
    
  } catch (error) {
    toast.error("Network error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const PasswordRequirement = ({ check, label }: { check: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {check ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-300" />
      )}
      <span className={check ? "text-green-600" : "text-gray-500"}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 via-gray-500 to-purple-500">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Join our community today
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Fields - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name *</label>
                <Input
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name *</label>
                <Input
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email *</label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password *</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className="mt-2 space-y-1">
                <PasswordRequirement 
                  check={passwordChecks.length} 
                  label="At least 8 characters" 
                />
                <PasswordRequirement 
                  check={passwordChecks.uppercase} 
                  label="One uppercase letter" 
                />
                <PasswordRequirement 
                  check={passwordChecks.lowercase} 
                  label="One lowercase letter" 
                />
                <PasswordRequirement 
                  check={passwordChecks.number} 
                  label="One number" 
                />
                <PasswordRequirement 
                  check={passwordChecks.special} 
                  label="One special character" 
                />
              </div>
              
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Form Error */}
            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{errors.form}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}