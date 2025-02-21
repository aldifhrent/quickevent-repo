"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { price } from "@/lib/currency";
import { Transactions } from "@/types/types";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import Loading from "@/app/loading";
import EventButton from "./_components/event.button";
import useEmblaCarousel from "embla-carousel-react";
import { Input } from "@/components/ui/input";

interface EventTransaction {
  eventId: string;
  eventTitle: string;
  eventPrice: number;
  eventImage: string;
  transactionCount: number;
  transactions: Transactions[];
  eventStatus: string;
}

export default function TransactionsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [eventTransactions, setEventTransactions] = useState<
    EventTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "ended">("all");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true, // Pastikan loop diaktifkan
    dragFree: true,
    align: "start",
    dragThreshold: 5,
  });
  useEffect(() => {
    if (session?.user) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    try {
      const response = await api(
        `/transactions/org/${params.organizerId}`,
        "GET",
        {},
        session?.user.access_token
      );
      setEventTransactions(response.data);
      if (response.data.length > 0) {
        setActiveEvent(response.data[0].eventId);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "cancel") => {
    try {
      await api(
        `/transactions/${id}`,
        "PATCH",
        { action: action === "approve" ? "DONE" : "CANCEL" } as Record<
          string,
          unknown
        >,
        session?.user.access_token
      );
      await fetchTransactions();
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const filteredEvents = eventTransactions
    .filter((event) =>
      event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((event) => {
      if (filter === "all") return true;
      return filter === event.eventStatus;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING_CONFIRMATION":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DONE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="p-8 max-w-[1400px] ">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500">Manage your event transactions</p>
      </div>
      {/* Event Tabs */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-3">Daftar Event</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pilih event untuk melihat daftar transaksinya
        </p>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Cari event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "active" | "ended")
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">Semua Event</option>
            <option value="active">Event Aktif</option>
            <option value="ended">Event Selesai</option>
          </select>
        </div>

        <div className="overflow-x-hidden" ref={emblaRef}>
          <div className="flex gap-4 [&>*]:shrink-0 [&>*]:basis-[80%] sm:[&>*]:basis-[50%] md:[&>*]:basis-[33.3333%] lg:[&>*]:basis-[25%] xl:[&>*]:basis-[20%]">
            {filteredEvents.length === 0 ? (
              <div className="text-gray-500 py-4 text-nowrap">
                {searchQuery
                  ? "Tidak ada event yang sesuai dengan pencarian"
                  : "Belum ada transaksi event yang tersedia"}
              </div>
            ) : (
              filteredEvents.map((event) => (
                <Button
                  onClick={() => setActiveEvent(event.eventId)}
                  key={event.eventId}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg  ${
                    activeEvent === event.eventId
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="size-2 rounded-full bg-emerald-400 "></div>
                  <span className="font-medium">{event.eventTitle}</span>
                  <span
                    className={`ml-2 text-sm px-2 py-0.5 rounded-full bg-opacity-10 ${
                      activeEvent === event.eventId
                        ? "bg-white text-white"
                        : "bg-gray-900 text-gray-600"
                    }`}
                  >
                    {event.transactionCount} transaksi
                  </span>
                </Button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Active Event Transactions */}
      {activeEvent &&
        eventTransactions.map(
          (event) =>
            event.eventId === activeEvent && (
              <div key={event.eventId} className="bg-white rounded-xl">
                <div className="">
                  <div className="">
                    <table className="w-full border">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 text-sm font-medium text-gray-600">
                            Transaction
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">
                            Customer
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">
                            Quantity
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">
                            Amount
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.transactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b last:border-b-0"
                          >
                            <td className="p-4">
                              <span className="font-mono text-sm text-gray-600">
                                #{transaction.id.slice(-8)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-gray-900">
                                {transaction.user.name}
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {transaction.quantity}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-medium text-gray-900">
                                {transaction.totalAmount === 0
                                  ? "FREE"
                                  : price(transaction.totalAmount)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex px-3 py-1 text-sm border rounded-full ${getStatusColor(transaction.status)}`}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="p-4">
                              {transaction.status ===
                                "WAITING_CONFIRMATION" && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() =>
                                      handleAction(transaction.id, "approve")
                                    }
                                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-3 py-1.5"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleAction(transaction.id, "cancel")
                                    }
                                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-1.5"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
        )}
    </div>
  );
}
