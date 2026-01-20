import { Link } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TagIcon, 
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // sesuaikan path
import { useState } from "react";


const AdminNavbar = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* MOBILE ADMIN NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-300 border-t-4 border-black shadow-[0_-4px_0_#000] sm:hidden">
        <div className="flex justify-around items-center py-2">
          <NavItem to="/admin" color="text-red-600">
            <HomeIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Dashboard
          </NavItem>

          <NavItem to="/admin/users/list" color="text-blue-600">
            <UserGroupIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Users
          </NavItem>

          <NavItem to="/admin/menu/list" color="text-green-600">
            <ClipboardDocumentListIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Menu
          </NavItem>

          <NavItem to="/admin/category/list" color="text-pink-600">
            <TagIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Kategori
          </NavItem>
          <NavItem
            color="text-black"
            asButton
            onClick={() => setShowLogoutConfirm(true)}
          >
            <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
            Logout
          </NavItem>

        </div>
      </div>

      {/* DESKTOP ADMIN NAVBAR */}
      <div className="hidden sm:flex fixed top-0 left-0 right-0 z-50 bg-red-500 border-b-4 border-black shadow-[0_4px_0_#000] px-8 py-3 justify-between items-center">
        <div className="text-2xl font-extrabold tracking-wide text-yellow-300 drop-shadow-[2px_2px_0_#000]">
          🛠️ Admin Warung Ceunah
        </div>

        <div className="flex space-x-4">
          <DesktopNav to="/admin" bg="bg-yellow-300">
            <HomeIcon className="w-5 h-5" />
            Dashboard
          </DesktopNav>

          <DesktopNav to="/admin/users/list" bg="bg-blue-300">
            <UserGroupIcon className="w-5 h-5" />
            Users
          </DesktopNav>

          <DesktopNav to="/admin/menu/list" bg="bg-green-300">
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Menu
          </DesktopNav>

          <DesktopNav to="/admin/category/list" bg="bg-pink-300">
            <TagIcon className="w-5 h-5" />
            Kategori
          </DesktopNav>

          <DesktopNav asButton 
            onClick={() => setShowLogoutConfirm(true)} bg="bg-red-300">
            <ArrowRightStartOnRectangleIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Logout
          </DesktopNav>
        </div>


      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
          <div className="bg-yellow-300 border-4 border-black
            shadow-[8px_8px_0_#000] p-6 w-[90%] max-w-sm">

            <h2 className="text-xl font-extrabold mb-2">
              ⚠️ Konfirmasi Logout
            </h2>

            <p className="font-bold mb-6">
              Kamu yakin mau keluar dari <span className="underline">Admin Panel</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-blue-400 border-2 border-black font-extrabold"
              >
                ❌ Batal
              </button>

              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-500 text-white border-2 border-black font-extrabold"
              >
                🔓 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ===== COMPONENT KECIL ===== */

const NavItem = ({ to, children, color, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center text-[10px] font-extrabold ${color}
          hover:-translate-y-1 hover:scale-110 transition-transform`}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={`flex flex-col items-center text-[10px] font-extrabold ${color}
        hover:-translate-y-1 hover:scale-110 transition-transform`}
    >
      {children}
    </Link>
  );
};


const DesktopNav = ({ to, children, bg, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${bg} px-4 py-2 border-2 border-black font-extrabold`}
      >
        {children}
      </button>
    );
  }

  return (
    <Link to={to} className={`${bg} px-4 py-2 border-2 border-black font-extrabold`}>
      {children}
    </Link>
  );
};


export default AdminNavbar;
