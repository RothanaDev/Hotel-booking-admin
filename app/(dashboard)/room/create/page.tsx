
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Image as ImageIcon, Save, X, DollarSign, Type, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateRoomPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-center md:text-left">Register Room</h1>
        </div>
        <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Card className="border-none shadow-2xl shadow-indigo-100 bg-white">
        <CardHeader className="bg-indigo-600 rounded-t-xl text-white pb-8">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <BedDouble className="h-6 w-6" /> Room Specifications
          </CardTitle>
          <p className="text-indigo-100 text-sm">Fill in the details to list a new room in the directory.</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="roomNumber" className="text-gray-700 font-bold">Room Number</Label>
              <Input id="roomNumber" placeholder="e.g. 101" className="border-gray-200 focus:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomType" className="text-gray-700 font-bold">Room Type</Label>
              <select id="roomType" className="w-full flex h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>King Exclusive</option>
                <option>Double Deluxe</option>
                <option>Suite</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-gray-700 font-bold flex items-center gap-2">
              <DollarSign className="h-3 w-3" /> Price per Night
            </Label>
            <Input id="price" type="number" placeholder="150.00" className="border-gray-200 focus:ring-indigo-500 font-mono text-lg" />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-bold flex items-center gap-2">
              <ImageIcon className="h-3 w-3" /> Room Gallery
            </Label>
            <div className="border-2 border-dashed border-indigo-100 rounded-xl p-10 flex flex-col items-center justify-center bg-indigo-50/30 group hover:border-indigo-400 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md mb-3 text-indigo-500 group-hover:scale-110 transition-transform">
                <PlusCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-indigo-600">Click to upload room photos</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold shadow-lg shadow-indigo-200">
              <Save className="mr-2 h-5 w-5" /> Save Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}