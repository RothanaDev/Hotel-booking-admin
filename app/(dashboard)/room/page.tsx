
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const staticRooms = [
  { id: 1, number: "101", type: "King Exclusive", price: 150.00, status: "Available", image: "/images/room1.jpg" },
  { id: 2, number: "102", type: "Double Deluxe", price: 120.00, status: "Occupied", image: "/images/room2.jpg" },
  { id: 3, number: "201", type: "Single Standard", price: 85.00, status: "Available", image: "/images/room3.jpg" },
  { id: 4, number: "Suite-A", type: "Penthouse Suite", price: 400.00, status: "Maintenance", image: "/images/room4.jpg" },
];

export default function ListRoomPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Directory</h1>
          <p className="text-gray-500">Overview of all hotel rooms and their current live status.</p>
        </div>
        <Link href="/room/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staticRooms.map((room) => (
          <div key={room.id} className="relative group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100">
            <div className="h-48 w-full bg-indigo-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="flex gap-2 w-full">
                  <Button variant="secondary" size="sm" className="flex-1 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/40">
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="bg-rose-500/80 backdrop-blur-md border-rose-500/30">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-200">
                <BedDouble className="h-16 w-16 opacity-20" />
              </div>
              <Badge className={`absolute top-4 right-4 z-20 ${room.status === "Available" ? "bg-emerald-500" :
                  room.status === "Occupied" ? "bg-amber-500" : "bg-rose-500"
                }`}>
                {room.status}
              </Badge>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Room {room.number}</h3>
                  <p className="text-sm text-gray-400 font-medium">{room.type}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600">${room.price}</span>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Per Night</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}