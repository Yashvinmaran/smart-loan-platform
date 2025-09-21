export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRoleFromToken() {
  const t = getToken();
  if (!t) return null;
  const payload = parseJwt(t);
  console.log(payload.role);
  return payload?.role || null; // may be absent if backend doesn't embed it
}

export function isAuthenticated() {
  const t = getToken();
  if (!t) return false;
  const payload = parseJwt(t);
  if (!payload) return false;
  // exp is in seconds
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    localStorage.removeItem("token");
    return false;
  }
  return true;
}

export function getUserFromToken() {
  const t = getToken();
  if (!t) return null;
  const payload = parseJwt(t);
  if (!payload) return null;
  return {
    name: payload.name || payload.username || payload.email || "User",
    email: payload.email || "",
    role: payload.role || "USER"
  };
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
