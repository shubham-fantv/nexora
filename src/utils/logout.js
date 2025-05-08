import cookie from "js-cookie";

export default function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userEmailID");
    localStorage.removeItem("userNumber");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("aToken");
    localStorage.clear();
    cookie.remove("aToken");
    cookie.remove("token");
    window.location.href = "/";
    return true;
  }
  return false;
}
