"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PayPalCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl border shadow-sm p-8 md:p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Payment Cancelled</h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Your payment process was cancelled. No charges were made. You can return to booking to try again or modify your reservation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/booking/create")}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-95 transition-opacity"
              >
                <ArrowLeft size={18} /> Back to Booking
              </button>
              <button
                onClick={() => router.push("/booking")}
                className="text-sm font-bold text-slate-500 hover:text-slate-900 px-8 py-4 transition-colors"
              >
                Cancel and return to list
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
