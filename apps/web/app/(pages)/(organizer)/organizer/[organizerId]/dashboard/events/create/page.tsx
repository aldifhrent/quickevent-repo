"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date.picker";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Image from "next/image";
import { province } from "@/const";
import { useParams, useRouter } from "next/navigation";

const eventSchema = z
  .object({
    category: z.string().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    location: z.string(),
    description: z.string().min(1, "Description is required"),
    registrationStartDate: z.date({
      required_error: "Registration start date is required",
    }),
    registrationEndDate: z.date({
      required_error: "Registration end date is required",
    }),
    eventStartDate: z.date({
      required_error: "Event start date is required",
    }),
    eventEndDate: z.date({
      required_error: "Event end date is required",
    }),
    imageUrl: z.instanceof(File).optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    ticketType: z.string().min(1, "Ticket type is required"),
    totalTicket: z.coerce
      .number()
      .min(1, "Total tickets must be at least 1")
      .max(1000000, "Total tickets cannot exceed 1,000,000"),
  })
  .refine(
    (data) => {
      return data.eventEndDate >= data.eventStartDate;
    },
    {
      message: "Event end date must be after start date",
      path: ["eventEndDate"],
    }
  )
  .refine(
    (data) => {
      return data.registrationEndDate >= data.registrationStartDate;
    },
    {
      message: "Registration end date must be after start date",
      path: ["registrationEndDate"],
    }
  )
  .refine(
    (data) => {
      return data.registrationStartDate < data.eventStartDate;
    },
    {
      message: "Registration start date must be before event start date",
      path: ["registrationStartDate"],
    }
  );

const DashboardCreateEvent = () => {
  const params = useParams();
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: undefined,
      registrationStartDate: new Date(),
      registrationEndDate: new Date(),
      eventStartDate: new Date(),
      eventEndDate: new Date(),
      price: 0,
      location: "",
      ticketType: "",
      totalTicket: 0,
      category: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append(
      "registrationStartDate",
      values.registrationStartDate.toISOString()
    );
    formData.append(
      "registrationEndDate",
      values.registrationEndDate.toISOString()
    );
    formData.append("eventStartDate", values.eventStartDate.toISOString());
    formData.append("eventEndDate", values.eventEndDate.toISOString());
    formData.append("price", values.price.toString());
    formData.append("ticketType", values.ticketType);
    formData.append("totalTicket", values.totalTicket.toString());
    formData.append("category", JSON.stringify(values.category));
    formData.append("location", values.location);

    if (values.imageUrl) {
      formData.append("imageUrl", values.imageUrl);
    }
    formData.append("attendedEvent", "0");

    setLoading(true); // Set loading state to true

    try {
      await api(
        "/events",
        "POST",
        {
          body: formData,
        },
        session.data?.user.access_token
      );

      toast.success("Event created successfully!");
      router.push(`/organizer/${params.organizerId}/dashboard/events`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error submitting form:", error);
        toast.error(error.message || "Error creating event"); // Tamp
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Event description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Start Date *</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event End Date *</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Start Date *</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration End Date *</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    disabled={form.watch("ticketType") === "FREE"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticketType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Type *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "FREE") {
                        form.setValue("price", 0);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="FREE">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalTicket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Tickets *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter total number of tickets"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MUSIC">MUSIC</SelectItem>
                      <SelectItem value="TECH">TECH</SelectItem>
                      <SelectItem value="ART">ART</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {province.map((prov, index) => (
                        <SelectItem key={index} value={prov}>
                          {prov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Image *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        field.onChange(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        if (file) {
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    width={100}
                    height={100}
                    alt="Image Preview"
                    className="mt-2 w-32 h-32 object-cover"
                  />
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DashboardCreateEvent;
