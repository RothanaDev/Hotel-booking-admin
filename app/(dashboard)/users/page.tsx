
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, ShieldCheck } from "lucide-react";

const staticUsers = [
    { id: 1, name: "Rothana", email: "rothana@gmail.com", phone: "0883020881", role: "ADMIN" },
    { id: 2, name: "Bunath", email: "bunath@gmail.com", phone: "0987654321", role: "MANAGER" },
    { id: 3, name: "Vireak", email: "vireak@gmail.com", phone: "0123456789", role: "RECEPTIONIST" },
    { id: 4, name: "Sokha", email: "sokha@gmail.com", phone: "099888777", role: "USER" },
];

export default function UsersPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage staff and customer accounts.</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    Invite User
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold">User</TableHead>
                            <TableHead className="font-semibold">Contact Details</TableHead>
                            <TableHead className="font-semibold text-center">Role</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staticUsers.map((u) => (
                            <TableRow key={u.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{u.name}</p>
                                            <p className="text-xs text-gray-400">ID: USER-{u.id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="h-3 w-3" /> {u.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-3 w-3" /> {u.phone}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={
                                            u.role === "ADMIN" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" :
                                                u.role === "MANAGER" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                                    u.role === "RECEPTIONIST" ? "bg-teal-100 text-teal-700 hover:bg-teal-100" :
                                                        "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                        }
                                    >
                                        {u.role === "ADMIN" && <ShieldCheck className="h-3 w-3 mr-1" />}
                                        {u.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">
                                        Manage
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
