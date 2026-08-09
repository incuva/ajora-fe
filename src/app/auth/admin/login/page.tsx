"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/utils/validators";
import { adminLogin } from "@/lib/api/admin-auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import {
  FormField,
  TextInput,
  PasswordInput,
} from "@/components/shared/form-fields";

const AdminLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuthStore();
  const { toastError } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await adminLogin(values);
      setSession(result.role, result.data);
      const redirect = searchParams.get("redirect");
      router.replace(redirect || "/auth/admin/overview");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Login failed. Please check your credentials and try again.";
      toastError("Login failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Àjọrà"
            width={160}
            height={40}
            priority
            className="object-contain"
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-col gap-1.5 mb-6">
            <h1 className="font-playfair text-xl md:text-2xl font-bold text-green">
              Admin Login
            </h1>
            <p className="text-sm text-text-sec font-inter">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField label="Email Address" htmlFor="login-email">
              <TextInput
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="admin@ajora.ng"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <span className="text-red-500 text-xs font-inter mt-1">
                  {errors.email.message}
                </span>
              )}
            </FormField>

            <FormField label="Password" htmlFor="login-password">
              <PasswordInput
                id="login-password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <span className="text-red-500 text-xs font-inter mt-1">
                  {errors.password.message}
                </span>
              )}
            </FormField>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-12 rounded-md bg-green text-white text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

const AdminLoginPage = () => (
  <Suspense fallback={null}>
    <AdminLoginForm />
  </Suspense>
);

export default AdminLoginPage;
