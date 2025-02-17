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
import { Button } from "../../../../components/ui/button";
import { registerSchema, registerValues } from "@/schema/user";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedPassword, setCheckedPassword] = useState<boolean>(false);
  const [checkedConfirmPassword, setCheckedConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const form = useForm<registerValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });
  const onSubmit = async (values: registerValues) => {
    try {
      setLoading(true);
      await api("/new", "POST", {
        body: values,
      });
      router.push("/sign-in");
      toast.success("Sign Up Successfully");
    } catch (error) {
      // Mengecek apakah error berasal dari Axios
      if (axios.isAxiosError(error)) {
        // Mengambil pesan error dari response
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        toast.error(error.message);
      } else {
        // Fallback untuk error non-Axios
        toast({
          variant: "destructive",
          description: "An unexpected error occurred",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={loading} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
                    placeholder="Password"
                    {...field}
                    disabled={loading}
                    type={checkedPassword ? "text" : "password"} // Toggle between text and password
                  />
                  <button
                    type="button"
                    onClick={() => setCheckedPassword(!checkedPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {checkedPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl className="relative">
                <div className="flex items-center">
                  <Input
                    placeholder="Password"
                    {...field}
                    disabled={loading}
                    type={checkedConfirmPassword ? "text" : "password"} // Toggle between text and password
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCheckedConfirmPassword(!checkedConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {checkedConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refferal Code</FormLabel>
              <FormControl>
                <Input placeholder="Code" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {loading ? "Loading..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
