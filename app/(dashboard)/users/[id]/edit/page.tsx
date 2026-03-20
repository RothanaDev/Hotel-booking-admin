"use client";

import { use } from "react";
import { useUser } from "@/hooks/use-queries";
import { Loader2, ArrowLeft, User, Mail, Shield, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, isLoading } = useUser(id);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#074868]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">User not found</h2>
        <p className="text-slate-500 mt-2">The user with ID {id} could not be found.</p>
        <Link href="/users">
          <Button className="mt-6 bg-[#074868]">Back to Users</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit User</h1>
            <p className="text-slate-500">Updating profile for {user.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPen className="h-5 w-5 text-[#074868]" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <div className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                      {user.name}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <div className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 italic text-sm text-slate-500">
               Full edit functionality is coming soon. Currently displaying profile information.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#074868]" />
              Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Role</label>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold uppercase tracking-wider">
                {user.role || 'USER'}
              </span>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">User ID</label>
              <code className="text-xs bg-slate-50 p-2 block rounded border border-slate-200 text-slate-600">
                {user.id}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
