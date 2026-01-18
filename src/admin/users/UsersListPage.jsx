import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import EditUserPage from "./EditUserPage";
import DeletePopup from "../DeletePopup";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    email: "",
    password: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus user ini?")) return;
    await supabase.from("users").delete().eq("id", id);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-yellow-200 p-6">
      {/* HEADER */}
      <div className="mb-6 bg-purple-400 border-4 border-black shadow-[6px_6px_0_#000] p-4 text-center">
        <h1 className="text-3xl font-extrabold text-black drop-shadow-[2px_2px_0_#fff]">
          👤 User Management
        </h1>
        <p className="font-bold text-black">
          Kelola data user Warung Ceunah
        </p>
      </div>

      <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-400 px-4 py-2 border-4 border-black font-extrabold
              shadow-[4px_4px_0_#000] hover:-translate-y-1 transition"
          >
            ➕ ADD USER
          </button>
        </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border-4 border-black shadow-[6px_6px_0_#000]">
        <table className="w-full border-collapse">
          <thead className="bg-green-300 border-b-4 border-black">
            <tr className="text-black text-sm">
              <th className="p-3 border-r-4 border-black">No</th>
              <th className="p-3 border-r-4 border-black">Email</th>
              <th className="p-3 border-r-4 border-black">Created At</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="p-6 text-center font-bold">
                  ⏳ Loading users...
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center font-bold">
                  ❌ User belum ada
                </td>
              </tr>
            )}

            {users.map((user, index) => (
              <tr
                key={user.id}
                className="bg-yellow-100 hover:bg-pink-200 transition border-b-4 border-black text-sm"
              >
                <td className="p-3 text-center font-bold border-r-4 border-black">
                  {index + 1}
                </td>

                <td className="p-3 font-bold border-r-4 border-black">
                  {user.email}
                </td>

                <td className="p-3 border-r-4 border-black">
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-400 px-3 py-1 border-2 border-black font-bold
                      shadow-[2px_2px_0_#000] hover:-translate-y-1 transition"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => {
                        setSelectedUser(user);
                        setShowDelete(true);
                    }}
                    className="bg-red-400 px-3 py-1 border-2 border-black font-bold
                        shadow-[2px_2px_0_#000] hover:-translate-y-1 transition"
                    >
                    🗑 Delete
                    </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT */}
      {showModal && (
        <EditUserPage
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {showDelete && (
        <DeletePopup
            title="Hapus User?"
            message={`User dengan email "${selectedUser.email}" akan dihapus permanen!`}
            onCancel={() => setShowDelete(false)}
            onConfirm={async () => {
            await supabase
                .from("users")
                .delete()
                .eq("id", selectedUser.id);

            setShowDelete(false);
            setSelectedUser(null);
            fetchUsers();
            }}
        />
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);

                const { error } = await supabase
                  .from("users")
                  .insert({
                    email: addForm.email,
                    password: addForm.password,
                  });

                if (error) {
                  alert(error.message);
                  setIsAdding(false);
                  return;
                }

                setAddForm({ email: "", password: "" });
                setShowAddModal(false);
                setIsAdding(false);
                fetchUsers();
              }}
              className="relative bg-yellow-200 border-4 border-black
                shadow-[6px_6px_0_#000] p-6 w-full max-w-md"
            >
              {/* CLOSE */}
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="absolute top-3 right-3 bg-red-500 text-white
                  font-bold px-3 py-1 border-2 border-black"
              >
                ✖
              </button>

              <h2 className="text-2xl font-extrabold mb-4">
                ➕ Tambah User
              </h2>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border-4 border-black font-bold"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm({ ...addForm, email: e.target.value })
                  }
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border-4 border-black font-bold"
                  value={addForm.password}
                  onChange={(e) =>
                    setAddForm({ ...addForm, password: e.target.value })
                  }
                  required
                />
              </div>

              <button
                disabled={isAdding}
                className="mt-6 w-full bg-green-400 px-6 py-3
                  border-4 border-black font-extrabold
                  shadow-[4px_4px_0_#000]
                  hover:-translate-y-1 transition disabled:opacity-50"
              >
                {isAdding ? "⏳ MENYIMPAN..." : "SIMPAN USER"}
              </button>
            </form>
          </div>
        )}

    </div>
  );
};

export default UserListPage;
