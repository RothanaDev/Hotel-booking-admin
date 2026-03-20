"use client";

import MaintenanceTicketForm from "@/components/maintenanceticket/MaintenanceTicketForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateMaintenanceTicketPage() {
    const router = useRouter();

    return (
        <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create New Ticket</h1>
                    <p className="text-slate-500 mt-1">Report a new room maintenance issue.</p>
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

            <MaintenanceTicketForm />
        </div>
    );
}
