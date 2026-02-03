"use client";
import { Bell, Menu, User, Settings, LogOut, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "../ui/input";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user: currentUser, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ... (getInitials, getDisplayName, getDisplayEmail, handleLogout, useEffect remain same)

  const getInitials = (user: any) => {
    if (!user) return "U";
    const name = user.name || user.email || "";

    if (name.includes(" ")) {
      const names = name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
    }

    if (name && name.length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }

    return "U";
  };

  const getDisplayName = (user: any) => {
    if (!user) return "Guest";
    return user.name || user.email?.split('@')[0] || "Guest";
  };

  const getDisplayEmail = (user: any) => {
    return user?.email || "";
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <Input
                placeholder="Search everything..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 transition-colors"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>

            {/* User Profile Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-sm font-semibold text-white">
                    {getInitials(currentUser)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {getDisplayName(currentUser)}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </Button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200 transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {getDisplayName(currentUser)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getDisplayEmail(currentUser)}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/dashboard/profile");
                      }}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/dashboard/settings");
                      }}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
