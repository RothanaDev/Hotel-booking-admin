"use client";

import { useState } from "react";
import { useAllRooms, useCreateMaintenanceTicket, useUpdateMaintenanceTicket } from "@/hooks/use-queries";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, AlertCircle, CheckCircle, Clock, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MaintenanceTicket, MaintenanceTicketCreate, MaintenanceTicketUpdate } from "@/types/maintenance";
import type { Room } from "@/types/room";

interface MaintenanceTicketFormProps {
    initialData?: MaintenanceTicket;
    isEdit?: boolean;
}

export default function MaintenanceTicketForm({ initialData, isEdit }: MaintenanceTicketFormProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { data: rooms = [] } = useAllRooms();
    const createTicket = useCreateMaintenanceTicket();
    const updateTicket = useUpdateMaintenanceTicket();

    const [formData, setFormData] = useState({
        roomId: initialData?.roomId?.toString() || "",
        issue: initialData?.issue || "",
        priority: initialData?.priority || "MEDIUM",
        status: initialData?.status || "OPEN",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to report an issue");
            return;
        }

        if (!formData.roomId || !formData.issue) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (isEdit && initialData) {
                const payload: MaintenanceTicketUpdate = {
                    issue: formData.issue,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    priority: formData.priority as any,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    status: formData.status as any,
                    resolvedAt: formData.status === "RESOLVED" ? new Date().toISOString() : null
                };
                await updateTicket.mutateAsync({ id: initialData.id, payload });
                toast.success("Ticket updated successfully");
            } else {
                const payload: MaintenanceTicketCreate = {
                    roomId: parseInt(formData.roomId),
                    reportedById: typeof user.id === 'string' ? parseInt(user.id) : user.id,
                    issue: formData.issue,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    priority: formData.priority as any,
                };
                await createTicket.mutateAsync(payload);
                toast.success("Maintenance ticket created successfully");
            }
            router.push("/maintenanceticket");
        } catch (error) {
            toast.error(isEdit ? "Failed to update ticket" : "Failed to create ticket");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <Card className="border-none shadow-lg bg-white overflow-hidden rounded-2xl">
                <CardHeader className="bg-slate-900 border-none p-6">
                    <CardTitle className="text-white flex items-center gap-2 text-xl">
                        <Wrench className="w-6 h-6" />
                        {isEdit ? "Update Maintenance Ticket" : "Report Maintenance Issue"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Room Selection - Only for creation */}
                        {!isEdit && (
                            <div className="space-y-3">
                                <Label htmlFor="roomId" className="text-sm font-semibold text-slate-700">
                                    Room Number <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative">
                                    <select
                                        id="roomId"
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none cursor-pointer"
                                        value={formData.roomId}
                                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a room...</option>
                                        {rooms.map((room: Room) => (
                                            <option key={room.id} value={room.id}>
                                                Room {room.id}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Priority Selection */}
                        <div className="space-y-3">
                            <Label htmlFor="priority" className="text-sm font-semibold text-slate-700">
                                Priority Level
                            </Label>
                            <div className="relative">
                                <select
                                    id="priority"
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none cursor-pointer"
                                    value={formData.priority}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                >
                                    <option value="LOW">Low Priority</option>
                                    <option value="MEDIUM">Medium Priority</option>
                                    <option value="HIGH">High Priority</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Status Selection - Only for edit */}
                        {isEdit && (
                            <div className="space-y-3">
                                <Label htmlFor="status" className="text-sm font-semibold text-slate-700">
                                    Current Status
                                </Label>
                                <div className="relative">
                                    <select
                                        id="status"
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none cursor-pointer"
                                        value={formData.status}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="FIXING">Fixing</option>
                                        <option value="RESOLVED">Resolved</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="issue" className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                            <span>Issue Description <span className="text-rose-500">*</span></span>
                            <span className="text-xs font-normal text-slate-400">{formData.issue.length}/500</span>
                        </Label>
                        <Textarea
                            id="issue"
                            placeholder="Describe the maintenance issue in detail (e.g., Leaking faucet in bathroom, AC not cooling...)"
                            className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50 focus:ring-slate-900/10 transition-all resize-none"
                            value={formData.issue}
                            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                            maxLength={500}
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={createTicket.isPending || updateTicket.isPending}
                            className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-lg text-lg font-bold rounded-xl transition-all duration-300"
                        >
                            {createTicket.isPending || updateTicket.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    {isEdit ? "Updating..." : "Submitting..."}
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isEdit ? <Save className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                                    {isEdit ? "Update Ticket" : "Report Issue"}
                                </span>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 h-14 border-slate-200 text-slate-600 hover:bg-slate-50 text-lg font-semibold rounded-xl"
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider text-[10px]">Resolved</p>
                        <p className="text-sm text-emerald-700">Quick fixes</p>
                    </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-amber-900 uppercase tracking-wider text-[10px]">Processing</p>
                        <p className="text-sm text-amber-700">Average 2-4 hours</p>
                    </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-rose-900 uppercase tracking-wider text-[10px]">Urgent</p>
                        <p className="text-sm text-rose-700">High priority</p>
                    </div>
                </div>
            </div>
        </form>
    );
}
