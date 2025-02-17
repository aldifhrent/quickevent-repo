"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { loginSchema, loginValues } from "@/schema/user";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const form = useForm<loginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: loginValues) => {
    try {
      setLoading(true);
      // Gunakan redirect: false agar kita bisa mengecek response dari signIn
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        // Jika result.error adalah "CredentialsSignin", kita ganti dengan pesan custom
        let errorMessage = result.error;
        if (result.error === "CredentialsSignin") {
          errorMessage = "Email atau password salah";
        }
        toast.error({
          variant: "destructive",
          description: errorMessage,
        });
      } else {
        toast.success({
          variant: "default",
          description: "Signed in successfully",
        });
        router.push(result?.url || "/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data.message || "Something went wrong";
        toast({
          variant: "destructive",
          description: message,
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-[350px]"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@example.com"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl className="relative">
                <div className="flex items-center">
                  <Input
                    placeholder="******"
                    {...field}
                    disabled={loading}
                    type={checked ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setChecked(!checked)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {checked ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
