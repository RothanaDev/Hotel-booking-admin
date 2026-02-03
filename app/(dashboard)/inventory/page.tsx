
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, ArrowUpRight } from "lucide-react";

const staticInventory = [
    { id: 1, item: "Bath Towels", quantity: 150, unit: "pcs", threshold: 40, status: "In Stock" },
    { id: 2, item: "Bed Sheets (King)", quantity: 12, unit: "sets", threshold: 20, status: "Low Stock" },
    { id: 3, item: "Shampoo Bottles", quantity: 500, unit: "units", threshold: 100, status: "In Stock" },
    { id: 4, item: "Mini-bar Snacks", quantity: 5, unit: "boxes", threshold: 15, status: "Out of Stock" },
];

export default function InventoryPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-gray-500">Track supplies and hotel assets.</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    Order Supplies
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold">Item Name</TableHead>
                            <TableHead className="font-semibold">Current Stock</TableHead>
                            <TableHead className="font-semibold">Unit</TableHead>
                            <TableHead className="font-semibold">Min. Threshold</TableHead>
                            <TableHead className="font-semibold text-center">Status</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staticInventory.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-semibold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        {item.item}
                                    </div>
                                </TableCell>
                                <TableCell className={item.quantity <= item.threshold ? "text-red-600 font-bold" : "text-gray-700 font-medium"}>
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="text-gray-500">{item.unit}</TableCell>
                                <TableCell className="text-gray-400 italic">{item.threshold}</TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={
                                            item.status === "In Stock" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                                item.status === "Low Stock" ? "bg-orange-100 text-orange-700 hover:bg-orange-100" :
                                                    "bg-red-100 text-red-700 hover:bg-red-100"
                                        }
                                    >
                                        {item.status === "Out of Stock" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                                        Restock
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
