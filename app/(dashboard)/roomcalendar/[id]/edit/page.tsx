"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useRoomCalendar, useUpdateRoomCalendar } from "@/hooks/use-queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Save, X, DollarSign, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { RoomCalendarUpdate } from "@/types/roomCalendar"

export default function EditRoomCalendarPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const { data: entry, isLoading } = useRoomCalendar(id)
    const updateMutation = useUpdateRoomCalendar()

    const [formData, setFormData] = useState<RoomCalendarUpdate>({
        date: "",
        isAvailable: true,
        priceOverride: null,
        note: ""
    })

    useEffect(() => {
        if (entry) {
            setFormData({
                date: entry.date,
                isAvailable: entry.isAvailable,
                priceOverride: entry.priceOverride,
                note: entry.note || ""
            })
        }
    }, [entry])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateMutation.mutateAsync({ id, payload: formData })
            toast.success("Calendar entry updated successfully")
            router.push("/roomcalendar")
        } catch (error) {
            toast.error("Failed to update calendar entry")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Override</h1>
                    <p className="text-slate-500">Modify the existing override for Room #{entry?.roomId} on {entry?.date}.</p>
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
                            Update Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* Date - Read Only or Editable? Backend supports it */}
                        <div className="space-y-3">
                            <Label htmlFor="date" className="text-sm font-bold text-slate-700">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium focus:ring-indigo-500/20"
                            />
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
                            </div>

                            {/* Price Override */}
                            <div className="space-y-3">
                                <Label htmlFor="priceOverride" className="text-sm font-bold text-slate-700">
                                    Price Override
                                </Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="priceOverride"
                                        type="number"
                                        step="0.01"
                                        placeholder="Default price"
                                        value={formData.priceOverride || ""}
                                        onChange={(e) => setFormData({ ...formData, priceOverride: e.target.value ? Number(e.target.value) : null })}
                                        className="h-12 pl-10 rounded-xl border-slate-200 bg-slate-50 font-medium focus:ring-indigo-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="space-y-3 pt-4">
                            <Label htmlFor="note" className="text-sm font-bold text-slate-700">Internal Notes</Label>
                            <Textarea
                                id="note"
                                placeholder="..."
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
                                disabled={updateMutation.isPending}
                                className="h-12 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg hover:shadow-xl"
                            >
                                {updateMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save Changes
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
