"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAllRooms, useCreateRoomCalendar } from "@/hooks/use-queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Save, X, ChevronDown, DollarSign, Info } from "lucide-react"
import { toast } from "sonner"
import type { RoomCalendarCreate } from "@/types/roomCalendar"
import type { Room } from "@/types/room"

export default function CreateRoomCalendarPage() {
    const router = useRouter()
    const { data: rooms } = useAllRooms()
    const createMutation = useCreateRoomCalendar()

    const [formData, setFormData] = useState<RoomCalendarCreate>({
        roomId: 0,
        date: new Date().toISOString().split('T')[0],
        isAvailable: true,
        priceOverride: null,
        note: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.roomId === 0) {
            toast.error("Please select a room")
            return
        }

        try {
            await createMutation.mutateAsync(formData)
            toast.success("Calendar entry created successfully")
            router.push("/roomcalendar")
        } catch {
            toast.error("Failed to create calendar entry. This date might already have an override.")
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add Calendar Override</h1>
                    <p className="text-slate-500">Create a specific availability or price rule for a room on a chosen date.</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-slate-400 hover:text-slate-600 rounded-xl"
                >
                    <X className="h-5 w-5 mr-2" /> Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <CardTitle className="text-lg font-bold flex items-center text-slate-700">
                            <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                            Override Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Room Selection */}
                            <div className="space-y-3">
                                <Label htmlFor="roomId" className="text-sm font-bold text-slate-700">
                                    Select Room <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative">
                                    <select
                                        id="roomId"
                                        required
                                        value={formData.roomId}
                                        onChange={(e) => setFormData({ ...formData, roomId: Number(e.target.value) })}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer font-medium"
                                    >
                                        <option value={0} disabled>Choose a room...</option>
                                        {rooms?.map((room: Room) => (
                                            <option key={room.id} value={room.id}>
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                Room #{room.id} - {typeof room.roomType === 'string' ? room.roomType : (room.roomType as any)?.typeName}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-3">
                                <Label htmlFor="date" className="text-sm font-bold text-slate-700">
                                    Target Date <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {/* Availability Toggle */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700">Availability Status</Label>
                                <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isAvailable: true })}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${formData.isAvailable
                                                ? "bg-white text-emerald-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        Available
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isAvailable: false })}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!formData.isAvailable
                                                ? "bg-white text-rose-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        Blocked
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 flex items-center">
                                    <Info className="w-3 h-3 mr-1" />
                                    Override the default system availability.
                                </p>
                            </div>

                            {/* Price Override */}
                            <div className="space-y-3">
                                <Label htmlFor="priceOverride" className="text-sm font-bold text-slate-700">
                                    Price Override (Optional)
                                </Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="priceOverride"
                                        type="number"
                                        step="0.01"
                                        placeholder="Leave empty for default price"
                                        value={formData.priceOverride || ""}
                                        onChange={(e) => setFormData({ ...formData, priceOverride: e.target.value ? Number(e.target.value) : null })}
                                        className="h-12 pl-10 rounded-xl border-slate-200 bg-slate-50 font-medium focus:ring-indigo-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="space-y-3 pt-4">
                            <Label htmlFor="note" className="text-sm font-bold text-slate-700">Internal Notes / Reason</Label>
                            <Textarea
                                id="note"
                                placeholder="e.g. Blocked for maintenance, Special holiday pricing..."
                                value={formData.note || ""}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="min-h-[120px] rounded-xl border-slate-200 bg-slate-50 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="pt-6 border-t flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="h-12 px-8 rounded-xl border-slate-200 hover:bg-slate-50 font-bold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="h-12 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg hover:shadow-xl"
                            >
                                {createMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Create Override
                                    </span>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
