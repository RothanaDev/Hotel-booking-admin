"use client";

import { use } from "react";
import { useBooking } from "@/hooks/use-queries";
import { Loader2, ArrowLeft, Calendar, User, CreditCard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: booking, isLoading } = useBooking(id);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#074868]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Booking not found</h2>
        <p className="text-slate-500 mt-2">The booking with ID #{id} could not be found.</p>
        <Link href="/booking">
          <Button className="mt-6 bg-[#074868]">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/booking">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Booking Details</h1>
          <p className="text-slate-500">Managing reservation #{String(booking.id).padStart(4, '0')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-[#074868]" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Name</label>
                <p className="font-semibold">{booking.userResponse?.name}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Email</label>
                <p className="font-semibold">{booking.userResponse?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#074868]" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
              booking.status?.toLowerCase() === 'paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
              booking.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {booking.status}
            </div>
            <div className="mt-4">
              <label className="text-sm text-slate-500">Total Amount</label>
              <p className="text-2xl font-bold">${booking.amount?.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#074868]" />
              Stay Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <label className="text-sm text-slate-500">Room</label>
                  <p className="font-semibold">Room {booking.roomResponse?.id}</p>
                  <p className="text-sm text-slate-500">{(typeof booking.roomResponse?.roomType === 'object' ? booking.roomResponse?.roomType?.typeName : booking.roomResponse?.roomType)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-500">Check-in</label>
                <p className="font-semibold">{booking.checkin}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Check-out</label>
                <p className="font-semibold">{booking.checkout}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Occupancy</label>
                <p className="font-semibold">{booking.numOfAdults} Adults, {booking.numOfChildren} Children</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
