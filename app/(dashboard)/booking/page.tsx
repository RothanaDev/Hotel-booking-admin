
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";

const staticBookings = [
  { id: 1, guest: "Rothana", room: "101 (King)", checkIn: "2026-01-26", checkOut: "2026-01-29", total: 450.00, status: "Confirmed" },
  { id: 2, guest: "Bunath", room: "205 (Double)", checkIn: "2026-01-28", checkOut: "2026-01-30", total: 240.00, status: "Pending" },
  { id: 3, guest: "Vireak", room: "302 (Suite)", checkIn: "2026-01-25", checkOut: "2026-01-27", total: 800.00, status: "Checked Out" },
  { id: 4, guest: "Sokha", room: "108 (Single)", checkIn: "2026-01-27", checkOut: "2026-01-28", total: 85.00, status: "Cancelled" },
];

export default function ListBookingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Booking List</h1>
          <p className="text-gray-500">Manage your hotel reservations and check-in status.</p>
        </div>
        <Link href="/booking/create">
          <Button className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/20 px-6">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Booking
          </Button>
        </Link>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[100px] font-bold">Ref</TableHead>
              <TableHead className="font-bold">Guest Name</TableHead>
              <TableHead className="font-bold">Room</TableHead>
              <TableHead className="font-bold">Stay Period</TableHead>
              <TableHead className="font-bold text-right">Total Amount</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staticBookings.map((booking) => (
              <TableRow key={booking.id} className="group hover:bg-white/50 transition-all">
                <TableCell className="font-mono text-xs text-gray-400">#BK-{booking.id.toString().padStart(4, '0')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white text-xs font-black shadow-inner">
                      {booking.guest.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900">{booking.guest}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 font-medium">{booking.room}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">From {booking.checkIn}</span>
                    <span className="text-sm font-medium text-gray-700">to {booking.checkOut}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-black text-gray-900">${booking.total.toFixed(2)}</span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={
                    booking.status === "Confirmed" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                      booking.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        booking.status === "Checked Out" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                          "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-teal-50 hover:text-teal-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}