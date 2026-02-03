
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Eye, Download } from "lucide-react";

const staticPayments = [
    { id: 1, bookingId: 101, date: "2026-01-20", amount: 450.00, method: "Credit Card", status: "Completed" },
    { id: 2, bookingId: 102, date: "2026-01-22", amount: 200.00, method: "PayPal", status: "Pending" },
    { id: 3, bookingId: 103, date: "2026-01-25", amount: 1250.00, method: "Bank Transfer", status: "Completed" },
    { id: 4, bookingId: 104, date: "2026-01-26", amount: 310.00, method: "Cash", status: "Refunded" },
];

export default function PaymentsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-500">Track and manage all transactions.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Booking ID</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Payment Method</TableHead>
                            <TableHead className="font-semibold text-right">Amount</TableHead>
                            <TableHead className="font-semibold text-center">Status</TableHead>
                            <TableHead className="font-semibold text-right text-gray-400">View</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staticPayments.map((payment) => (
                            <TableRow key={payment.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-gray-500">#{payment.id}</TableCell>
                                <TableCell className="font-medium text-blue-600">BOOK-{payment.bookingId}</TableCell>
                                <TableCell className="text-gray-600">{payment.date}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-700">{payment.method}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-gray-900">${payment.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={
                                            payment.status === "Completed" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                payment.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                                                    "bg-red-100 text-red-700 hover:bg-red-100"
                                        }
                                    >
                                        {payment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-teal-600">
                                        <Download className="h-4 w-4" />
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
