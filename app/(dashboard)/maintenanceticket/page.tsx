"use client"

import { useState } from "react"
import { useMaintenanceTickets, useUpdateMaintenanceTicket, useDeleteMaintenanceTicket } from "@/hooks/use-queries"
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
import { Loader2, Wrench, CheckCircle, Clock, AlertTriangle, ChevronDown, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function MaintenancePage() {
    const router = useRouter()
    const [statusFilter, setStatusFilter] = useState<string>("ALL")

    const { data: tickets, isLoading } = useMaintenanceTickets({
        status: statusFilter === "ALL" ? undefined : statusFilter
    })

    const updateTicket = useUpdateMaintenanceTicket()
    const deleteTicket = useDeleteMaintenanceTicket()

    const handleStatusUpdate = async (id: number, status: "OPEN" | "FIXING" | "RESOLVED") => {
        try {
            await updateTicket.mutateAsync({
                id,
                payload: { status, resolvedAt: status === "RESOLVED" ? new Date().toISOString() : null }
            })
            toast.success(`Ticket marked as ${status.toLowerCase()}`)
        } catch {
            toast.error("Failed to update ticket")
        }
    }

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e293b",
            cancelButtonColor: "#f43f5e",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl px-6 py-3',
                cancelButton: 'rounded-xl px-6 py-3'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteTicket.mutateAsync(id);
                toast.success("Ticket deleted successfully");
            } catch {
                toast.error("Failed to delete ticket");
            }
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" /> Open</Badge>
            case "FIXING":
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Fixing</Badge>
            case "RESOLVED":
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return <Badge className="bg-red-600">High</Badge>
            case "MEDIUM":
                return <Badge className="bg-amber-500">Medium</Badge>
            case "LOW":
                return <Badge className="bg-blue-500">Low</Badge>
            default:
                return <Badge>{priority}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Maintenance Tickets</h1>
                    <p className="text-slate-500">Manage and track room maintenance issues.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-[180px] h-11 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-slate-900/5 appearance-none cursor-pointer shadow-sm transition-all"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="OPEN">Open</option>
                            <option value="FIXING">Fixing</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <Button
                        onClick={() => router.push("/maintenanceticket/create")}
                        className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/10 flex items-center gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        Create Ticket
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <CardTitle className="text-lg font-bold flex items-center">
                        <Wrench className="w-5 h-5 mr-2 text-slate-400" />
                        Active Tickets ({tickets?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-20">
                            <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
                        </div>
                    ) : tickets?.length === 0 ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                <Wrench className="w-8 h-8" />
                            </div>
                            <div className="text-slate-500 font-medium">No maintenance tickets found.</div>
                            <Button variant="outline" size="sm" onClick={() => setStatusFilter("ALL")}>Clear Filters</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/80">
                                <TableRow>
                                    <TableHead className="w-[80px] pl-6">ID</TableHead>
                                    <TableHead className="w-[120px]">Room</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead className="w-[120px]">Priority</TableHead>
                                    <TableHead className="w-[150px]">Status</TableHead>
                                    <TableHead className="w-[180px]">Reported By</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets?.map((ticket) => (
                                    <TableRow key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="font-mono text-xs text-slate-400 pl-6">#{ticket.id}</TableCell>
                                        <TableCell className="font-bold text-slate-700">Room {ticket.roomId}</TableCell>
                                        <TableCell>
                                            <div className="max-w-[400px] truncate font-medium text-slate-600" title={ticket.issue}>
                                                {ticket.issue}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-700">{ticket.reportedByName || "Anonymous"}</span>
                                                <span className="text-[10px] text-slate-400">{new Date(ticket.createdAt || '').toLocaleDateString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {ticket.status === "OPEN" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 rounded-lg border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                                                        onClick={() => handleStatusUpdate(ticket.id, "FIXING")}
                                                        disabled={updateTicket.isPending}
                                                    >
                                                        Start Fixing
                                                    </Button>
                                                )}
                                                {ticket.status !== "RESOLVED" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 rounded-lg border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                        onClick={() => handleStatusUpdate(ticket.id, "RESOLVED")}
                                                        disabled={updateTicket.isPending}
                                                    >
                                                        Resolve
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                    onClick={() => router.push(`/maintenanceticket/${ticket.id}/edit`)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                    onClick={() => handleDelete(ticket.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
