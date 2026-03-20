"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAllUsers, useDeleteUser } from "@/hooks/use-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Loader2,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import Swal from "sweetalert2";

export default function UsersPage() {
  const { data: users = [], isLoading } = useAllUsers();
  const deleteMutation = useDeleteUser();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const total = users.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page]);

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const handleDelete = async (userId: string, userName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${userName}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(userId);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="p-2 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage user accounts.</p>
        </div>

        <Link href="/users/create">
          <Button className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create User
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedUsers.map((u: any) => (
              <TableRow
                key={u.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-semibold text-gray-900">
                  {u.name || "Unknown"}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" /> {u.email}
                  </div>
                </TableCell>

                <TableCell>
                  {u.phoneNumber ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" /> {u.phoneNumber}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    {/* Edit */}
                    <Link href={`/users/edit/${u.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(u.id, u.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-slate-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{startItem}</span>–{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{total}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>

              <span className="text-sm text-gray-600">
                Page {page} / {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}