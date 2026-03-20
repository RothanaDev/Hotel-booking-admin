"use client";

import { useAllInventory, useDeleteInventory } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    PlusCircle,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Package,
    AlertTriangle,
    Box
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

const InventoryPage = () => {
    const { data: inventoryItems = [], isLoading } = useAllInventory();
    const deleteMutation = useDeleteInventory();
    const [searchTerm, setSearchTerm] = useState("");

    // Calculate stats
    const totalItems = inventoryItems.length;
    const totalStock = inventoryItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
    const lowStockThreshold = 50; // Mock threshold
    const lowStockItems = inventoryItems.filter((item: any) => (item.quantity || 0) < lowStockThreshold).length;

    // Filter items
    const filteredItems = inventoryItems.filter((item: any) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This item will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffa500",
            cancelButtonColor: "#074868",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await deleteMutation.mutateAsync(id);
                Swal.fire("Deleted!", "Item has been deleted.", "success");
            } catch (error) {
                Swal.fire("Error!", "Failed to delete item.", "error");
            }
        }
    };

    const getStockLevelPercentage = (quantity: number, minStock: number) => {
        const percentage = (quantity / (minStock * 2)) * 100; // Assuming max is 2x min for visualization
        return Math.min(percentage, 100);
    };

    if (isLoading) return <div className="p-10 text-center">Loading inventory...</div>;

    return (
        <div className="space-y-8 min-h-screen bg-slate-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory</h1>
                    <p className="text-slate-500 mt-1">Track and manage hotel supplies</p>
                </div>
                <Link href="/inventory/create">
                    <Button className="bg-[#0a101f] hover:bg-[#1a2235] text-white shadow-lg shadow-blue-900/20 px-6 h-11 rounded-xl transition-all duration-300 font-semibold">
                        <PlusCircle className="mr-2 h-5 w-5" /> Add Item
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Box className="w-5 h-5 text-slate-400" />
                            <p className="text-slate-500 text-sm font-medium">Total Items</p>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">{totalItems}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-5 h-5 text-blue-400" />
                            <p className="text-slate-500 text-sm font-medium">Total Stock</p>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">{totalStock.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                            <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
                        </div>
                        <h3 className="text-3xl font-bold text-rose-600">{lowStockItems}</h3>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search inventory..."
                    className="pl-10 h-11 border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Min Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Stock Level</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredItems.map((item: any) => {
                                const minStock = 50; // Mock value
                                const stockLevelPct = getStockLevelPercentage(item.quantity, minStock);
                                const isLowStock = item.quantity < minStock;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <Box className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-slate-900">{item.itemName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-slate-900">{item.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-slate-500">{item.unit}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-slate-500">{minStock}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${isLowStock ? 'bg-orange-400' : 'bg-[#0a101f]'}`}
                                                    style={{ width: `${stockLevelPct}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isLowStock ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {isLowStock ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                    <DropdownMenuItem className="cursor-pointer font-medium p-2.5" asChild>
                                                        <Link href={`/inventory/${item.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4 text-indigo-500" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer font-medium text-rose-600 focus:text-rose-600 p-2.5"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No items found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
