"use client";

import { StatCard } from "@/components/ui/StatCard"
import { BedDouble, CalendarCheck, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useAllRooms, useAllBookings } from "@/hooks/use-queries";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DashboardContent = () => {

  const { data: rooms = [], isLoading: roomsLoading } = useAllRooms();
  const { data: bookings = [], isLoading: bookingsLoading } = useAllBookings();

  const isLoading = bookingsLoading || roomsLoading;
  const availableRooms = rooms.filter((room: any) => room.status?.toLowerCase() === "available").length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((acc: number, booking: any) => {
    return acc + (booking.amount || 0);
  }, 0);

  const totalGuests = bookings.reduce((sum: number, booking: any) => sum + (booking.totalNumOfGuest || 0), 0);
  const pendingBookings = bookings.filter((booking: any) => booking.status === "pending").length;

  const generateMonthlyStats = () => {
    const stats = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    for (let i = 0; i < 12; i++) {
      const d = new Date(currentYear, i, 1);
      const monthLabel = format(d, 'MMM');

      const monthBookings = bookings.filter((b: any) => {
        const bDate = new Date(b.checkin);
        return bDate.getMonth() === i && bDate.getFullYear() === currentYear;
      });

      stats.push({
        month: monthLabel,
        revenue: monthBookings.reduce((acc: number, b: any) => acc + (b.amount || 0), 0),
        bookings: monthBookings.length,
      });
    }
    return stats;
  };

  const monthlyStats = generateMonthlyStats();
  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusColors: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700 border-transparent rounded-full px-3",
    	completed: "bg-emerald-100 text-emerald-700 border-transparent rounded-full px-3",
    pending: "bg-amber-100 text-amber-700 border-transparent rounded-full px-3",
    cancelled: "bg-rose-100 text-rose-700 border-transparent rounded-full px-3",
    "checked-in": "bg-orange-100 text-orange-700 border-transparent rounded-full px-3",
    "checked-out": "bg-gray-100 text-gray-600 border-transparent rounded-full px-3",
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here&apos;s your hotel overview.</p>
        </div>

        {/* Loading Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-elevated animate-pulse">
              <div className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card-elevated animate-pulse">
              <div className="p-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Table */}
        <div className="card-elevated animate-pulse">
          <div className="p-6">
            <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      {/* Header */}
         <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground ">Welcome back, Rothana! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Available Rooms"
          value={`${availableRooms}/${rooms.length}`}
          change={`${rooms.length} total rooms`}
          changeType="neutral"
          icon={BedDouble}
          iconColor="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          change={`${pendingBookings} pending`}
          changeType="neutral"
          icon={CalendarCheck}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
    
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Total Guests"
          value={totalGuests}
          change={`${pendingBookings} pending bookings`}
          changeType="neutral"
          icon={Users}
          iconColor="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card-elevated  shadow-sm p-4 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold font-display">Monthly Revenue</h3>
              <p className="text-sm text-muted-foreground">Revenue trend over last 6 months</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyStats}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bookings Chart */}
        <div className="card-elevated shadow-sm p-4 rounded-xl ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold font-display">Monthly Bookings</h3>
              <p className="text-sm text-muted-foreground">Booking volume over last 6 months</p>
            </div>
            <CalendarCheck className="h-5 w-5 text-indigo-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyStats}>
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
              />
              <Bar dataKey="bookings" name="Bookings" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card-elevated p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold font-display">Recent Bookings</h3>
            <p className="text-sm text-muted-foreground">Latest booking activities</p>
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground">Booking ID</TableHead>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground">Guest</TableHead>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground">Email</TableHead>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground">Room</TableHead>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground">Check-in</TableHead>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground">Check-out</TableHead>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="uppercase text-xs font-semibold text-muted-foreground text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking: any) => {
                  const guest = booking.userResponse;
                  const room = booking.roomResponse;
                  const bookingStatus = booking.status || "pending";

                  return (
                    <TableRow key={booking.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">#{booking.id.toString().padStart(4, "0")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium font-bold">
                            {guest?.name?.charAt(0) || "G"}
                          </div>
                          {guest?.name || "Guest"}
                        </div>
                      </TableCell>
                      <TableCell className=" font-medium">{guest?.email || "No email"}</TableCell>
                      <TableCell className="font-medium">{room?.roomType?.typeName || "Unknown"}</TableCell>
                      <TableCell className="font-medium">{formatDate(booking.checkin)}</TableCell>
                      <TableCell className="font-medium">{formatDate(booking.checkout)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[bookingStatus] || "bg-muted/10 text-muted-foreground border-muted"}>
                          {bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-600 font-bold">
                        ${(booking.amount || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No recent bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;