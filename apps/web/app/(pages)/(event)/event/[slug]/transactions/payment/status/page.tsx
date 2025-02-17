import { Card } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, Clock, XCircle } from "lucide-react";
import Link from "next/link";

type StatusType = "completed" | "pending" | "error";

interface StatusProps {
  label: string;
  icon: React.ReactElement;
  details: string;
}

const statuses: Record<StatusType, StatusProps> = {
  completed: {
    label: "Completed",
    icon: <CheckCircle className="text-green-500" />,
    details:
      "The transaction has been successfully completed. Your payment has been processed, and the order is now confirmed. You will receive a confirmation email shortly with the transaction details. If you have any further questions, feel free to contact our support team.",
  },
  pending: {
    label: "Pending",
    icon: <Clock className="text-yellow-500" />,
    details:
      "The transaction is currently being processed. This usually takes a few minutes, but in some cases, it may take up to 24 hours. Please check your email for updates, and ensure that your payment method has sufficient funds. If you experience any delays, kindly reach out to our support team.",
  },
  error: {
    label: "Error",
    icon: <XCircle className="text-red-500" />,
    details:
      "There was an issue with the transaction. Possible reasons include insufficient funds, incorrect payment details, or a temporary issue with the payment gateway. Please verify your payment information and try again. If the issue persists, contact your bank or our support team for further assistance.",
  },
};

interface StatusTransactionProps {
  status?: StatusType;
}

export default function StatusTransaction({
  status = "pending",
}: StatusTransactionProps) {
  const { label, icon, details } = statuses[status];

  return (
    <main className="container">
      <div className="flex items-center justify-center min-h-screen ">
        <Card className="w-full max-w-2xl p-4 shadow-2xl sm:p-10 sm:rounded-3xl">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full dark:bg-green-700">
              {icon}
            </div>
            <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400">
              {label}
            </h1>
            <p className="mt-4 text-lg text-gray-800 dark:text-gray-300">
              {details}
            </p>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-2 text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-600 dark:hover:to-blue-600"
            >
              <ChevronLeft />
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
