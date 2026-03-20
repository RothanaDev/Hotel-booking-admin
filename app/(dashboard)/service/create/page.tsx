"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateService } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Package, Image as ImageIcon, X, Upload, DollarSign, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { createServiceSchema, type CreateServiceFormValues } from "@/lib/validator/service";

export default function CreateServicePage() {
    const router = useRouter();
    const createServiceMutation = useCreateService();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateServiceFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createServiceSchema) as any,
        defaultValues: {
            serviceName: "",
            description: "",
            price: undefined,
            category: "Dining",
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const watchedImage = watch("image");

    useEffect(() => {
        if (watchedImage instanceof File) {
            const url = URL.createObjectURL(watchedImage);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [watchedImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file, { shouldValidate: true });
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
            setValue("image", file, { shouldValidate: true });
        }
    };

    const onSubmit = async (data: CreateServiceFormValues) => {
        try {
            const submissionData = new FormData();
            submissionData.append("serviceName", data.serviceName);
            if (data.description) {
                submissionData.append("description", data.description);
            }
            submissionData.append("price", data.price.toString());
            submissionData.append("category", data.category);
            submissionData.append("image", data.image);

            await createServiceMutation.mutateAsync(submissionData);

            Swal.fire({
                title: "Success!",
                text: "New service has been created successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                customClass: { popup: 'rounded-xl' }
            });
            router.push("/service");
        } catch {
            Swal.fire({
                title: "Error!",
                text: "Failed to create service. Please try again.",
                icon: "error",
                confirmButtonColor: "#ffa500",
                customClass: { popup: 'rounded-xl' }
            });
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-50/50">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Add New Service</h1>
                        <p className="text-slate-500 mt-1">Create a new service offering for your guests.</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                        <X className="h-5 w-5 mr-2" /> Cancel
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8" noValidate>

                    {/* LEFT COLUMN: Service Info */}
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white h-fit">
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 pb-2">
                                <Package className="h-5 w-5 text-slate-700" />
                                <h2 className="text-xl font-bold text-slate-900">Service Details</h2>
                            </div>

                            <div className="space-y-6">

                                {/* Service Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="serviceName" className="text-sm font-semibold text-slate-700">
                                        Service Name <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="serviceName"
                                        {...register("serviceName")}
                                        placeholder="e.g. In-Room Dining"
                                        className={`h-12 rounded-xl border-2 transition-all ${errors.serviceName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'}`}
                                    />
                                    {errors.serviceName && <p className="text-xs text-rose-500 font-bold mt-1 ml-1">{errors.serviceName.message}</p>}
                                </div>

                                {/* Category & Price Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
                                            Category <span className="text-rose-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <select
                                                id="category"
                                                {...register("category")}
                                                className={`w-full h-12 rounded-xl border-2 transition-all outline-none appearance-none cursor-pointer pl-10 pr-10 text-sm ${errors.category ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'}`}
                                            >
                                                <option value="Dining">Dining</option>
                                                <option value="Wellness">Wellness</option>
                                                <option value="Transport">Transport</option>
                                                <option value="Housekeeping">Housekeeping</option>
                                                <option value="Water Sports">Water Sports</option>
                                                <option value="Excursion">Excursion</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                        {errors.category && <p className="text-xs text-rose-500 font-bold mt-1 ml-1">{errors.category.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-sm font-semibold text-slate-700">
                                            Price ($) <span className="text-rose-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...register("price")}
                                                className={`pl-10 h-12 rounded-xl border-2 transition-all ${errors.price ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'}`}
                                            />
                                        </div>
                                        {errors.price && <p className="text-xs text-rose-500 font-bold mt-1 ml-1">{errors.price.message}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        {...register("description")}
                                        placeholder="Briefly describe the service..."
                                        className="min-h-[140px] rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 resize-none p-4 transition-all"
                                    />
                                    {errors.description && <p className="text-xs text-rose-500 font-bold mt-1 ml-1">{errors.description.message}</p>}
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
                                    className="space-y-3 cursor-pointer group h-full flex flex-col"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <Label className="text-sm font-semibold text-slate-700 cursor-pointer">
                                        Upload Image <span className="text-rose-500">*</span>
                                    </Label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    <div
                                        className={`flex-1 min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${errors.image ? 'border-rose-500 bg-rose-50/10' : imagePreview ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50'}`}
                                    >
                                        {imagePreview ? (
                                            <>
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                    <Upload className="h-8 w-8 mb-2" />
                                                    <span className="font-medium animate-in zoom-in duration-300">Change Image</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-center p-6 text-slate-400">
                                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                </div>
                                                <p className="font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Click or drag image to upload</p>
                                                <p className="text-xs mt-2 text-slate-400 font-medium">SVG, PNG, JPG (max. 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    {errors.image && <p className="text-xs text-rose-500 font-bold mt-1 text-center">{errors.image.message as string}</p>}
                                </div>
                            </div>
                        </Card>

                        <Button
                            type="submit"
                            disabled={createServiceMutation.isPending}
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-xl text-lg font-bold rounded-2xl transition-all duration-300 active:scale-[0.98]"
                        >
                            {createServiceMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Creating Service...
                                </span>
                            ) : (
                                "+ Create New Service"
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
