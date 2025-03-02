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
import { createOrganizer } from "@/app/actions/organizer";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateOrganizer() {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  const form = useForm<organizerValues>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      organizerName: "",
      aboutOrganizer: "",
      website: "",
      logoUrl: "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Mengunggah gambar ke server dan mendapatkan URL
      const imageFormData = new FormData();
      imageFormData.append("image", file);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value, 10)
    );
    setCategoryIds(selectedOptions);
  };

  const onSubmit = async (values: organizerValues) => {
    try {
      setIsLoading(true);
      const { organizerName, aboutOrganizer, website } = values;

      if (!selectedFile) {
        toast.error("Mohon upload logo organizer");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("organizerName", organizerName);
      formData.append("aboutOrganizer", aboutOrganizer || "");
      formData.append("website", website || "");
      formData.append("logoUrl", selectedFile);
      formData.append("categoryIds", JSON.stringify(categoryIds));

      // Mengunggah formData ke server
      const res = await axios.post(
        "http://localhost:9000/api/v1/organizer/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.data?.user.access_token!}`,
          },
        }
      );

      if (res.data) {
        toast.success("Organizer berhasil dibuat");
        router.refresh();
        form.reset();
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data.message || "Terjadi kesalahan";
        toast.error(message);
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
        }
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
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileChange(e);
                        field.onChange(e);
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  {previewUrl && (
                    <div className="mt-2">
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  )}
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
