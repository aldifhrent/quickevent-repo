"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { organizerSchema, organizerValues } from "@/schema/organizer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function CreateOrganizer() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<organizerValues>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      organizerName: "",
      aboutOrganizer: "",
      website: "",
      logoUrl: "",
    },
  });
  const onSubmit = async (values: organizerValues) => {
    try {
      setIsLoading(true);

      const res = await api(
        "/organizer",
        "POST",
        {
          body: values,
          contentType: "application/json",
        },
        session.data?.user.access_token
      );
      if (res.data) {
        toast.success("Organizer created successfully");
        form.reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data.message || "Something went wrong";

        // Jangan tampilkan toast jika organizer tidak ditemukan
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-fit p-8 max-h-[700px] mt-4 shadow-4xl">
        <h1 className="font-bold mb-2 text-xl">Create Organizer</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-[400px] mt-8"
          >
            <FormField
              control={form.control}
              name="organizerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutOrganizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="About"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="website"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Logo</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
