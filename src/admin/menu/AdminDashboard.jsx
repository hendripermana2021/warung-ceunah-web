import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [totalMenu, setTotalMenu] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [latestMenus, setLatestMenus] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: menuCount } = await supabase
      .from("menu")
      .select("*", { count: "exact", head: true });

    const { count: userCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: categoryCount } = await supabase
      .from("category_food")
      .select("*", { count: "exact", head: true });

    const { data: menus } = await supabase
      .from("menu")
      .select("id, name_menu, price")
      .order("created_at", { ascending: false })
      .limit(5);

    setTotalMenu(menuCount || 0);
    setTotalUsers(userCount || 0);
    setTotalCategories(categoryCount || 0);
    setLatestMenus(menus || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 sm:mt-20 md:mt-10 lg:pt-10 p-6">
      {/* HEADER */}
      <div className="mb-8 bg-red-500 border-4 border-black shadow-[6px_6px_0_#000] p-6 text-center">
        <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-[2px_2px_0_#000]">
          🛠️ Admin Dashboard
        </h1>
        <p className="font-bold text-black mt-2">
          Warung Ceunah – Retro Full Colour
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="🍜 Total Menu"
          value={totalMenu}
          bg="bg-yellow-200"
        />
        <StatCard
          title="👥 Users"
          value={totalUsers}
          bg="bg-blue-200"
        />
        <StatCard
          title="🏷️ Categories"
          value={totalCategories}
          bg="bg-pink-200"
        />
      </div>

      {/* RECENT MENU */}
      <div className="bg-yellow-100 border-4 border-black shadow-[6px_6px_0_#000] p-6">
        <h2 className="text-2xl font-extrabold mb-4">
          🆕 Menu Terbaru
        </h2>

        {latestMenus.length === 0 && (
          <p className="font-bold">Belum ada menu</p>
        )}

        <ul className="space-y-3">
          {latestMenus.map((menu) => (
            <li
              key={menu.id}
              className="flex justify-between items-center bg-white border-2 border-black px-4 py-2 font-bold shadow-[3px_3px_0_#000]"
            >
              <span>{menu.name_menu}</span>
              <span>Rp {menu.price?.toLocaleString("id-ID")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ===== COMPONENT KECIL ===== */

const StatCard = ({ title, value, bg }) => (
  <div
    className={`${bg} border-4 border-black shadow-[6px_6px_0_#000] p-6 text-center`}
  >
    <h3 className="text-xl font-extrabold mb-2">{title}</h3>
    <p className="text-4xl font-black">{value}</p>
  </div>
);

const ActionButton = ({ to, children, color }) => (
  <Link
    to={to}
    className={`${color} px-6 py-3 border-4 border-black font-extrabold
      shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]
      transition-all`}
  >
    {children}
  </Link>
);

export default AdminDashboard;