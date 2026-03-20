"use client";

import { useService, useUpdateService } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Package, Image as ImageIcon, X, Upload, Save, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const serviceId = params?.id as string;

    const { data: service, isLoading } = useService(serviceId);
    const updateServiceMutation = useUpdateService();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{
        serviceName: string;
        description: string;
        price: string;
        category: string;
        imageFile: File | null;
        imagePreview: string;
    }>({
        serviceName: "",
        description: "",
        price: "",
        category: "Dining",
        imageFile: null,
        imagePreview: "",
    });

    const [lastServiceId, setLastServiceId] = useState<string | number | null>(null);

    // Sync service data to form state during render
    if (service && service.id !== lastServiceId) {
        let preview = "";
        if (service.image) preview = service.image;
        else if (service.photo) preview = `data:image/jpeg;base64,${service.photo}`;

        setFormData({
            serviceName: service.serviceName || "",
            description: service.description || "",
            price: service.price ? String(service.price) : "",
            category: service.category || "Dining",
            imageFile: null,
            imagePreview: preview
        });
        setLastServiceId(service.id);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

        if (!formData.serviceName || !formData.price) {
            Swal.fire({
                title: "Missing Information",
                text: "Please fill in all required fields.",
                icon: "warning",
                confirmButtonColor: "#ffa500",
                customClass: { popup: 'rounded-xl' }
            });
            return;
        }

        try {
            const submissionData = new FormData();
            submissionData.append("serviceName", formData.serviceName);
            submissionData.append("description", formData.description);
            submissionData.append("price", formData.price);
            submissionData.append("category", formData.category);
            if (formData.imageFile) {
                submissionData.append("image", formData.imageFile);
            }

            await updateServiceMutation.mutateAsync({ id: serviceId, formData: submissionData });

            Swal.fire({
                title: "Updated!",
                text: "Service details have been updated.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                customClass: { popup: 'rounded-xl' }
            });
            router.push("/service");
        } catch {
            Swal.fire({
                title: "Error!",
                text: "Failed to update service.",
                icon: "error",
                confirmButtonColor: "#ffa500",
                customClass: { popup: 'rounded-xl' }
            });
        }
    };

    if (isLoading) {
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
                        <h1 className="text-3xl font-bold text-slate-900">Edit Service</h1>
                        <p className="text-slate-500 mt-1">Update service information and details.</p>
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

                    {/* LEFT COLUMN: Service Info */}
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white h-fit">
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 pb-2">
                                <Package className="h-5 w-5 text-slate-700" />
                                <h2 className="text-xl font-bold text-slate-900">Service Details</h2>
                            </div>

                            <div className="space-y-6">

                                {/* Service Name */}
                                <div className="space-y-3">
                                    <Label htmlFor="serviceName" className="text-sm font-semibold text-slate-700">
                                        Service Name <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="serviceName"
                                        name="serviceName"
                                        placeholder="e.g. In-Room Dining"
                                        required
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500/10"
                                        value={formData.serviceName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Category & Price Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
                                            Category
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="category"
                                                name="category"
                                                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Dining">Dining</option>
                                                <option value="Wellness">Wellness</option>
                                                <option value="Transport">Transport</option>
                                                <option value="Housekeeping">Housekeeping</option>
                                                <option value="Water Sports">Water Sports</option>
                                                <option value="Excursion">Excursion</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="price" className="text-sm font-semibold text-slate-700">
                                            Price ($) <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="0.00"
                                            required
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500/10"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Briefly describe the service..."
                                        className="min-h-[120px] rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500/10 resize-none p-4"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                        </div>
                    </Card>

                    {/* RIGHT COLUMN: Service Image */}
                    <div className="space-y-6 flex flex-col">
                        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white flex-1">
                            <div className="p-6 md:p-8 space-y-6 h-full flex flex-col">
                                <div className="flex items-center gap-3 pb-2">
                                    <ImageIcon className="h-5 w-5 text-slate-700" />
                                    <h2 className="text-xl font-bold text-slate-900">Service Image</h2>
                                </div>

                                <div
                                    className="space-y-3 cursor-pointer"
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
                                        className={`flex-1 min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 ${formData.imagePreview ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50'}`}
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
                            disabled={updateServiceMutation.isPending}
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 text-lg font-bold rounded-xl transition-all duration-300"
                        >
                            {updateServiceMutation.isPending ? (
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
