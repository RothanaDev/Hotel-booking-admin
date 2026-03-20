"use client";

import { useAllServices, useDeleteService } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    PlusCircle,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Utensils,
    Car,
    Sparkles,
    Shirt,
    Package
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import type { Service } from "@/types/service";

const ServicesPage = () => {
    const { data: services = [] as Service[], isLoading } = useAllServices();
    const deleteMutation = useDeleteService();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Calculate stats
    const totalServices = (services as Service[]).length;
    const averagePrice = totalServices > 0
        ? (services as Service[]).reduce((acc: number, curr: Service) => acc + (Number(curr.price) || 0), 0) / totalServices
        : 0;

    // Filtering
    const filteredServices = (services as Service[]).filter((service: Service) => {
        const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This service will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffa500",
            cancelButtonColor: "#074868",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await deleteMutation.mutateAsync(id);
                Swal.fire("Deleted!", "Service has been deleted.", "success");
            } catch {
                Swal.fire("Error!", "Failed to delete service.", "error");
            }
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'dining': return <Utensils className="w-4 h-4" />;
            case 'transport': return <Car className="w-4 h-4" />;
            case 'wellness': return <Sparkles className="w-4 h-4" />;
            case 'housekeeping': return <Shirt className="w-4 h-4" />;
            case 'water sports': return <Package className="w-4 h-4" />;
            case 'excursion': return <Package className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'dining': return 'bg-orange-100 text-orange-600';
            case 'transport': return 'bg-blue-100 text-blue-600';
            case 'wellness': return 'bg-emerald-100 text-emerald-600';
            case 'water sports': return 'bg-purple-100 text-purple-600';
             case 'excursion': return 'bg-purple-100 text-purple-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };


    if (isLoading) return <div className="p-10 text-center">Loading services...</div>;

    return (
        <div className="space-y-8 min-h-screen bg-slate-50/50 p-4">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service Management</h1>
                    <p className="text-slate-500 mt-1">Manage hotel services and amenities</p>
                </div>
                <Link href="/service/create">
                    <Button className="bg-[#074868] hover:bg-[#05364d] text-white shadow-lg shadow-blue-900/20 px-6 h-11 rounded-xl transition-all duration-300 font-semibold">
                        <PlusCircle className="mr-2 h-5 w-5" /> Add New Service
                    </Button>
                </Link>
            </div>

            {/* Stats Cards - Mocked data as per screenshot inspiration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Total Services</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalServices}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Average Price</p>
                    <h3 className="text-3xl font-bold text-emerald-600 mt-2">${averagePrice.toFixed(2)}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search services..."
                        className="pl-10 h-11 border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <select
                        className="w-full h-11 pl-4 pr-10 appearance-none bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Dining">Dining</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Transport">Transport</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Water Sports">Water Sports</option>
                        <option value="Excursion">Excursion</option>
                    </select>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map((service: Service) => (
                    <div key={service.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">

                        {/* Image */}
                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                            {service.image || service.photo ? (
                                <Image
                                    src={(service.image || `data:image/jpeg;base64,${service.photo}`) as string}
                                    alt={service.serviceName}
                                    width={400}
                                    height={192}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                    <Package className="w-16 h-16" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{service.serviceName}</h3>
                                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(service.category)}`}>
                                        {getCategoryIcon(service.category)}
                                        {service.category}
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                        <DropdownMenuItem className="cursor-pointer font-medium p-2.5" asChild>
                                            <Link href={`/service/${service.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4 text-indigo-500" /> Edit Service
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer font-medium text-rose-600 focus:text-rose-600 p-2.5"
                                            onClick={() => handleDelete(service.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                {service.description}
                            </p>


                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                                <span className="text-xl font-bold text-slate-900">${service.price}</span>
                                <span className="text-xs text-slate-400 font-medium">per service</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredServices.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No services found</h3>
                        <p className="text-slate-500">Try adjusting your search filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;
