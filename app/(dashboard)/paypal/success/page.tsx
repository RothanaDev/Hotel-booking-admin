"use client";

import { useEffect, useState } from "react";
import { capturePaypalOrder } from "@/lib/api";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function PayPalSuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [msg, setMsg] = useState("Processing your payment...");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("token");

    if (!orderId) {
      setMsg("Missing transaction token.");
      setStatus("error");
      return;
    }

    capturePaypalOrder(orderId)
      .then((res) => {
        if (res.status === "COMPLETED") {
          setStatus("success");
          setMsg("Your stay has been confirmed!");
        } else {
          setStatus("error");
          setMsg(`Transaction status: ${res.status}`);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setMsg("We couldn't verify your payment. Please contact support.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">

        <div className="bg-white rounded-3xl border shadow-sm p-8 md:p-12 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin mb-6" />
              <h1 className="text-2xl font-black text-slate-900 mb-2">Finalizing Your Booking</h1>
              <p className="text-slate-500">{msg}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Payment Successful!</h1>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/booking")}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-95 transition-opacity"
                >
                  View My Bookings <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="text-sm font-bold text-slate-500 hover:text-slate-900 px-8 py-4 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100">
                <ShieldCheck size={40} className="rotate-180" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">Verification Failed</h1>
              <p className="text-slate-600 mb-8">{msg}</p>
              <button
                onClick={() => router.push("/booking/create")}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:opacity-95"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
