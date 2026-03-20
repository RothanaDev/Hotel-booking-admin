"use client";

import HousekeepingTaskForm from "@/components/housekeepingtask/HousekeepingTaskForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateHousekeepingTaskPage() {
    const router = useRouter();

    return (
        <div className="p-6 md:p-12 space-y-12 bg-slate-50/30 min-h-screen">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="p-0 h-auto text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 group font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Task View
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#074868]/10 rounded-2xl">
                            <Sparkles className="w-8 h-8 text-[#074868]" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assign Task</h1>
                    </div>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <HousekeepingTaskForm />
            </div>
        </div>
    );
}
