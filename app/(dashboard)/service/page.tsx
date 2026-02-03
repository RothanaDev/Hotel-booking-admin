
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

const staticServices = [
    { id: 1, name: "Spa & Wellness", description: "Full body massage and sauna", price: 50.00 },
    { id: 2, name: "Airport Shuttle", description: "One-way transfer to airport", price: 25.00 },
    { id: 3, name: "Laundry Service", description: "Wash and dry per 5kg", price: 15.00 },
    { id: 4, name: "Room Service", description: "24/7 food and drink delivery", price: 10.00 },
];

export default function ServicesPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-500">Manage hotel amenities and additional services.</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Service Name</TableHead>
                            <TableHead className="font-semibold">Description</TableHead>
                            <TableHead className="font-semibold text-right">Price</TableHead>
                            <TableHead className="font-semibold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staticServices.map((service) => (
                            <TableRow key={service.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-gray-500">#{service.id.toString().padStart(3, '0')}</TableCell>
                                <TableCell className="font-semibold text-gray-900">{service.name}</TableCell>
                                <TableCell className="text-gray-500">{service.description}</TableCell>
                                <TableCell className="text-right font-bold text-teal-600">${service.price.toFixed(2)}</TableCell>
                                <TableCell className="flex justify-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
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
