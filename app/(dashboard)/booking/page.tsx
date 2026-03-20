"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  MoreVertical,
  Calendar,
  Users,
  Trash2,
  CreditCard,
  List,
  Loader2,
  DollarSign
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllBookings, useDeleteBooking, useCreatePaypalOrder, usePayCash } from "@/hooks/use-queries";
import Swal from "sweetalert2";

export default function BookingsPage() {
  const { data: bookings = [], isLoading } = useAllBookings();
  const deleteMutation = useDeleteBooking();
  const paypalMutation = useCreatePaypalOrder();
  const cashMutation = usePayCash();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const handleDelete = async (id: string | number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#074868",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(id);
        Swal.fire("Deleted!", "Booking has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete booking.", "error");
      }
    }
  };

  const handlePay = async (id: string | number) => {
    const result = await Swal.fire({
      title: "Proceed to Payment",
      text: "You will be redirected to PayPal to complete the transaction.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#074868",
      cancelButtonText: "Cancel",
      confirmButtonText: "Pay with PayPal"
    });

    if (result.isConfirmed) {
      try {
        const orderResponse = await paypalMutation.mutateAsync(id);
        if (orderResponse?.approvalUrl) {
          window.location.href = orderResponse.approvalUrl;
        } else {
          throw new Error("No approval URL received");
        }
      } catch (error) {
        console.error("PayPal Error:", error);
        Swal.fire("Error!", "Failed to initialize PayPal payment.", "error");
      }
    }
  };

  const handlePayCash = async (id: string | number) => {
    const result = await Swal.fire({
      title: "Confirm Cash Payment",
      text: "Mark this booking as paid via cash?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonText: "Cancel",
      confirmButtonText: "Confirm Cash Payment"
    });

    if (result.isConfirmed) {
      try {
        await cashMutation.mutateAsync(id);
        Swal.fire("Success!", "Booking marked as paid via cash.", "success");
      } catch (error) {
        console.error("Cash Payment Error:", error);
        Swal.fire("Error!", "Failed to process cash payment.", "error");
      }
    }
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter bookings
  const filteredBookings = bookings.filter((booking: any) => {
    const guestName = booking.userResponse?.name?.toLowerCase() || "";
    const roomName = booking.roomResponse?.roomType?.typeName?.toLowerCase() || "";
    const matchesSearch =
      guestName.includes(searchTerm.toLowerCase()) ||
      roomName.includes(searchTerm.toLowerCase()) ||
      booking.id?.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "All Status" ||
      booking.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate Paginated Data
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'checked out': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
    <div className="space-y-8 min-h-screen bg-slate-50/50 ">

      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bookings</h1>
          <p className="text-slate-500 mt-1">Manage all reservations and bookings</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <Button variant="secondary" className="bg-white text-slate-900 shadow-sm h-9 rounded-lg px-4 font-medium">
            <List className="mr-2 h-4 w-4" /> List Bookings
          </Button>
          <Link href="/booking/create">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 h-9 rounded-lg px-4 font-medium">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by guest or room..."
            className="pl-10 h-11 border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl bg-white shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="relative w-full md:w-48">
          <select
            className="w-full h-11 pl-4 pr-10 appearance-none bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="All Status">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Check-out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-slate-600">#{String(booking.id).padStart(4, '0')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.userResponse?.name || "Unknown Guest"}</p>
                      <p className="text-xs text-slate-500">{booking.userResponse?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-slate-900">Room {booking.roomResponse?.id}</p>
                      <p className="text-xs text-slate-500">{booking.roomResponse?.roomType?.typeName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-600 font-medium">{booking.checkin}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-600 font-medium">{booking.checkout}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-slate-600">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span className="text-sm font-medium">
                        {booking.numOfAdults}A
                        {booking.numOfChildren > 0 && ` + ${booking.numOfChildren}C`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900">${booking.amount?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        {booking.status?.toLowerCase() === 'pending' && (
                          <>
                            <DropdownMenuItem
                              className="cursor-pointer font-medium p-2.5 text-emerald-600 focus:text-emerald-600"
                              onClick={() => handlePay(booking.id)}
                            >
                              <CreditCard className="mr-2 h-4 w-4" /> Pay with PayPal
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer font-medium p-2.5 text-emerald-600 focus:text-emerald-600"
                              onClick={() => handlePayCash(booking.id)}
                            >
                              <DollarSign className="mr-2 h-4 w-4" /> Pay with Cash
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          className="cursor-pointer font-medium p-2.5 text-rose-600 focus:text-rose-600"
                          onClick={() => handleDelete(booking.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              {paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-900">No bookings found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-900">{startIndex + 1}</span> to <span className="text-slate-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-slate-900">{totalItems}</span> bookings
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "secondary" : "ghost"}
                    size="sm"
                    className={`h-9 w-9 rounded-lg p-0 font-medium ${currentPage === page ? 'bg-[#074868] text-white hover:bg-[#074868]/90' : 'text-slate-600 hover:bg-slate-200'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
