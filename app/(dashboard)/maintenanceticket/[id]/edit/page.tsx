"use client";

import MaintenanceTicketForm from "@/components/maintenanceticket/MaintenanceTicketForm";
import { useMaintenanceTicket } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function EditMaintenanceTicketPage() {
    const router = useRouter();
    const { id } = useParams();
    const { data: ticket, isLoading } = useMaintenanceTicket(id as string);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold">Ticket not found</h2>
                <Button onClick={() => router.push("/maintenanceticket")} className="mt-4">
                    Back to Tickets
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Update Ticket #{ticket.id}</h1>
                    <p className="text-slate-500 mt-1">Modify maintenance issue details or update status.</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Tickets
                </Button>
            </div>

            <MaintenanceTicketForm initialData={ticket} isEdit={true} />
        </div>
    );
}
