// layout/MobileLayout.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "../components/NavbarAdmin";

const AdminLayout = () => {
  
  const [open, setOpen] = useState(false);
  return (
    
    <div className="relative min-h-screen bg-linear-to-b from-orange-100 via-orange-200 to-yellow-100 overflow-x-hidden">

      {/* Konten page */}
      <div className="relative z-10 max-w-3xl mx-auto p-4 space-y-8 sm:mb-20 sm:mt-10">
        <Outlet />
      </div>

      {/* Footer & Mobile Navbar */}
      <AdminNavbar />
    </div>
  );
};

export default AdminLayout;

