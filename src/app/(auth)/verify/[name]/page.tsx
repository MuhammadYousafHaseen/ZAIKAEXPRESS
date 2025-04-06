"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifyScema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username?: string }>();
  const { toast } = useToast();

  // Ensure username exists before making request
  useEffect(() => {
    if (!params.username) {
      toast("Error", {
        description: "Username is missing. Please check your URL.",
      });
      router.replace("/sign-in");
    }
  }, [params.username, router, toast]);

  // zod implementation
  const form = useForm<z.infer<typeof verifyScema>>({
    resolver: zodResolver(verifyScema),
    defaultValues: { code: "" }, // Ensure a default value is provided
  });

  const onSubmit = async (data: z.infer<typeof verifyScema>) => {
    if (!params.username) return;

    try {
      const response = await axios.post("/api/user/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast("Success!", {
        description: response.data.message ?? "Your account has been verified successfully!",
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error verifying account:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message ?? "Verification failed. Please try again.";

      toast("Error!", { description: errorMessage });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl transition-all duration-300">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Verify Your Account</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Please enter the code sent to your email.</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Verification Code Input */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your verification code"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
              Verify Account
            </Button>

            {/* Resend Link */}
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Didn’t receive a code?{" "}
              <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Resend Code</span>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;

