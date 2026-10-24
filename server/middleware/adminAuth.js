export default function ({ redirect, route, app }) {
    const userRole = app.$cookies.get("role") || localStorage.getItem("role");
    if (!userRole || userRole.toLowerCase() !== "admin") {
      // redirect โดยไม่แสดงเนื้อหาของหน้า admin
      return redirect("/login");
    }
  }

  