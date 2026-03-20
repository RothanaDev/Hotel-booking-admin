"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useInventory, useUpdateInventory } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import Swal from "sweetalert2";

export default function EditInventoryPage() {
    const router = useRouter();
    const params = useParams();
    const itemId = params.id as string;

    const { data: itemData, isLoading: isFetching } = useInventory(itemId);
    const updateMutation = useUpdateInventory();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        itemName: "",
        quantity: "",
        unit: "",
    });

    useEffect(() => {
        if (itemData) {
            setFormData({
                itemName: itemData.itemName || "",
                quantity: itemData.quantity?.toString() || "",
                unit: itemData.unit || "",
            });
        }
    }, [itemData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.itemName || !formData.quantity || !formData.unit) {
            Swal.fire("Error", "Please fill in all fields", "error");
            return;
        }

        setIsLoading(true);

        try {
            await updateMutation.mutateAsync({
                id: itemId,
                data: {
                    itemName: formData.itemName,
                    quantity: parseInt(formData.quantity),
                    unit: formData.unit
                }
            });

            await Swal.fire({
                title: "Success!",
                text: "Inventory item updated successfully",
                icon: "success",
                confirmButtonColor: "#ffa500",
            });

            router.push("/inventory");
        } catch (error) {
            console.error("Error updating item:", error);
            Swal.fire("Error", "Failed to update inventory item", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-10 text-center">Loading item details...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/inventory">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-slate-200 hover:bg-slate-50 hover:text-[#074868]">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Inventory Item</h1>
                    <p className="text-slate-500">Update inventory item details</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-900">Item Details</h2>
                    <p className="text-sm text-slate-500">Make changes to the inventory item below</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="itemName" className="text-slate-700">Item Name</Label>
                                <Input
                                    id="itemName"
                                    name="itemName"
                                    placeholder="e.g. Bath Towels"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-slate-200 focus:border-[#ffa500] focus:ring-[#ffa500]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-slate-700">Quantity</Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-slate-200 focus:border-[#ffa500] focus:ring-[#ffa500]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit" className="text-slate-700">Unit</Label>
                                <Input
                                    id="unit"
                                    name="unit"
                                    placeholder="e.g. pieces, sets, liters"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-slate-200 focus:border-[#ffa500] focus:ring-[#ffa500]"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#074868] hover:bg-[#05364d] text-white px-8 h-11 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all"
                            >
                                {isLoading ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
