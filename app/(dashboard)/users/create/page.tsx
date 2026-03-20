"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegisterUser } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, Loader2, User, Mail, Phone } from "lucide-react";
import Swal from "sweetalert2";

export default function CreateUserPage() {
  const router = useRouter();
  const registerMutation = useRegisterUser();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      await registerMutation.mutateAsync({
        ...formData,
        password: "Temp@123456",
        role: "GUEST",
      });

      await Swal.fire({
        title: "Success!",
        text: "User created successfully",
        icon: "success",
        confirmButtonColor: "#0d9488",
      });

      router.push("/users");
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create user";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl bg-white border-slate-200 hover:bg-slate-50 hover:text-teal-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New User</h1>
          <p className="text-sm text-slate-500">
            Add user info (name, email, phone)
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Card Title */}
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">User Information</h2>
                <p className="text-xs text-slate-500">
                  Fields marked * are required
                </p>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="p-8 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-700 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-400" /> Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Email + Phone (two columns) */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-slate-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+1 234 567 890"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/40">
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 h-11 rounded-xl font-semibold px-10 flex items-center gap-2 shadow-md shadow-teal-900/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Create
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-slate-400 mt-3">
              Default password is set automatically.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}