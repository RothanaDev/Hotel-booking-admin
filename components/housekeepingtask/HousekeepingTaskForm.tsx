"use client";

import { useState } from "react";
import { useAllRooms, useAllUsers, useCreateHousekeepingTask, useUpdateHousekeepingTask } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ClipboardList, User as UserIcon, Calendar, CheckCircle, Clock, Save, Info, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { HousekeepingTask, HousekeepingTaskCreate, HousekeepingTaskUpdate } from "@/types/housekeeping";

interface HousekeepingTaskFormProps {
    initialData?: HousekeepingTask;
    isEdit?: boolean;
}

export default function HousekeepingTaskForm({ initialData, isEdit }: HousekeepingTaskFormProps) {
    const router = useRouter();
    const { data: rooms = [] } = useAllRooms();
    const { data: users = [] } = useAllUsers();
    const createTask = useCreateHousekeepingTask();
    const updateTask = useUpdateHousekeepingTask();

    const [formData, setFormData] = useState({
        roomId: initialData?.roomId?.toString() || "",
        assignedToId: initialData?.assignedToId?.toString() || "",
        taskDate: initialData?.taskDate || new Date().toISOString().split('T')[0],
        status: initialData?.status || "PENDING",
        remarks: initialData?.remarks || "",
    });

    const selectedRoom = rooms.find((r: any) => r.id.toString() === formData.roomId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.roomId || !formData.assignedToId || !formData.taskDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (isEdit && initialData) {
                const payload: HousekeepingTaskUpdate = {
                    assignedToId: parseInt(formData.assignedToId),
                    taskDate: formData.taskDate,
                    status: formData.status as any,
                    remarks: formData.remarks,
                };
                await updateTask.mutateAsync({ id: initialData.id, payload });

                let roomStatus = "";
                if (formData.status === "PENDING") roomStatus = "DIRTY";
                else if (formData.status === "IN_PROGRESS") roomStatus = "CLEANING";
                else if (formData.status === "DONE") roomStatus = "AVAILABLE";

                toast.success("Assignment updated. Room status synced.", {
                    description: `Status: ${formData.status} -> Room: ${roomStatus}`,
                });
            } else {
                const payload: HousekeepingTaskCreate = {
                    roomId: parseInt(formData.roomId),
                    assignedToId: parseInt(formData.assignedToId),
                    taskDate: formData.taskDate,
                    status: formData.status as any,
                    remarks: formData.remarks,
                };
                await createTask.mutateAsync(payload);
                toast.success("Task assigned successfully. Room marked as DIRTY.", {
                    description: `Room ${selectedRoom?.id || formData.roomId} assigned.`,
                });
            }
            router.push("/housekeepingtask");
        } catch (error) {
            toast.error(isEdit ? "Failed to update task" : "Failed to assign task");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden rounded-[2.5rem]">
                <CardHeader className="bg-gradient-to-br from-[#074868] via-[#09577c] to-[#0a6a94] border-none p-10">
                    <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                <ClipboardList className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold tracking-tight">
                                    {isEdit ? "Modify Assignment" : "New Cleaning Task"}
                                </span>
                                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Automated Inventory Sync</span>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10 md:p-14 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Room Selection */}
                        <div className="space-y-4">
                            <Label htmlFor="roomId" className="text-[11px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                Target Room <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative group">
                                <select
                                    id="roomId"
                                    className="w-full h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={formData.roomId}
                                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                    required
                                    disabled={isEdit}
                                >
                                    <option value="" disabled>Choose a Room...</option>
                                    {rooms.map((room: any) => (
                                        <option key={room.id} value={room.id}>
                                            Room {room.id} — {room.status}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Assign Staff */}
                        <div className="space-y-4">
                            <Label htmlFor="assignedToId" className="text-[11px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                <UserIcon className="w-4 h-4 text-emerald-500" />
                                Cleaning Staff <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative group">
                                <select
                                    id="assignedToId"
                                    className="w-full h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                    value={formData.assignedToId}
                                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Staff Member...</option>
                                    {users.map((u: any) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name || u.username || u.email} (ID: {u.id})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="space-y-4">
                            <Label htmlFor="taskDate" className="text-[11px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                <Calendar className="w-4 h-4 text-amber-500" />
                                Completion Date <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="taskDate"
                                type="date"
                                className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all"
                                value={formData.taskDate}
                                onChange={(e) => setFormData({ ...formData, taskDate: e.target.value })}
                                required
                            />
                        </div>

                        {/* Status Selection */}
                        <div className="space-y-4">
                            <Label htmlFor="status" className="text-[11px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                <Clock className="w-4 h-4 text-purple-500" />
                                Current Progress
                            </Label>
                            <div className="relative group">
                                <select
                                    id="status"
                                    className="w-full h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="PENDING">PENDING (Dirty)</option>
                                    <option value="IN_PROGRESS">IN PROGRESS (Cleaning)</option>
                                    <option value="DONE">DONE (Available)</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-purple-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="remarks" className="text-[11px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                            <Info className="w-4 h-4 text-slate-400" />
                            Special Instructions
                        </Label>
                        <Textarea
                            id="remarks"
                            placeholder="Add any specific cleaning requirements..."
                            className="min-h-[140px] rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 p-6 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all resize-none shadow-inner"
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            maxLength={300}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-slate-50">
                        <Button
                            type="submit"
                            disabled={createTask.isPending || updateTask.isPending}
                            className="flex-1 h-16 bg-gradient-to-r from-[#074868] to-[#0a5e84] hover:shadow-xl hover:scale-[1.02] active:scale-95 text-white shadow-lg text-lg font-black rounded-2xl transition-all duration-300 border-none"
                        >
                            {createTask.isPending || updateTask.isPending ? "Processing..." : isEdit ? "Update Assignment" : "Assign Room Task"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 h-16 border-2 border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900 text-lg font-black rounded-2xl transition-all"
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
