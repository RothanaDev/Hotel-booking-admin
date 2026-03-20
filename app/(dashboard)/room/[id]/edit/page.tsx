"use client";

import { useAllRoomTypes, useUpdateRoom, useRoom } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BedDouble, Image as ImageIcon, X, Upload, Save, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import type { Room } from "@/types/room";
import type { RoomType } from "@/types/room-type";

export default function EditRoomPage() {
    const router = useRouter();
    const params = useParams();
    const roomId = params?.id as string;

    const { data: room, isLoading: isLoadingRoom } = useRoom(roomId);
    const { data: roomTypes = [] as RoomType[] } = useAllRoomTypes();
    const updateRoomMutation = useUpdateRoom();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{
        roomTypeId: string;
        status: string;
        imageFile: File | null;
        imagePreview: string;
    }>({
        roomTypeId: "",
        status: "Available",
        imageFile: null,
        imagePreview: "",
    });

    // Track if we've initialized the form with room data
    const [lastRoomId, setLastRoomId] = useState<string | number | null>(null);

    // Sync room data to form state during render to avoid useEffect cascading renders
    if (room && room.id !== lastRoomId) {
        const roomData = room as Room;
        const types = roomTypes as RoomType[];
        
        let resolvedTypeId = "";
        const rt = roomData.roomType as string | { id: string | number; typeName: string };
        
        if (rt && typeof rt === 'object' && 'id' in rt) {
            resolvedTypeId = String(rt.id);
        } else if (roomData.roomTypeId) {
            resolvedTypeId = String(roomData.roomTypeId);
        } else if (typeof rt === 'string' && types.length > 0) {
            const found = types.find((t: RoomType) => t.typeName === rt);
            if (found) resolvedTypeId = String(found.id);
        }

        let preview = "";
        if (roomData.image) preview = roomData.image;
        else if (roomData.photo) preview = `data:image/jpeg;base64,${roomData.photo}`;
        else if (roomData.roomPhotoUrl) preview = roomData.roomPhotoUrl;

        setFormData({
            roomTypeId: resolvedTypeId,
            status: roomData.status || (roomData.booked ? "Occupied" : "Available"),
            imageFile: null,
            imagePreview: preview,
        });
        setLastRoomId(room.id);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                imageFile: file,
                imagePreview: previewUrl,
            }));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                imageFile: file,
                imagePreview: previewUrl,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.roomTypeId) {
            Swal.fire({
                title: "Missing Information",
                text: "Please select a room type.",
                icon: "warning",
                confirmButtonColor: "#ffa500",
                customClass: { popup: 'rounded-xl' }
            });
            return;
        }

        try {
            const submissionData = new FormData();
            submissionData.append("roomTypeId", formData.roomTypeId);
            submissionData.append("status", formData.status);

            if (formData.imageFile) {
                submissionData.append("image", formData.imageFile);
            }

            await updateRoomMutation.mutateAsync({ roomId, formData: submissionData });

            Swal.fire({
                title: "Updated!",
                text: "Room details have been updated successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                customClass: { popup: 'rounded-xl' }
            });
            router.push("/room");
        } catch (error: unknown) {
            console.error("Update failed:", error);
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update room.";
            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#ffa500",
                customClass: { popup: 'rounded-xl' }
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available': return 'bg-emerald-500';
            case 'occupied': return 'bg-amber-500';
            case 'maintenance': return 'bg-rose-500';
            case 'booked': return 'bg-blue-500';
            default: return 'bg-slate-500';
        }
    }

    if (isLoadingRoom) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-slate-50/50">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Edit Room</h1>
                        <p className="text-slate-500 mt-1">Update room details and status.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                        <X className="h-5 w-5 mr-2" /> Cancel
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: Room Information */}
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white h-fit">
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 pb-2">
                                <BedDouble className="h-5 w-5 text-slate-700" />
                                <h2 className="text-xl font-bold text-slate-900">Room Information</h2>
                            </div>

                            <div className="space-y-6">

                                {/* Room Type */}
                                <div className="space-y-3">
                                    <Label htmlFor="roomTypeId" className="text-sm font-semibold text-slate-700">
                                        Room Type <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="roomTypeId"
                                            name="roomTypeId"
                                            required
                                            className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                                            value={formData.roomTypeId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="" disabled>Select a room type...</option>
                                            {(roomTypes as RoomType[]).map((type: RoomType) => (
                                                <option key={type.id} value={type.id.toString()}>
                                                    {type.typeName} - ${type.price}/night
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="space-y-3">
                                    <Label htmlFor="status" className="text-sm font-semibold text-slate-700">
                                        Current Status
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <span className={`block w-3 h-3 rounded-full ${getStatusColor(formData.status)}`}></span>
                                        </div>
                                        <select
                                            id="status"
                                            name="status"
                                            className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Occupied">Occupied</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Booked">Booked</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Card>

                    {/* RIGHT COLUMN: Room Image */}
                    <div className="space-y-6 flex flex-col">
                        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white flex-1">
                            <div className="p-6 md:p-8 space-y-6 h-full flex flex-col">
                                <div className="flex items-center gap-3 pb-2">
                                    <ImageIcon className="h-5 w-5 text-slate-700" />
                                    <h2 className="text-xl font-bold text-slate-900">Room Image</h2>
                                </div>

                                <div
                                    className="space-y-3 cursor-pointer h-full flex flex-col"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <Label htmlFor="imageUpload" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                        Upload Image
                                    </Label>
                                    <Input
                                        id="imageUpload"
                                        name="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    <div
                                        className={`flex-1 min-h-[350px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 ${formData.imagePreview ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50'}`}
                                    >
                                        {formData.imagePreview ? (
                                            <>
                                                <Image
                                                    src={formData.imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <span className="font-medium">Click to Change Image</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-center p-6 text-slate-400">
                                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                </div>
                                                <p className="font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Click or drag image to upload</p>
                                                <p className="text-xs mt-2 text-slate-400">SVG, PNG, JPG (max. 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </Card>

                        <Button
                            type="submit"
                            disabled={updateRoomMutation.isPending}
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 text-lg font-bold rounded-xl transition-all duration-300"
                        >
                            {updateRoomMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Saving Changes...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="h-5 w-5" /> Save Changes
                                </span>
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
