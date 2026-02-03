"use client";

import React, { useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    MoreHorizontal,
    LayoutGrid,
    List as ListIcon,
    AlertCircle,
    Edit,
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

export default function RoomTypePage() {
    const { data: roomTypes = [], isLoading, error } = useAllRoomTypes();
    const createMutation = useCreateRoomType();
    const updateMutation = useUpdateRoomType();
    const deleteMutation = useDeleteRoomType();

    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingType, setEditingType] = useState<RoomType | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        typeName: "",
        description: "",
        price: ""
    });

    const filteredTypes = roomTypes.filter((type: RoomType) =>
        type.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingType(null);
        setFormData({ typeName: "", description: "", price: "" });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (type: RoomType) => {
        setEditingType(type);
        setFormData({
            typeName: type.typeName,
            description: type.description,
            price: type.price.toString()
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
                    width: '350px',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-xl shadow-xl border-none py-6',
                        title: 'text-xl font-bold',
                        htmlContainer: 'text-sm text-slate-600'
                    }
                });
            } catch (err: any) {
                Swal.fire({
                    title: "Access Denied",
                    text: "You don't have permission to delete this",
                    icon: "error",
                    width: '350px',
                    confirmButtonColor: "#ffa500",
                    customClass: {
                        popup: 'rounded-xl shadow-xl border-none',
                        title: 'text-xl font-bold',
                        htmlContainer: 'text-sm text-slate-600',
                        confirmButton: 'rounded-xl px-5 py-2 text-sm font-bold'
                    }
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            typeName: formData.typeName,
            description: formData.description,
            price: parseFloat(formData.price)
        };

        try {
            if (editingType) {
                await updateMutation.mutateAsync({
                    id: editingType.id,
                    roomTypeData: payload
                });
            } else {
                await createMutation.mutateAsync(payload);
            }
            setIsFormOpen(false);
            Swal.fire({
                title: "Success!",
                text: editingType ? "Room type updated successfully." : "New room type created.",
                icon: "success",
                width: '350px',
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-xl shadow-xl border-none py-6',
                    title: 'text-xl font-bold',
                    htmlContainer: 'text-sm text-slate-600'
                }
            });
        } catch (err: any) {
            if (err.response?.status === 403) {
                Swal.fire({
                    title: "Access Denied",
                    text: "You don't have permission to modify this ",
                    icon: "error",
                    width: '350px',
                    confirmButtonColor: "#ffa500",
                    customClass: {
                        popup: 'rounded-xl shadow-xl border-none',
                        title: 'text-xl font-bold',
                        htmlContainer: 'text-sm text-slate-600',
                        confirmButton: 'rounded-xl px-5 py-2 text-sm font-bold'
                    }
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to save. Please check if the name already exists or check your connection.",
                    icon: "error",
                    width: '350px',
                    confirmButtonColor: "#ffa500",
                    customClass: {
                        popup: 'rounded-xl shadow-xl border-none',
                        title: 'text-xl font-bold',
                        htmlContainer: 'text-sm text-slate-600',
                        confirmButton: 'rounded-xl px-5 py-2 text-sm font-bold'
                    }
                });
            }
        }
    };

    return (
        <div className="space-y-6 container mx-auto py-8 px-4 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Room Types</h1>
                    <p className="text-gray-500 mt-1">Manage the types of rooms available in your hotel.</p>
                </div>
                <Button
                    onClick={handleOpenCreate}
                    className="bg-[#074868] hover:bg-[#074868] text-white shadow-lg shadow-orange-500/20 px-6 h-11 rounded-xl transition-all duration-300 font-semibold"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Room Type
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or description..."
                        className="pl-10 h-12 bg-white border-slate-200/60 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-[#ffa500]/50 transition-all duration-300 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px] py-4 text-slate-500 font-medium pl-6">ID</TableHead>
                            <TableHead className="py-4 text-slate-500 font-medium">Room Type</TableHead>
                            <TableHead className="py-4 text-slate-500 font-medium">Description</TableHead>
                            <TableHead className="w-[150px] py-4 text-slate-500 font-medium">Base Price</TableHead>
                            <TableHead className="w-[60px] py-4 pr-6"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center bg-gray-50/30">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-[#ffa500]" />
                                        <p className="text-sm">Fetching room types...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center bg-red-50/10">
                                    <div className="flex flex-col items-center justify-center text-red-400">
                                        <AlertCircle className="w-8 h-8 mb-2" />
                                        <p className="text-sm font-medium">Failed to load data. Please check backend connection.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredTypes.length > 0 ? (
                            filteredTypes.map((type: RoomType) => (
                                <TableRow key={type.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0 group">
                                    <TableCell className="pl-6 text-slate-600 font-medium py-5">
                                        #{type.id.toString().padStart(4, '0')}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div>
                                            <p className="font-bold text-slate-900 mb-0.5 font-medium">{type.typeName}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <p className="text-sm text-slate-600 line-clamp-1 max-w-sm font-medium">
                                            {type.description}
                                        </p>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <span className="font-bold font-medium text-slate-900">${type.price}</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-5">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-slate-200/60 p-1">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(type)} className="rounded-lg cursor-pointer py-2">
                                                    <Edit className="w-4 h-4 mr-3 text-slate-500" />
                                                    <span className="font-medium">Edit Type</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(type.id)}
                                                    className="rounded-lg text-red-600 focus:text-red-600 cursor-pointer py-2"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-3" />
                                                    <span className="font-medium">Delete Type</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center bg-gray-50/30">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                                        <p>No room types found matching your search.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Simplified Modal (Form Overlay) */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                        <CardHeader className="border-b bg-gray-50/50">
                            <CardTitle>{editingType ? "Edit Room Type" : "Add New Room Type"}</CardTitle>
                            <CardDescription>
                                Fill in the details for the room type below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Type Name</label>
                                    <Input
                                        required
                                        placeholder="e.g. Standard Room"
                                        value={formData.typeName}
                                        onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Brief description of the room type..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Price (per night)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            required
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="pl-7 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-6 border-gray-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="px-6 bg-[#074868]  hover:bg-[#074868]  text-white shadow-lg shadow-orange-500/20 rounded-xl font-semibold transition-all duration-300"
                                    >
                                        {createMutation.isPending || updateMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : editingType ? "Update Room Type" : "Create Room Type"}
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
