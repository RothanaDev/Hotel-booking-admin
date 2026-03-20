"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAllRoomTypes, useAddRoom } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BedDouble, Image as ImageIcon, X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { createRoomSchema, type CreateRoomFormValues } from "@/lib/validator/room";
import Image from "next/image";
import type { RoomType } from "@/types/room-type";

export default function CreateRoomPage() {
  const router = useRouter();
  const { data: roomTypes = [] as RoomType[] } = useAllRoomTypes();
  const addRoomMutation = useAddRoom();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomTypeId: "",
      status: "Available",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedImage = watch("image");
  const watchedStatus = watch("status");

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

  const onSubmit = async (data: CreateRoomFormValues) => {
    try {
      const submissionData = new FormData();
      submissionData.append("roomTypeId", data.roomTypeId);
      submissionData.append("status", data.status);
      submissionData.append("image", data.image);

      await addRoomMutation.mutateAsync(submissionData);

      Swal.fire({
        title: "Success!",
        text: "New room has been created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-xl' }
      });
      router.push("/room");
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create room.";
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
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-emerald-500';
      case 'occupied': return 'bg-amber-500';
      case 'booked': return 'bg-amber-500';
      case 'maintenance': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Room</h1>
            <p className="text-slate-500 mt-1">Create a new room listing for your hotel.</p>
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

          {/* LEFT COLUMN: Room Information */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-2">
                  <BedDouble className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-900">Room Information</h2>
                </div>

                <div className="grid gap-6">
                  {/* Room Type */}
                  <div className="space-y-2">
                    <Label htmlFor="roomTypeId" className="text-sm font-semibold text-slate-700">
                      Room Type <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <select
                        id="roomTypeId"
                        {...register("roomTypeId")}
                        className={`w-full h-12 rounded-xl border-2 transition-all outline-none appearance-none cursor-pointer px-4 text-sm ${errors.roomTypeId ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'}`}
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
                    {errors.roomTypeId && <p className="text-xs text-rose-500 font-bold mt-1 ml-1">{errors.roomTypeId.message}</p>}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-semibold text-slate-700">
                      Initial Status <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <span className={`block w-3 h-3 rounded-full ${getStatusColor(watchedStatus)}`}></span>
                      </div>
                      <select
                        id="status"
                        {...register("status")}
                        className="w-full h-12 rounded-xl border-2 border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Room Image & Submit */}
          <div className="space-y-6 flex flex-col">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white flex-1">
              <div className="p-6 md:p-8 space-y-6 h-full flex flex-col">
                <div className="flex items-center gap-3 pb-2">
                  <ImageIcon className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-bold text-slate-900">Room Image</h2>
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
                        <p className="font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Click or drag image here</p>
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
              disabled={addRoomMutation.isPending}
              className="w-full h-14 bg-[#074868] hover:bg-[#05364d] text-white shadow-xl text-lg font-bold rounded-2xl transition-all duration-300 active:scale-[0.98]"
            >
              {addRoomMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Creating Room...
                </span>
              ) : (
                "+ Create New Room"
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}