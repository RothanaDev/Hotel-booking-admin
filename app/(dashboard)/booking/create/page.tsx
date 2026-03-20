"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateBooking, useAllUsers, useAllRooms, useAllServices, usePayCash } from "@/hooks/use-queries";
import { createPaypalOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2, Sparkles, CheckCircle2, CreditCard, Search, User as UserIcon, BedDouble, Check, DollarSign } from "lucide-react";
import Swal from "sweetalert2";
import type { User } from "@/types/user";
import type { Room } from "@/types/room";
import type { Service } from "@/types/service";

interface ServiceQuantityMap {
  [key: number]: number;
}

export default function CreateBookingPage() {
  const router = useRouter();
  const createMutation = useCreateBooking();
  const payCashMutation = usePayCash();

  const { data: users = [] as User[], isLoading: isLoadingUsers } = useAllUsers();
  const { data: rooms = [] as Room[], isLoading: isLoadingRooms } = useAllRooms();
  const { data: services = [] as Service[], isLoading: isLoadingServices } = useAllServices();

  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    roomId: "",
    checkin: "",
    checkout: "",
    numOfAdults: 1,
    numOfChildren: 0
  });

  // Search and selector states
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [roomSearchTerm, setRoomSearchTerm] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const roomDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedServices, setSelectedServices] = useState<ServiceQuantityMap>({}); // serviceId -> quantity

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (roomDropdownRef.current && !roomDropdownRef.current.contains(event.target as Node)) {
        setIsRoomDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered lists
  const filteredUsers = (users as User[]).filter((user: User) =>
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const availableRooms = (rooms as Room[]).filter((room: Room) => {
    const status = room.status?.toUpperCase() || (room.booked ? "BOOKED" : "AVAILABLE");
    return status === "AVAILABLE";
  });

  const filteredRooms = availableRooms.filter((room: Room) => {
    const roomTypeRef = room.roomType;
    const roomTypeName = (typeof roomTypeRef === 'object' ? roomTypeRef?.typeName : roomTypeRef) || "";
    return room.id?.toString().includes(roomSearchTerm) ||
      roomTypeName.toLowerCase().includes(roomSearchTerm.toLowerCase());
  });

  // Selected entities for display
  const selectedUser = (users as User[]).find((u: User) => u.id === parseInt(formData.userId));
  const selectedRoom = (rooms as Room[]).find((r: Room) => r.id === parseInt(formData.roomId));
  const roomPrice = (typeof selectedRoom?.roomType === 'object' ? selectedRoom.roomType?.price : 0) || 0;

  const calculateNights = () => {
    if (!formData.checkin || !formData.checkout) return 0;
    const start = new Date(formData.checkin);
    const end = new Date(formData.checkout);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nightsNum = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nightsNum > 0 ? nightsNum : 0;
  };
  const nights = calculateNights();
  const roomTotal = roomPrice * nights;

  const servicesTotal = Object.entries(selectedServices).reduce((acc, [serviceId, qty]) => {
    const serviceItems = services as Service[];
    const service = serviceItems.find((s: Service) => s.id === parseInt(serviceId));
    return acc + (service?.price || 0) * qty;
  }, 0);

  const totalAmount = roomTotal + servicesTotal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => {
      const next = { ...prev };
      if (next[serviceId]) {
        delete next[serviceId];
      } else {
        next[serviceId] = 1;
      }
      return next;
    });
  };

  const updateServiceQty = (serviceId: number, qty: number) => {
    if (qty < 1) return;
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: qty
    }));
  };

  const handleSubmit = async (method: "PAYPAL" | "CASH" | "PENDING") => {
    if (!formData.userId || !formData.roomId || !formData.checkin || !formData.checkout) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Map selected services
      const bookingServices = Object.entries(selectedServices).map(([serviceId, quantity]) => ({
        serviceId: parseInt(serviceId),
        quantity: quantity
      }));

      // 1. Create Booking
      const result = await createMutation.mutateAsync({
        userId: parseInt(formData.userId),
        roomId: parseInt(formData.roomId),
        checkin: formData.checkin,
        checkout: formData.checkout,
        numOfAdults: Number(formData.numOfAdults),
        numOfChildren: Number(formData.numOfChildren),
        services: bookingServices
      });

      const bookingId = result?.id ?? result?.bookingId ?? (result as { data?: { id?: number } })?.data?.id ?? (result as { booking?: { id?: number } })?.booking?.id;

      if (!bookingId) {
        throw new Error("Booking created but bookingId not found in response.");
      }

      if (method === "PAYPAL") {
        setIsRedirecting(true);
        // 2. Create PayPal Order
        const { approvalUrl } = await createPaypalOrder(bookingId);
        if (!approvalUrl) throw new Error("PayPal approval url not found!");
        // 3. Redirect to PayPal
        window.location.href = approvalUrl;
      } else if (method === "CASH") {
        // 2. Pay with Cash
        await payCashMutation.mutateAsync(bookingId);
        Swal.fire("Success!", "Booking created and marked as paid via cash.", "success");
        router.push("/booking");
      } else {
        // 2. Pay at Hotel (Pending)
        Swal.fire("Success!", "Booking created successfully. Payment will be collected at the hotel.", "success");
        router.push("/booking");
      }
    } catch (error: unknown) {
      console.error("Error processing booking:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (error as { message?: string })?.message || "Failed to process booking";
      Swal.fire("Error", errorMessage, "error");
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoadingUsers || isLoadingRooms || isLoadingServices) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#074868]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/booking">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-slate-200 hover:bg-slate-50 hover:text-[#074868]">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Booking</h1>
          <p className="text-slate-500">Book a room and add services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Form + Services */}
        <div className="lg:col-span-2 space-y-8">

          {/* Booking Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#ffa500] rounded-full"></span>
                Booking Details
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Searchable Guest Selection */}
                <div className="space-y-2 relative" ref={userDropdownRef}>
                  <Label htmlFor="userSearch" className="text-slate-700 font-medium">Select Guest *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="userSearch"
                      placeholder="Search guest name or email..."
                      className="pl-10 h-11 rounded-xl border-slate-200 focus:border-[#ffa500] focus:ring-[#ffa500]"
                      value={isUserDropdownOpen ? userSearchTerm : (selectedUser ? selectedUser.name : "")}
                      onFocus={() => {
                        setIsUserDropdownOpen(true);
                        setUserSearchTerm("");
                      }}
                      onChange={(e) => {
                        setUserSearchTerm(e.target.value);
                        setIsUserDropdownOpen(true);
                      }}
                    />
                  </div>

                  {isUserDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user: User) => (
                          <div
                            key={user.id}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, userId: user.id.toString() }));
                              setUserSearchTerm(user.name);
                              setIsUserDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#074868]">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                                <span className="text-xs text-slate-500">{user.email}</span>
                              </div>
                            </div>
                            {formData.userId === user.id.toString() && <Check className="w-4 h-4 text-[#ffa500]" />}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-slate-500 text-sm italic">
                          No guests found
                        </div>
                      )}
                    </div>
                  )}
                  {/* Hidden input for form submission if needed, but we use formData.userId */}
                </div>

                {/* Searchable Room Selection */}
                <div className="space-y-2 relative" ref={roomDropdownRef}>
                  <Label htmlFor="roomSearch" className="text-slate-700 font-medium">Select Room *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="roomSearch"
                      placeholder="Search room # or type..."
                      className="pl-10 h-11 rounded-xl border-slate-200 focus:border-[#ffa500] focus:ring-[#ffa500]"
                      value={isRoomDropdownOpen ? roomSearchTerm : (selectedRoom ? `Room ${selectedRoom.id} - ${(typeof selectedRoom.roomType === 'object' ? selectedRoom.roomType?.typeName : selectedRoom.roomType)}` : "")}
                      onFocus={() => {
                        setIsRoomDropdownOpen(true);
                        setRoomSearchTerm("");
                      }}
                      onChange={(e) => {
                        setRoomSearchTerm(e.target.value);
                        setIsRoomDropdownOpen(true);
                      }}
                    />
                  </div>

                  {isRoomDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {filteredRooms.length > 0 ? (
                        filteredRooms.map((room: Room) => (
                          <div
                            key={room.id}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, roomId: room.id.toString() }));
                              setRoomSearchTerm(`Room ${room.id}`);
                              setIsRoomDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#ffa500]">
                                <BedDouble className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900">Room {room.id}</span>
                                <span className="text-xs text-slate-500">{(typeof room.roomType === 'object' ? room.roomType?.typeName : room.roomType)} — ${(typeof room.roomType === 'object' ? room.roomType?.price : 0)}/night</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                                Available
                              </span>
                              {formData.roomId === room.id.toString() && <Check className="w-4 h-4 text-[#ffa500]" />}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-slate-500 text-sm italic">
                          No available rooms found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-slate-700">Check-in Date *</Label>
                  <Input id="checkin" name="checkin" type="date" value={formData.checkin} onChange={handleChange} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-slate-700">Check-out Date *</Label>
                  <Input id="checkout" name="checkout" type="date" value={formData.checkout} onChange={handleChange} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="numOfAdults" className="text-slate-700">Number of Adults</Label>
                  <select
                    name="numOfAdults"
                    value={formData.numOfAdults}
                    onChange={handleChange}
                    className="w-full h-11 px-3 rounded-xl border-slate-200 focus:border-[#ffa500] focus:ring-[#ffa500] bg-white border text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} Adults</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numOfChildren" className="text-slate-700">Number of Children</Label>
                  <select
                    name="numOfChildren"
                    value={formData.numOfChildren}
                    onChange={handleChange}
                    className="w-full h-11 px-3 rounded-xl border-slate-200 focus:border-[#ffa500] focus:ring-[#ffa500] bg-white border text-sm"
                  >
                    {[0, 1, 2, 3, 4].map(num => <option key={num} value={num}>{num} Child</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffa500]" />
                Additional Services
              </h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(services as Service[]).map((service: Service) => {
                  const isSelected = !!selectedServices[service.id];
                  return (
                    <div
                      key={service.id}
                      className={`
                                                relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-full bg-white
                                                ${isSelected ? 'border-[#074868] shadow-md ring-1 ring-[#074868]/10' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'}
                                            `}
                      onClick={() => toggleService(service.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`
                                                        w-5 h-5 rounded-full flex items-center justify-center border transition-colors
                                                        ${isSelected ? 'bg-[#074868] border-[#074868]' : 'bg-white border-slate-300'}
                                                    `}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <h3 className="font-semibold text-slate-900">{service.serviceName}</h3>
                        </div>
                        <span className="font-bold text-[#ffa500]">${service.price}</span>
                      </div>

                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{service.description}</p>

                      {isSelected && (
                        <div
                          className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-xs font-medium text-slate-600">Qty:</span>
                          <select
                            className="h-8 px-2 rounded-lg border-slate-200 text-xs bg-slate-50"
                            value={selectedServices[service.id]}
                            onChange={(e) => updateServiceQty(service.id, parseInt(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-6 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-[#074868] text-white">
              <h2 className="font-bold text-lg">Booking Summary</h2>
              <p className="text-blue-100 text-sm opacity-80">Review before confirming</p>
            </div>
            <div className="p-6 space-y-6">

              {/* Room Summary */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Room</span>
                  <span className="font-medium text-slate-900 text-right max-w-[60%] truncate">
                    {selectedRoom ? `Room ${selectedRoom.id} - ${(typeof selectedRoom.roomType === 'object' ? selectedRoom.roomType?.typeName : selectedRoom.roomType)}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-medium text-slate-900">{nights} nights</span>
                </div>
              </div>

              {/* Services Summary */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Services</span>
                {Object.keys(selectedServices).length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No services selected</p>
                ) : (
                  Object.entries(selectedServices).map(([id, qty]) => {
                    const s = (services as Service[]).find((srv: Service) => srv.id === parseInt(id));
                    if (!s) return null;
                    return (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-slate-600">{s.serviceName} <span className="text-slate-400 text-xs">x{qty}</span></span>
                        <span className="font-medium text-slate-900">${s.price * qty}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-[#074868]">${totalAmount}</span>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-[#074868] hover:bg-[#05364d] h-12 text-lg font-semibold shadow-xl shadow-blue-900/10"
                  onClick={() => handleSubmit("PAYPAL")}
                  disabled={isLoading || isRedirecting}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </div>
                  ) : isRedirecting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Redirecting to PayPal...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" /> Pay with PayPal
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 h-12 text-lg font-semibold"
                  onClick={() => handleSubmit("CASH")}
                  disabled={isLoading || isRedirecting}
                >
                  <DollarSign className="mr-2 h-5 w-5" /> Pay with Cash
                </Button>

              </div>

              {isRedirecting && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold text-blue-900">Redirecting to PayPal</p>
                    <p className="text-blue-700">Please do not close this window.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
