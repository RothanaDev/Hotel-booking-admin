
"use client";

import * as api from "@/lib/api";

type SafeUser = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
};
export const setUserStorage = (user: SafeUser) => {
  if (typeof window === "undefined") return;

  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  localStorage.setItem("currentUser", JSON.stringify(safeUser));
  if (safeUser.role) localStorage.setItem("role", safeUser.role);

  // Set a non-http-only cookie so proxy.ts knows the user is logged in
  document.cookie = "is_logged_in=1; path=/; max-age=604800"; // 7 days
};

export const clearUserStorage = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("currentUser");
  localStorage.removeItem("role");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const isAuthenticated = async () => {
  try {
    const me = await api.getMe();
    return !!me;
  } catch {
    return false;
  }
};

export const getUserFromStorage = () => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
};

export const getUserId = () => {
  const user = getUserFromStorage();
  if (!user) return null;
  return user.id || null;
};

export const logout = async () => {
  try {
    await api.logoutUser();
  } finally {
    clearUserStorage();
    if (typeof window !== "undefined") window.location.href = "/login";
  }
};