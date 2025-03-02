"use client";

import React, { useState, useEffect } from "react";
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
import { eventSchema } from "@/schema/event";
import { useParams, useRouter } from "next/navigation";

const DashboardEditEvent = () => {
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

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api(
          `/events/${params.id}`,
          "GET",
          {},
          session.data?.user.access_token
        );

        const eventData = response.data;
        let category;
        try {
          category = JSON.parse(eventData.category);
          if (typeof category !== "string") {
            category = eventData.category;
          }
        } catch {
          category = eventData.category;
        }

        form.setValue("title", eventData.title);
        form.setValue("description", eventData.description);
        form.setValue("price", eventData.price);
        form.setValue("ticketType", eventData.ticketType);
        form.setValue("totalTicket", eventData.totalTicket);
        form.setValue("category", category);
        form.setValue("location", eventData.location);
        form.setValue("eventStartDate", new Date(eventData.eventStartDate));
        form.setValue("eventEndDate", new Date(eventData.eventEndDate));
        form.setValue(
          "registrationStartDate",
          new Date(eventData.registrationStartDate)
        );
        form.setValue(
          "registrationEndDate",
          new Date(eventData.registrationEndDate)
        );

        if (eventData.imageUrl) {
          setImagePreview(eventData.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event data");
      }
    };

    if (session.data?.user.access_token) {
      fetchEventData();
    }
  }, [params.id, session.data?.user.access_token]);

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (values.title) {
        formData.append("title", values.title);
      }

      formData.append("description", values.description || "");
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
      formData.append(
        "price",
        values.ticketType === "FREE" ? "0" : values.price.toString()
      );
      formData.append("ticketType", values.ticketType);
      formData.append("totalTicket", values.totalTicket.toString());
      formData.append("category", values.category);
      formData.append("location", values.location);

      if (values.imageUrl instanceof File) {
        formData.append("imageUrl", values.imageUrl);
      }

      const response = await api(
        `/events/${params.id}`,
        "PATCH",
        {
          body: formData,
        },
        session.data?.user.access_token
      );

      toast.success("Event updated successfully!");
      router.push(`/organizer/${params.organizerId}/dashboard/events`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Error updating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-4">Edit Event {params.id}</h1>
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                      {province.map((prov) => (
                        <SelectItem key={prov} value={prov}>
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
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DashboardEditEvent;
