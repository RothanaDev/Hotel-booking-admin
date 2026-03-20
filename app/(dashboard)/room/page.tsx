"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BedDouble, PlusCircle, Edit, Trash2, Search, Loader2, MoreVertical, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAllRooms, useDeleteRoom, useAllRoomTypes } from "@/hooks/use-queries";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";

export default function ListRoomPage() {
  const { data: rooms = [], isLoading: isLoadingRooms } = useAllRooms();
  const { data: roomTypes = [] } = useAllRoomTypes();
  const deleteMutation = useDeleteRoom();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRoomType, setSelectedRoomType] = useState("All");

  // Filtering Logic
  const filteredRooms = rooms.filter((room: any) => {
    // 1. Search Filter
    const roomTypeName = typeof room.roomType === 'object' ? room.roomType?.typeName : room.roomType;
    const matchesSearch = (String(roomTypeName || "").toLowerCase().includes(searchTerm.toLowerCase())) ||
      String(room.id || "").toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status Filter
    const status = room.status?.toUpperCase() || (room.booked ? "BOOKED" : "AVAILABLE");
    const matchesStatus = selectedStatus === "All" ||
      (selectedStatus === "Booked" && (status === "BOOKED" || status === "OCCUPIED")) ||
      (status === selectedStatus.toUpperCase());

    // 3. Room Type Filter
    const matchesType = selectedRoomType === "All" || (roomTypeName && roomTypeName === selectedRoomType);

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = async (roomId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This room will be permanently deleted!",
      icon: "warning",
      width: '400px',
      showCancelButton: true,
      confirmButtonColor: "#ffa500",
      cancelButtonColor: "#074868",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: 'rounded-xl border-none shadow-2xl',
        title: 'text-xl font-bold pt-4',
        htmlContainer: 'text-sm text-slate-600 pb-2',
        confirmButton: 'rounded-xl px-5 py-2 text-sm font-bold',
        cancelButton: 'rounded-xl px-5 py-2 text-sm font-bold'
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(roomId);
        Swal.fire({
          title: "Deleted!",
          text: "Room has been removed.",
          icon: "success",
          width: '350px',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl shadow-xl border-none py-6',
            title: 'text-xl font-bold',
            htmlContainer: 'text-sm text-slate-600'
          }
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete room.",
          icon: "error",
          width: '350px',
          customClass: {
            popup: 'rounded-xl shadow-xl border-none py-6',
            title: 'text-xl font-bold',
            htmlContainer: 'text-sm text-slate-600'
          }
        });
      }
    }
  };

  if (isLoadingRooms) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className=" space-y-8 min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Room Management</h1>
          <p className="text-slate-500 mt-1">Manage room inventory and status</p>
        </div>
        <Link href="/room/create">
          <Button className="bg-[#074868] hover:bg-[#074868] text-white shadow-lg shadow-orange-500/20 px-6 h-11 rounded-xl transition-all duration-300 font-semibold">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Room
          </Button>
        </Link>
      </div>

      {/* Filters & Search - Matching Design */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by room number..."
            className="pl-10 h-11 border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full md:w-48">
          <select
            className="w-full h-11 pl-4 pr-10 appearance-none bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Room Type Dropdown */}
        <div className="relative w-full md:w-48">
          <select
            className="w-full h-11 pl-4 pr-10 appearance-none bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm cursor-pointer"
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
          >
            <option value="All">All Types</option>
            {roomTypes.map((type: any) => (
              <option key={type.id} value={type.typeName}>{type.typeName}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room: any) => {
          const status = room.status?.toUpperCase() || (room.booked ? "BOOKED" : "AVAILABLE");

          let statusColor = "bg-emerald-400";
          let statusTextColor = "text-emerald-600";
          let statusText = "Available";

          if (status === "BOOKED" || status === "OCCUPIED") {
            statusColor = "bg-amber-400";
            statusTextColor = "text-amber-600";
            statusText = "Booked";
          } else if (status === "MAINTENANCE") {
            statusColor = "bg-rose-500";
            statusTextColor = "text-rose-600";
            statusText = "Maintenance";
          }

          const roomTypeStr = typeof room.roomType === 'object' ? room.roomType?.typeName : room.roomType;
          const roomDescription = typeof room.roomType === 'object' ? room.roomType?.description : "Comfortable room with essential amenities";
          const price = room.roomPrice || (typeof room.roomType === 'object' ? room.roomType?.price : 0);

          return (
            <div key={room.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
              {/* Image Section */}
              <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                {room.image || room.photo ? (
                  <img
                    src={room.image || `data:image/jpeg;base64,${room.photo}`}
                    alt={roomTypeStr}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                    <BedDouble className="w-16 h-16" />
                  </div>
                )}
                {/* Custom Glass Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center gap-2 z-10">
                  <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
                  <span className={`text-xs font-bold ${statusTextColor}`}>
                    {statusText}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex-1 flex flex-col space-y-3">

                {/* Header: Icon + Title + Menu */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">Room {room.id}</h3>
                      <p className="text-xs text-slate-500 font-medium">{roomTypeStr || "Unknown Type"}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                      <DropdownMenuItem className="cursor-pointer font-medium p-2.5" asChild>
                        <Link href={`/room/${room.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4 text-indigo-500" /> Edit Room
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer font-medium text-rose-600 focus:text-rose-600 p-2.5"
                        onClick={() => handleDelete(room.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {roomDescription}
                </p>

                {/* Price */}
                <div className="mt-auto pt-2 flex items-baseline gap-1">
                  <span className="text-slate-500 font-bold">$</span>
                  <span className="text-xl font-bold text-slate-900">{price}</span>
                  <span className="text-xs text-slate-400 font-medium">/night</span>
                </div>

              </div>
            </div>
          );
        })}
        {filteredRooms.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BedDouble className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No rooms found</h3>
            <p className="text-slate-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}