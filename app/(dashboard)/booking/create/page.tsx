
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, User, Phone, Mail, BedDouble, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateBookingPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">New Booking</h1>
          <p className="text-gray-500">Add a new guest reservation to the system.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="text-gray-500">
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-md">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <User className="h-4 w-4" /> Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="e.g. Sokha" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="e.g. Rothana" className="bg-white/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Address
                  </Label>
                  <Input id="email" type="email" placeholder="guest@example.com" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Phone Number
                  </Label>
                  <Input id="phone" placeholder="012 345 678" className="bg-white/50" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/50 bg-white/80 backdrop-blur-md">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Stay Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Input id="checkIn" type="date" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Input id="checkOut" type="date" className="bg-white/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room" className="flex items-center gap-2">
                  <BedDouble className="h-3 w-3" /> Select Room
                </Label>
                <select id="room" className="w-full flex h-10 rounded-md border border-input bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>101 - King Exclusive</option>
                  <option>102 - Double Deluxe</option>
                  <option>Suite - Ocean View</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-gray-200/50 bg-teal-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Summary</CardTitle>
              <CardDescription className="text-teal-100">Total estimation for this stay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b border-teal-500/50 pb-2">
                <span>Room Rate</span>
                <span className="font-bold">$150.00 / night</span>
              </div>
              <div className="flex justify-between border-b border-teal-500/50 pb-2">
                <span>Nights</span>
                <span className="font-bold">0</span>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-teal-100 italic">Grand Total</span>
                <span className="text-4xl font-black">$0.00</span>
              </div>
              <Button className="w-full bg-white text-teal-700 hover:bg-white/90 font-bold mt-4 h-12 shadow-lg">
                <Save className="mr-2 h-4 w-4" /> Save Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
