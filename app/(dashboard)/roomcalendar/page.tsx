"use client"

import { useState, useMemo } from "react"
import {
    useAllRooms,
    useRoomCalendarByRoom,
    useAllRoomCalendars,
    useUpdateRoomCalendar,
    useDeleteRoomCalendar
} from "@/hooks/use-queries"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Loader2,
    Calendar,
    Edit3,
    Check,
    X,
    ChevronDown,
    DollarSign,
    Plus,
    Trash2,
    MoreHorizontal,
    Search,
    Filter
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import type { RoomCalendar } from "@/types/roomCalendar"
import type { Room } from "@/types/room"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function RoomCalendarPage() {
    const router = useRouter()
    const [selectedRoomId, setSelectedRoomId] = useState<string>("ALL")
    const [searchQuery, setSearchQuery] = useState("")

    const { data: rooms } = useAllRooms()

    const { data: allEntries, isLoading: allLoading } = useAllRoomCalendars()
    const { data: roomEntries, isLoading: roomLoading } = useRoomCalendarByRoom(selectedRoomId === "ALL" ? "" : selectedRoomId)

    const updateCalendar = useUpdateRoomCalendar()
    const deleteCalendar = useDeleteRoomCalendar()

    const calendarEntries = selectedRoomId === "ALL" ? allEntries : roomEntries
    const isLoading = selectedRoomId === "ALL" ? allLoading : roomLoading

    const filteredEntries = useMemo(() => {
        if (!calendarEntries) return []
        return (calendarEntries as RoomCalendar[]).filter(entry => {
            const matchesSearch =
                (entry.note || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.roomId.toString().includes(searchQuery) ||
                format(new Date(entry.date), "PPP").toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
        })
    }, [calendarEntries, searchQuery])

    const handleToggleAvailability = async (id: number, currentAvailable: boolean) => {
        try {
            await updateCalendar.mutateAsync({
                id,
                payload: { isAvailable: !currentAvailable }
            })
            toast.success(`Room marked as ${!currentAvailable ? 'available' : 'unavailable'}`)
        } catch {
            toast.error("Failed to update availability")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this calendar override?")) return
        try {
            await deleteCalendar.mutateAsync(id)
            toast.success("Override deleted successfully")
        } catch {
            toast.error("Failed to delete override")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Room Calendar</h1>
                    <p className="text-slate-500 font-inter">Manage global availability and special pricing overrides.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/roomcalendar/create">
                        <Button className="bg-slate-900 text-white rounded-xl px-6 h-11 font-bold shadow-lg shadow-slate-200 hover:shadow-xl transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Add Override
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by Room ID, Date, or Notes..."
                        className="pl-11 h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-slate-900/5 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-900/10 appearance-none cursor-pointer font-bold shadow-sm transition-all"
                    >
                        <option value="ALL">All Rooms</option>
                        {rooms?.map((room: Room) => (
                            <option key={room.id} value={room.id}>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                Room #{room.id} ({typeof room.roomType === 'string' ? room.roomType : (room.roomType as any).typeName})
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="pb-4 border-b bg-slate-50/30">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-black flex items-center text-slate-800 uppercase tracking-wider">
                            <Calendar className="w-5 h-5 mr-3 text-indigo-500 fill-indigo-50" />
                            {selectedRoomId === "ALL" ? "Global Overrides" : `Overrides for Room #${selectedRoomId}`}
                            <Badge variant="secondary" className="ml-4 bg-slate-100 text-slate-600 border-none font-bold">
                                {filteredEntries.length} Records
                            </Badge>
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-24 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                            <p className="text-slate-400 font-medium italic">Syncing calendar data...</p>
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-slate-200" />
                            </div>
                            <p className="text-xl font-bold text-slate-400">No overrides found</p>
                            <p className="text-slate-300 mt-2">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="w-[100px] font-bold text-slate-500 py-6 pl-8">ROOM</TableHead>
                                        <TableHead className="w-[200px] font-bold text-slate-500">DATE</TableHead>
                                        <TableHead className="w-[150px] font-bold text-slate-500">STATUS</TableHead>
                                        <TableHead className="font-bold text-slate-500">PRICE</TableHead>
                                        <TableHead className="font-bold text-slate-500">NOTES</TableHead>
                                        <TableHead className="text-right font-bold text-slate-500 pr-8">ACTIONS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEntries.map((entry: RoomCalendar) => (
                                        <TableRow key={entry.id} className="group hover:bg-slate-50/50 transition-all border-slate-100">
                                            <TableCell className="py-6 pl-8">
                                                <Badge className="bg-slate-900 text-white font-mono rounded-lg px-2 text-xs">#{entry.roomId}</Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-slate-700">
                                                {format(new Date(entry.date), "EEE, MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {entry.isAvailable ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-bold rounded-full" variant="outline">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" /> Available
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-rose-50 text-rose-700 border-none px-3 py-1 font-bold rounded-full" variant="outline">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" /> Blocked
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {entry.priceOverride ? (
                                                    <div className="flex items-center text-amber-600 font-black">
                                                        <DollarSign className="w-3 h-3 mr-0.5" />
                                                        {entry.priceOverride}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-xs font-medium uppercase tracking-tighter">System Rate</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-sm max-w-[200px] truncate italic group-hover:text-slate-900 transition-colors">
                                                {entry.note || "-"}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-9 px-4 rounded-xl font-bold ${entry.isAvailable ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                                                        onClick={() => handleToggleAvailability(entry.id, entry.isAvailable)}
                                                        disabled={updateCalendar.isPending}
                                                    >
                                                        {entry.isAvailable ? <X className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                                        {entry.isAvailable ? "Block" : "Unblock"}
                                                    </Button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 transition-all">
                                                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[180px] p-2 rounded-2xl shadow-2xl border-slate-100">
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/roomcalendar/${entry.id}/edit`)}
                                                                className="rounded-xl py-3 font-bold text-slate-600 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                                                            >
                                                                <Edit3 className="w-4 h-4 mr-2" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="rounded-xl py-3 font-bold text-rose-600 cursor-pointer focus:bg-rose-50 focus:text-rose-700 mt-1"
                                                                onClick={() => handleDelete(entry.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete Entry
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
