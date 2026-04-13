"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup as signupApi, login as loginApi } from "../../api/auth";
import { useAuthStore } from "../../context/userStore";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      
      // Call signup API
      await signupApi({
        name: data.name,
        email: data.email,
        password: data.password
      });

      // Immediately log in
      const loginResponse = await loginApi(data.email, data.password);
      
      let userObj = loginResponse.user;
      if (!userObj) {
         const decoded: any = jwtDecode(loginResponse.access_token);
         userObj = {
           id: decoded.sub, 
           email: data.email, 
           name: data.name, 
           role: "patient" // Newly signed up users are always patients
         };
      }
      
      login(userObj, loginResponse.access_token);
      router.push(`/${userObj.role}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create account. Email may already be in use.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border-blue-100 shadow-blue-500/10">
        <div className="p-8 text-center space-y-2 border-b border-slate-100 bg-slate-50/50">
          <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <HeartPulse className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create an Account</h1>
          <p className="text-slate-500 text-sm">Join EHCIDB to manage your medical records.</p>
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center border border-red-100">{error}</div>}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.local"
              {...register("email")}
              error={errors.email?.message}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            
            <Button type="submit" isLoading={isSubmitting} className="w-full mt-2 py-3 rounded-xl shadow-lg shadow-blue-500/30">
              Create Account
            </Button>
            
            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
