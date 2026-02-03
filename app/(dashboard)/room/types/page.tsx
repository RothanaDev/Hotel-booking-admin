
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Info } from "lucide-react";

const staticRoomTypes = [
    { id: 1, name: "King Exclusive", price: 150.00, occupancy: "2 Adults", description: "Luxury king size bed with city view." },
    { id: 2, name: "Double Deluxe", price: 120.00, occupancy: "2 Adults, 1 Child", description: "Two separate beds with garden view." },
    { id: 3, name: "Suite", price: 350.00, occupancy: "4 Adults", description: "Large apartment style with kitchen." },
    { id: 4, name: "Single Standard", price: 85.00, occupancy: "1 Adult", description: "Compact and cozy for solo travelers." },
];

export default function RoomTypesPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Room Types</h1>
                    <p className="text-gray-500">Configure distinct room categories and pricing tiers.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Create Category
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50 border-b border-gray-100">
                            <TableRow>
                                <TableHead className="font-bold py-4">Category Name</TableHead>
                                <TableHead className="font-bold">Occupancy</TableHead>
                                <TableHead className="font-bold text-right">Base Price</TableHead>
                                <TableHead className="font-bold text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staticRoomTypes.map((type) => (
                                <TableRow key={type.id} className="hover:bg-indigo-50/30 transition-colors">
                                    <TableCell className="py-4">
                                        <span className="font-bold text-gray-900 block">{type.name}</span>
                                        <span className="text-xs text-gray-400 line-clamp-1">{type.description}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-white border-gray-200 text-gray-500">
                                            {type.occupancy}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-indigo-600">
                                        ${type.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 border-dashed flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-500 mb-4">
                        <Info className="h-8 w-8 line-4" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2">Pricing Logic</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Base prices defined here serve as the default for all rooms assigned to that category.
                        You can override specific room prices in the Directory.
                    </p>
                </div>
            </div>
        </div>
    );
}
