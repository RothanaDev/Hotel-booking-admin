"use client"

import { useState } from "react"
import { useHousekeepingTasks, useUpdateHousekeepingTask, useDeleteHousekeepingTask } from "@/hooks/use-queries"
import { Button } from "@/components/ui/button"
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
import { Loader2, ClipboardList, CheckCircle2, RotateCw, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function HousekeepingPage() {
    const router = useRouter()
    const [statusFilter, setStatusFilter] = useState<string>("ALL")

    const { data: tasks, isLoading } = useHousekeepingTasks({
        status: statusFilter === "ALL" ? undefined : statusFilter
    })

    const updateTask = useUpdateHousekeepingTask()
    const deleteTask = useDeleteHousekeepingTask()

    const handleStatusUpdate = async (id: number, status: "PENDING" | "IN_PROGRESS" | "DONE") => {
        try {
            await updateTask.mutateAsync({
                id,
                payload: { status }
            })
            toast.success(`Task marked as ${status.toLowerCase()}`)
        } catch {
            toast.error("Failed to update task")
        }
    }

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Delete Task?",
            text: "This cleaning assignment will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0f172a",
            cancelButtonColor: "#f1f5f9",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            customClass: {
                popup: "rounded-3xl p-6",
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteTask.mutateAsync(id);
                toast.success("Task deleted successfully");
            } catch {
                toast.error("Failed to delete task");
            }
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 rounded-full px-3">Pending</Badge>
            case "IN_PROGRESS":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-full px-3">In Progress</Badge>
            case "DONE":
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full px-3 text-[10px] font-bold">Done</Badge>
            default:
                return <Badge className="rounded-full px-3">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Housekeeping Tasks</h1>
                    <p className="text-slate-500">Monitor and manage room cleaning schedules.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-lg border p-1 shadow-sm">
                        {["ALL", "PENDING", "IN_PROGRESS", "DONE"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${statusFilter === status
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50"
                                    }`}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
                            </button>
                        ))}
                    </div>
                    <Button
                        onClick={() => router.push("/housekeepingtask/create")}
                        className="bg-slate-900 hover:bg-black text-white px-6 font-bold rounded-lg h-10 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Assign Task
                    </Button>
                </div>
            </div>

            <Card className="border shadow-sm bg-white rounded-xl overflow-hidden">
                <CardHeader className="pb-3 border-b bg-slate-50/30">
                    <CardTitle className="text-lg font-bold flex items-center text-slate-800">
                        <ClipboardList className="w-5 h-5 mr-2 text-slate-400" />
                        Cleaning Tasks ({tasks?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-24">
                            <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
                        </div>
                    ) : tasks?.length === 0 ? (
                        <div className="p-24 text-center text-slate-500 font-medium">
                            No housekeeping tasks found for the selected filter.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[120px] font-bold text-slate-800">Room</TableHead>
                                    <TableHead className="font-bold text-slate-800">Assigned To</TableHead>
                                    <TableHead className="font-bold text-slate-800">Date</TableHead>
                                    <TableHead className="font-bold text-slate-800">Remarks</TableHead>
                                    <TableHead className="w-[150px] font-bold text-slate-800">Status</TableHead>
                                    <TableHead className="text-right font-bold text-slate-800">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks?.map((task) => (
                                    <TableRow key={task.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <TableCell className="font-bold text-slate-900">Room {task.roomId}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{task.assignedToName || "Unassigned"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {format(new Date(task.taskDate), "MMMM do, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-slate-500 italic text-sm">
                                            {task.remarks || "No special instructions"}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                {task.status === "PENDING" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-3 text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-lg"
                                                        onClick={() => handleStatusUpdate(task.id, "IN_PROGRESS")}
                                                        disabled={updateTask.isPending}
                                                    >
                                                        <RotateCw className="w-3 h-3 mr-1.5 animate-spin-slow" /> Start
                                                    </Button>
                                                )}
                                                {task.status !== "DONE" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-3 text-emerald-600 hover:bg-emerald-50 font-bold text-xs rounded-lg"
                                                        onClick={() => handleStatusUpdate(task.id, "DONE")}
                                                        disabled={updateTask.isPending}
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 mr-1.5" /> Complete
                                                    </Button>
                                                )}
                                                <div className="flex items-center gap-1 border-l pl-2 border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                                                        onClick={() => router.push(`/housekeepingtask/${task.id}/edit`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                        onClick={() => handleDelete(task.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
