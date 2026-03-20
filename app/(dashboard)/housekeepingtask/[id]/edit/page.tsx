"use client";

import { useParams, useRouter } from "next/navigation";
import { useHousekeepingTask } from "@/hooks/use-queries";
import HousekeepingTaskForm from "@/components/housekeepingtask/HousekeepingTaskForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, PenLine } from "lucide-react";

export default function EditHousekeepingTaskPage() {
    const router = useRouter();
    const { id } = useParams();
    const { data: task, isLoading } = useHousekeepingTask(id as string);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
                <Loader2 className="w-16 h-16 animate-spin text-[#074868]" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Task Data...</p>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-12">
                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl">
                    <PenLine className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Task Not Found</h2>
                <Button
                    onClick={() => router.push("/housekeepingtask")}
                    className="mt-10 h-14 bg-slate-900 hover:bg-black text-white rounded-2xl px-10 font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                    Back to Dashboard
                </Button>
            </div>
        );
    }

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
                        <div className="p-3 bg-amber-50 rounded-2xl">
                            <PenLine className="w-8 h-8 text-amber-600" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit Task</h1>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-slate-100 px-8 py-4 rounded-[2rem] hidden md:block shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Assignment ID</p>
                    <p className="text-lg font-mono font-black text-slate-700">#HK-{task.id?.toString().padStart(5, '0')}</p>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <HousekeepingTaskForm initialData={task} isEdit={true} />
            </div>
        </div>
    );
}
