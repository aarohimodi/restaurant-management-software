"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/dashboard");
        return;
      }
      toast.error(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-black px-6 pt-8 pb-7 text-center">
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg overflow-hidden">
              <Image
                src="/gabbar-logo.png"
                alt="Gabbar Logo"
                width={110}
                height={110}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>

            <p className="mt-1 text-sm text-slate-300">
              Sign in to your restaurant management panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-7">
            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required.",
                  },
                })}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t bg-slate-50 px-6 py-4 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Gabbar Restaurant Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
