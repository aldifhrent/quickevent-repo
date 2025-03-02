"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useParams, useSearchParams } from "next/navigation";

type StatusType = "WAITING_CONFIRMATION" | "CONFIRMED" | "EXPIRED" | "CANCELLED";

interface Transaction {
  id: string;
  eventId: number;
  status: StatusType;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  expiresAt: string;
  event: {
    title: string;
    price: number;
  };
}

interface StatusProps {
  label: string;
  icon: React.ReactElement;
  details: string;
}

const statuses: Record<StatusType, StatusProps> = {
  WAITING_CONFIRMATION: {
    label: "Menunggu Konfirmasi",
    icon: <Clock className="w-10 h-10 text-yellow-500" />,
    details:
      "Transaksi Anda sedang menunggu konfirmasi. Mohon tunggu beberapa saat, kami akan memproses pembayaran Anda.",
  },
  CONFIRMED: {
    label: "Pembayaran Berhasil",
    icon: <CheckCircle className="w-10 h-10 text-green-500" />,
    details:
      "Transaksi telah berhasil dikonfirmasi. Tiket Anda telah dikirim ke email. Terima kasih telah melakukan pembelian!",
  },
  EXPIRED: {
    label: "Transaksi Kedaluwarsa",
    icon: <XCircle className="w-10 h-10 text-red-500" />,
    details:
      "Maaf, transaksi Anda telah kedaluwarsa. Silakan lakukan pembelian ulang.",
  },
  CANCELLED: {
    label: "Transaksi Dibatalkan",
    icon: <XCircle className="w-10 h-10 text-red-500" />,
    details:
      "Transaksi telah dibatalkan. Silakan hubungi customer service kami jika ada pertanyaan.",
  },
};

export default function StatusTransaction() {
  const {data: session} = useSession();
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!session?.user.access_token) {
        return; // Tunggu hingga token tersedia
      }

      try {
        const token = session.user.access_token;
        const response = await fetch(`http://localhost:9000/api/v1/transactions/${params.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success) {
          setTransaction(data.data);
        } else {
          console.error(data.message);
          toast.error("Gagal mengambil data transaksi");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast.error("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [session?.user.access_token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Transaksi tidak ditemukan</p>
      </div>
    );
  }

  const status = statuses[transaction.status];

  return (
    <main className="container">
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl p-4 shadow-2xl sm:p-10 sm:rounded-3xl">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full">
              {status.icon}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {status.label}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{status.details}</p>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Detail Transaksi</h2>
              <div className="space-y-2 text-left">
                <p>Event: {transaction.event.title}</p>
                <p>Jumlah Tiket: {transaction.quantity}</p>
                <p>Total: Rp {transaction.totalAmount.toLocaleString()}</p>
                <p>
                  Waktu Transaksi:{" "}
                  {new Date(transaction.createdAt).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-x-4">
            <Link
              href="/dashboard/transactions"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Lihat Semua Transaksi
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
