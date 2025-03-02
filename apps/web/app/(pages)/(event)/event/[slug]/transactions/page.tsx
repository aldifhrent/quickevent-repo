"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrganizedProfile from "../../_components/organized";
import RightSideMenu from "../../_components/rightside.menu";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Events } from "@/types/types";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

const transactionSchema = z.object({
  quantity: z.coerce
    .number()
    .min(1, "Quantity must be at least 1")
    .default(1)
    .transform((val) => (isNaN(val) ? 1 : val)),
  totalAmount: z.number().min(0, "Total amount must be 0 or greater"),
  paymentProof: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const Transactions = () => {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [event, setEvent] = useState<Events | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      quantity: 1,
      totalAmount: 0,
    },
  });

  const price = event?.price || 0;
  const quantity = form.watch("quantity") || 0;
  const totalAmount = quantity * price;

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api(`/events/${params.slug}`, "GET", {});
      setEvent(res.data);
    } catch (error) {
      toast.error("Failed to load event. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [params.slug]);

  useEffect(() => {
    form.setValue("totalAmount", totalAmount);
  }, [form, totalAmount]);

  const onSubmit = async (values: TransactionFormData) => {
    try {
      setIsSubmitting(true);

      if (!event?.id || !session.data?.user.access_token) {
        toast.error("Missing required data");
        return;
      }

      const formData = new FormData();
      formData.append("eventId", String(event.id));
      formData.append("quantity", String(values.quantity));
      formData.append("totalAmount", String(totalAmount));
      formData.append(
        "expiresAt",
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      );

      if (event.price > 0 && paymentProof) {
        formData.append("paymentProof", paymentProof);
      }

      const response = await fetch(
        "http://localhost:9000/api/v1/transactions/pay",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.data.user.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Transaction created successfully!");
        router.push(
          `/event/${params.slug}/transactions/${result.data.id}/status`
        );
      } else {
        toast.error(result.message || "Failed to create transaction");
      }
    } catch (error) {
      toast.error("Failed to create transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="container mt-8 p-4 flex flex-col lg:flex-row gap-10 border rounded-lg">
      <div className="w-full lg:w-4/6">
        <Image
          src={
            event.imageUrl ||
            "https://assets.loket.com/neo/production/images/banner/20250106145852_677b8d3c5232e.jpg"
          }
          alt="Event"
          width={1200}
          height={200}
          className="rounded-lg"
        />
        <div className="mt-8 flex justify-between border p-2">
          <OrganizedProfile event={event} />
          <Badge className="flex gap-1">
            <Ticket /> {event.attendedEvent || "0"} / {event.totalTicket} Ticket
          </Badge>
        </div>
      </div>
      <div className="w-full lg:w-2/6 p-6 border rounded-lg bg-white shadow-lg">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value)
                          : 0;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <p className="mt-2">Ticket Price: IDR {price.toLocaleString()}</p>
              <p>Quantity: {form.watch("quantity")}</p>
              <p className="text-lg font-bold">
                Total: IDR {totalAmount.toLocaleString()}
              </p>
            </div>
            {event.price > 0 && (
              <FormItem>
                <FormLabel>Upload Payment Proof</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setPaymentProof(e.target.files?.[0] || null)
                    }
                    required
                  />
                </FormControl>
              </FormItem>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Confirm Transaction
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Transactions;
