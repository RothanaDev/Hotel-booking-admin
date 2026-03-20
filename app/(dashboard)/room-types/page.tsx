"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus,
    Search,
    MoreHorizontal,
    AlertCircle,
    Edit,
    Trash2,
    DollarSign,
    Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { RoomType } from "@/types/room-type";
import {
    useAllRoomTypes,
    useCreateRoomType,
    useUpdateRoomType,
    useDeleteRoomType
} from "@/hooks/use-queries";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { roomTypeSchema, type RoomTypeFormValues } from "@/lib/validator/room-type";

export default function RoomTypePage() {
    const { data: roomTypes = [], isLoading, error } = useAllRoomTypes();
    const createMutation = useCreateRoomType();
    const updateMutation = useUpdateRoomType();
    const deleteMutation = useDeleteRoomType();

    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingType, setEditingType] = useState<RoomType | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RoomTypeFormValues>({
        resolver: zodResolver(roomTypeSchema as any),
    });

    const filteredTypes = roomTypes.filter((type: RoomType) =>
        type.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingType(null);
        reset({ typeName: "", description: "", price: undefined });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (type: RoomType) => {
        setEditingType(type);
        reset({
            typeName: type.typeName,
            description: type.description,
            price: type.price
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string | number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This room type will be deleted!",
            icon: "warning",
            width: '350px',
            showCancelButton: true,
            confirmButtonColor: "#ffa500",
            cancelButtonColor: "#074868",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            background: "#ffffff",
            color: "#0f172a",
            customClass: {
                popup: 'rounded-xl border-none shadow-2xl',
                title: 'text-xl font-bold pt-4',
                htmlContainer: 'text-sm text-slate-600 pb-2',
                confirmButton: 'rounded-xl px-5 py-2 text-sm font-bold',
                cancelButton: 'rounded-xl px-5 py-2 text-sm font-bold'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteMutation.mutateAsync(id);
                Swal.fire({
                    title: "Deleted!",
                    text: "Room type has been removed.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-xl shadow-xl'
                    }
                });
            } catch (err: any) {
                Swal.fire({
                    title: "Action Restricted",
                    text: "This room type cannot be deleted. It might be linked to existing rooms.",
                    icon: "error",
                    confirmButtonColor: "#ffa500",
                    customClass: {
                        popup: 'rounded-xl shadow-xl'
                    }
                });
            }
        }
    };

    const onSubmit = async (data: RoomTypeFormValues) => {
        try {
            if (editingType) {
                await updateMutation.mutateAsync({
                    id: editingType.id,
                    roomTypeData: data
                });
            } else {
                await createMutation.mutateAsync(data);
            }
            setIsFormOpen(false);
            Swal.fire({
                title: "Success!",
                text: editingType ? "Room type updated successfully." : "New room type created.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-xl shadow-xl'
                }
            });
        } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: "Failed to save room type. Please check your data.",
                icon: "error",
                confirmButtonColor: "#ffa500",
                customClass: {
                    popup: 'rounded-xl shadow-xl'
                }
            });
        }
    };

    return (
        <div className="space-y-6 container mx-auto py-8 px-4 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Room Types</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage the types of rooms available in your hotel.</p>
                </div>
                <Button
                    onClick={handleOpenCreate}
                    className="bg-[#074868] hover:bg-[#05364d] text-white shadow-lg px-6 h-11 rounded-xl transition-all duration-300 font-bold"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Room Type
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search room types..."
                        className="pl-10 h-12 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="bg-white rounded-2xl border-none shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-b border-slate-100">
                            <TableHead className="w-[100px] py-4 text-slate-500 font-bold pl-6 uppercase text-xs tracking-wider">ID</TableHead>
                            <TableHead className="py-4 text-slate-500 font-bold uppercase text-xs tracking-wider">Room Type</TableHead>
                            <TableHead className="py-4 text-slate-500 font-bold uppercase text-xs tracking-wider">Description</TableHead>
                            <TableHead className="w-[150px] py-4 text-slate-500 font-bold uppercase text-xs tracking-wider">Base Price</TableHead>
                            <TableHead className="w-[60px] py-4 pr-6"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Loader2 className="w-10 h-10 mb-3 animate-spin text-indigo-500" />
                                        <p className="text-sm font-medium">Loading room types...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-rose-400">
                                        <AlertCircle className="w-10 h-10 mb-3" />
                                        <p className="text-sm font-bold">Failed to load data.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredTypes.length > 0 ? (
                            filteredTypes.map((type: RoomType) => (
                                <TableRow key={type.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                    <TableCell className="pl-6 text-slate-400 font-mono text-xs py-5">
                                        #{type.id.toString().padStart(4, '0')}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <p className="font-bold text-slate-900">{type.typeName}</p>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <p className="text-sm text-slate-600 line-clamp-1 max-w-sm font-medium">
                                            {type.description}
                                        </p>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <span className="font-bold text-indigo-600 font-medium">${type.price}</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-5">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-slate-100 p-1">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(type)} className="rounded-lg cursor-pointer py-2.5">
                                                    <Edit className="w-4 h-4 mr-3 text-slate-500" />
                                                    <span className="font-bold">Edit Type</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(type.id)}
                                                    className="rounded-lg text-rose-600 focus:text-rose-600 cursor-pointer py-2.5 focus:bg-rose-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-3" />
                                                    <span className="font-bold">Delete Type</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400 opacity-60">
                                        <Package className="w-12 h-12 mb-4" />
                                        <p className="font-bold">No room types found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 rounded-2xl border-none">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                            <CardTitle className="text-2xl font-bold text-slate-900">{editingType ? "Update Room Type" : "New Room Type"}</CardTitle>
                            <CardDescription className="font-medium">
                                Specify details for the room classification.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Type Name <span className="text-rose-500">*</span></label>
                                    <Input
                                        {...register("typeName")}
                                        placeholder="e.g. Luxury Penthouse"
                                        className={`h-12 border-2 rounded-xl transition-all ${errors.typeName ? 'border-rose-500 bg-rose-50/30 ring-rose-200' : 'border-slate-100 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100'}`}
                                    />
                                    {errors.typeName && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.typeName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Description <span className="text-rose-500">*</span></label>
                                    <textarea
                                        {...register("description")}
                                        rows={3}
                                        placeholder="Features, amenities, and details..."
                                        className={`w-full rounded-xl border-2 px-3 py-3 text-sm shadow-sm transition-all focus-visible:outline-none focus:ring-2 resize-none ${errors.description ? 'border-rose-500 bg-rose-50/30 ring-rose-200 focus:ring-rose-200' : 'border-slate-100 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100'}`}
                                    />
                                    {errors.description && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.description.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Base Price (per night) <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register("price")}
                                            className={`pl-10 h-12 border-2 rounded-xl transition-all ${errors.price ? 'border-rose-500 bg-rose-50/30 ring-rose-200' : 'border-slate-100 bg-slate-50 focus:border-indigo-400 focus:ring-indigo-100'}`}
                                        />
                                    </div>
                                    {errors.price && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.price.message}</p>}
                                </div>
                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsFormOpen(false)}
                                        className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="h-12 px-8 bg-[#074868] hover:bg-[#05364d] text-white shadow-xl rounded-xl font-bold transition-all duration-300 active:scale-95"
                                    >
                                        {createMutation.isPending || updateMutation.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : editingType ? "Update Type" : "Create Type"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
