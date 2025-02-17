"use client";

import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeProfileSchema, changeProfileValues } from "@/schema/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
const ProfilePage = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(changeProfileSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [form.reset, form, session?.user]);

  const handleSubmit = async (values: changeProfileValues) => {
    try {
      // Check if the session is valid
      if (!session?.user?.access_token) {
        toast.error({
          variant: "destructive",
          description: "Session expired. Please log in again.",
        });
        router.push("/sign-in");
        return;
      }

      await api(
        "/auth/profile",
        "PATCH",
        { body: values, contentType: "application/json" },
        session?.user.access_token
      );

      await update();

      toast.success("Profile updated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          variant: "destructive",
          description: error.response.data?.message || "Something went wrong",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="container flex flex-col items-center justify-center mx-auto p-6 max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
          <Image
            src={
              session?.user?.imageUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
            }
            alt="Profile"
            width={100}
            height={100}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {session?.user?.name}
          </h1>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>

        {/* Profile Details Section */}
        <Card className="mt-8 bg-white p-4 rounded-lg shadow-sm flex flex-col space-y-2 w-fit items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Change Profile Information
          </h2>
          <div className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 w-[500px]"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
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
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
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
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Action Buttons */}
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition duration-200"
                >
                  Save Changes
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
