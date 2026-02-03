export const setUserStorage = (user: any) => {
  if (typeof window === "undefined") return

  // Create a safe user object without tokens for general storage
  const safeUser = {
    id: user.id || user.userId || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  localStorage.setItem("currentUser", JSON.stringify(safeUser))
  localStorage.setItem("role", user.role || "")

  if (user.accessToken) {
    localStorage.setItem("accessToken", user.accessToken)
    document.cookie = `token=${user.accessToken}; path=/; max-age=86400; SameSite=Strict`
  }

  if (user.refreshToken) {
    localStorage.setItem("refreshToken", user.refreshToken)
  }
}
// export const setUserStorage = (user: any) => {
//   if (typeof window === 'undefined') return;

//   const safeUser = {
//     id: user.id ?? user.userId ?? user._id,
//     name: user.name ?? null,      // optional
//     email: user.email ?? null,    // optional
//     role: user.role ?? null,
//   };

//   localStorage.setItem('currentUser', JSON.stringify(safeUser));

//   if (user.token) {
//     localStorage.setItem('token', user.token);
//     document.cookie = `token=${user.token}; path=/; max-age=86400; SameSite=Strict`;
//   }
// };


export const clearUserStorage = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("role")
  localStorage.removeItem("token") // for backward compatibility
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token")
  return !!token
}

export const getAccessToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("accessToken") || localStorage.getItem("token")
}

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("refreshToken")
}

export const getUserFromStorage = () => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

export const getUserId = () => {
  const user = getUserFromStorage()
  console.log("User from getUserId:", user)

  if (!user) return null
  return user.id || user.userId || user._id || null
}