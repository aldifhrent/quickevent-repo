"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeProfileSchema, changeProfileValues } from "@/schema/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { uploadAvatar } from "@/app/actions/upload";

const ProfilePage = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(changeProfileSchema),
    defaultValues: {
      imageUrl: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Set initial values for form when session is available
  useEffect(() => {
    if (session?.user) {
      form.reset({
        imageUrl: session.user.imageUrl || "",
        name: session.user.name || "",
        password: "",
        confirmPassword: "",
      });
      // Set initial image from session (if any)
      setImagePreview(session?.user?.imageUrl || null);
    }
  }, [form.reset, session?.user]);

  // Handle image upload and preview
  const handleImageClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string); // Set the image preview
        };
        reader.readAsDataURL(file); // Read the file as a data URL
      }
    };
  };

  const handleSubmit = async (values: changeProfileValues) => {
    try {
      setLoading(true);
      if (!session?.user?.access_token) {
        toast.error("Session expired. Please log in again.");
        router.push("/sign-in");
        return;
      }

      // Buat objek data untuk update profil
      const updateProfileData = { ...values };

      // Hanya upload gambar jika ada file yang dipilih
      if (selectedFile) {
        const toastId = toast.loading("Uploading image...");

        // Jika ada file yang dipilih, upload gambar
        const formData = new FormData();
        formData.append("image", selectedFile);
        await uploadAvatar(formData, session?.user.access_token);

        toast.success("Image uploaded successfully!", { id: toastId });

        // Perbarui imageUrl setelah upload berhasil
        updateProfileData.imageUrl = imagePreview || "";
      }

      // Kirim update profil (termasuk nama, password)
      await api(
        "/auth/profile",
        "PATCH",
        { body: updateProfileData, contentType: "application/json" },
        session?.user.access_token
      );

      // Perbarui session untuk mencerminkan perubahan
      await update();
      window.location.reload();
      toast.success("Profile updated successfully!");
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   description: "Something went wrong",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="container flex flex-col items-center justify-center mx-auto p-6 max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
          {/* Display the preview image or session image */}
          <div
            onClick={handleImageClick}
            className="cursor-pointer w-[100px] h-[100px] rounded-full border-2 border-[#E5E7EB] overflow-hidden"
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile"
                width={100}
                height={100}
                className="object-cover w-full h-full" // Memastikan gambar memenuhi kontainer bundar
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div> // Tampilan default jika gambar belum ada
            )}
          </div>

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
