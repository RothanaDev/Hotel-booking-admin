
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConciergeBell, PlusCircle, Edit, Trash2 } from "lucide-react";

const staticBookedServices = [
    { id: 1, bookingId: 101, serviceName: "Spa & Wellness", quantity: 1, totalAmount: 50.00, date: "2026-01-26" },
    { id: 2, bookingId: 101, serviceName: "Room Service", quantity: 2, totalAmount: 20.00, date: "2026-01-26" },
    { id: 3, bookingId: 102, serviceName: "Airport Shuttle", quantity: 1, totalAmount: 25.00, date: "2026-01-28" },
    { id: 4, bookingId: 103, serviceName: "Laundry Service", quantity: 3, totalAmount: 45.00, date: "2026-01-27" },
];

export default function BookedServicesPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Service Bookings</h1>
                    <p className="text-gray-500">Track services added to specific guest bookings.</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Service to Booking
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Booking ID</TableHead>
                            <TableHead className="font-semibold">Service Name</TableHead>
                            <TableHead className="font-semibold text-center">Quantity</TableHead>
                            <TableHead className="font-semibold text-right">Total Amount</TableHead>
                            <TableHead className="font-semibold text-center">Date</TableHead>
                            <TableHead className="font-semibold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staticBookedServices.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-gray-500">#SB-{item.id.toString().padStart(3, '0')}</TableCell>
                                <TableCell className="font-bold text-blue-600">BOOK-{item.bookingId}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <ConciergeBell className="h-4 w-4 text-teal-500" />
                                        {item.serviceName}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium text-gray-700">{item.quantity}</TableCell>
                                <TableCell className="text-right font-black text-gray-900">${item.totalAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-center text-gray-500">{item.date}</TableCell>
                                <TableCell className="flex justify-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
