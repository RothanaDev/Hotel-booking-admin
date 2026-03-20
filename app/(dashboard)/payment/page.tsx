"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    CheckCircle2,
    Clock,
    Loader2,
    Download,
    XCircle
} from "lucide-react";
import { useAllPayments } from "@/hooks/use-queries";
import { format } from "date-fns";

interface Payment {
    id: number | string;
    status: string;
    provider: string;
    amount: number;
    currency: string;
    user?: {
        name?: string;
        email?: string;
    };
    bookingId?: number | string;
    createdAt: string;
}

const PaymentPage = () => {
    const { data: payments = [] as Payment[], isLoading } = useAllPayments();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("All Methods");
    const [selectedStatus, setSelectedStatus] = useState("All Status");

    // Stats calculation
    const completedPayments = (payments as Payment[]).filter((p: Payment) => p.status === "COMPLETED");
    const totalTransactions = (payments as Payment[]).length;
    const totalPaypal = completedPayments.filter((p: Payment) => p.provider === "PAYPAL").reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);
    const totalCash = completedPayments.filter((p: Payment) => p.provider === "CASH").reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);

    // Filter logic
    const filteredPayments = (payments as Payment[]).filter((payment: Payment) => {
        const guestName = payment.user?.name?.toLowerCase() || "";
        const guestEmail = payment.user?.email?.toLowerCase() || "";
        const paymentId = payment.id?.toString() || "";
        const bookingId = payment.bookingId?.toString() || "";

        const matchesSearch =
            guestName.includes(searchTerm.toLowerCase()) ||
            guestEmail.includes(searchTerm.toLowerCase()) ||
            paymentId.includes(searchTerm) ||
            bookingId.includes(searchTerm);

        const matchesMethod = selectedMethod === "All Methods" || payment.provider === selectedMethod;
        const matchesStatus = selectedStatus === "All Status" || payment.status === selectedStatus;

        return matchesSearch && matchesMethod && matchesStatus;
    });

    const getMethodBadgeStyles = (method: string) => {
        switch (method?.toUpperCase()) {
            case "PAYPAL":
                return "bg-blue-100 text-blue-600 border-blue-200";
            case "CASH":
                return "bg-emerald-100 text-emerald-600 border-emerald-200";
            default:
                return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    const getStatusBadgeStyles = (status: string) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "CREATED":
            case "PENDING":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "FAILED":
                return "bg-rose-100 text-rose-700 border-rose-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return <CheckCircle2 className="w-3 h-3 mr-1" />;
            case "CREATED":
            case "PENDING":
                return <Clock className="w-3 h-3 mr-1" />;
            case "FAILED":
                return <XCircle className="w-3 h-3 mr-1" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return "N/A";
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch {
            return "N/A";
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#074868]" />
            </div>
        );
    }

    return (
        <div className="space-y-4 min-h-screen bg-slate-50/50 p-4">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h1>
                    <p className="text-slate-500 text-sm">Manage and track all transactions</p>
                </div>
                <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm rounded-lg h-8 text-xs">
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Export
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Transactions</p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{totalTransactions}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Paypal</p>
                    <h3 className="text-xl font-black text-emerald-600 mt-1">${totalPaypal.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Cash</p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">${totalCash.toLocaleString()}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full md:max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        placeholder="Search guest or ID..."
                        className="pl-9 h-9 border-slate-200 focus:ring-1 focus:ring-indigo-100 focus:border-indigo-400 rounded-lg bg-white shadow-xs text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-40">
                    <select
                        className="w-full h-9 pl-3 pr-8 appearance-none bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-100 shadow-xs cursor-pointer"
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                    >
                        <option value="All Methods">All Methods</option>
                        <option value="PAYPAL">PayPal</option>
                        <option value="CASH">Cash</option>
                    </select>
                </div>
                <div className="relative w-full md:w-40">
                    <select
                        className="w-full h-9 pl-3 pr-8 appearance-none bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-100 shadow-xs cursor-pointer"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All Status">All Status</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CREATED">Created</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Guest</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Booking</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPayments.map((payment: Payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/40 transition-colors group">
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <span className="font-bold text-slate-500 text-xs">#{payment.id}</span>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-slate-800 text-xs leading-tight">{payment.user?.name || "Guest"}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{payment.user?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <span className="text-slate-500 font-bold bg-slate-50 border border-slate-100 text-[10px] px-2 py-0.5 rounded-md">B-{payment.bookingId}</span>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <span className="text-slate-500 font-medium text-[11px]">{formatDate(payment.createdAt)}</span>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getMethodBadgeStyles(payment.provider)}`}>
                                            {payment.provider}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeStyles(payment.status)}`}>
                                            {getStatusIcon(payment.status)}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                                        <span className={`font-black text-xs ${payment.status === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            ${payment.amount?.toLocaleString()} {payment.currency}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="w-6 h-6 text-slate-300 mb-2" />
                                            <p className="text-sm font-bold text-slate-900">No results found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
