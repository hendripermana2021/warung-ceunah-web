import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";
import EditMenuPage from "./EditMenuPage";
import DeletePopup from "../DeletePopup";

const MenuListPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [category, setCategory] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false)
  
  
  const [form, setForm] = useState(null)

    const openEditModal = (menu) => {
    setEditForm({
      id: menu.id,
      name_menu: menu.name_menu,
      price: menu.price,
      category_id: menu.category_id,
    });

    setEditImages(
      menu.image_food.map((img) => ({
        id: img.id,               // ⬅️ WAJIB
        img_path: img.img_path,   // ⬅️ WAJIB
        preview: getImageUrl(img.img_path),
        isDeleted: false,
        file: null,
      }))
    );

    setIsEditModalOpen(true);
  };


  const fetchCategories = async () => {
    const { data } = await supabase
      .from("category_food")
      .select("*");

    setCategory(data || []);
    
      if (data?.length) {
      setForm((prev) => ({
        ...prev,
        category_id: data[0].id,
      }));
    }
  };

  const fetchMenus = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("menu")
      .select(`
        id,
        name_menu,
        price,
        category_food (
          id,
          name_category
        ),
        image_food (
          id,
          img_path
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setMenus(data || []);
    }

    setLoading(false);
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    return supabase.storage
      .from("food-images")
      .getPublicUrl(path).data.publicUrl;
  };



  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditSubmitting(true);

    try {
      // 1️⃣ UPDATE MENU
      await supabase
        .from("menu")
        .update({
          name_menu: editForm.name_menu,
          price: editForm.price,
          category_id: editForm.category_id,
        })
        .eq("id", editForm.id);

      // ===============================
      // 2️⃣ DELETE IMAGE (DB + STORAGE)
      // ===============================
      const imagesToDelete = editImages.filter(
        (img) => img.id && img.isDeleted
      );

      for (const img of imagesToDelete) {
        console.log("DELETE IMAGE:", img.img_path);

        // STORAGE
        const { error: storageErr } = await supabase.storage
          .from("food-images")
          .remove([img.img_path]);

        if (storageErr) {
          console.error("STORAGE DELETE ERROR:", storageErr.message);
        }

        // DB
        const { error: dbErr } = await supabase
          .from("image_food")
          .delete()
          .eq("id", img.id);

        if (dbErr) {
          console.error("DB DELETE ERROR:", dbErr.message);
        }
      }

      // ===============================
      // 3️⃣ UPLOAD / REPLACE IMAGE
      // ===============================
      for (const img of editImages) {

        console.log("EDIT IMAGES:", editImages);
        if (!img.file) continue;

        const path = `menu/${editForm.id}/${Date.now()}-${img.file.name}`;

        await supabase.storage
          .from("food-images")
          .upload(path, img.file, { upsert: true });

        await supabase.from("image_food").insert({
          id_menu: editForm.id,
          img_path: path,
        });
      }

      fetchMenus();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal update menu");
    } finally {
      setIsEditSubmitting(false);
    }
  };


  console.log("Menus:", menus);

  const deleteMenu = async (id) => {
    if (!confirm("Yakin mau hapus menu ini?")) return;

    await supabase.from("menu").delete().eq("id", id);
    fetchMenus();
  };

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

return (
  <div className="min-h-screen bg-yellow-200 p-6">
    {/* Header */}
    <div className="mb-6 bg-red-500 border-4 border-black shadow-[6px_6px_0_#000] p-4 text-center">
      <h1 className="text-3xl font-extrabold text-yellow-300 drop-shadow-[2px_2px_0_#000]">
        🍜 Admin Menu – Warung Ceunah
      </h1>
      <p className="text-black font-bold">
        Kelola menu makanan & minuman
      </p>
    </div>

    {/* Toolbar */}
    <div className="flex justify-end mb-4">
      <Link to="/admin/menu/add">
        <button
          className="
            bg-green-400
            px-5 py-2
            border-4 border-black
            font-extrabold
            shadow-[4px_4px_0_#000]
            hover:-translate-y-1
            hover:shadow-[6px_6px_0_#000]
            transition-all
          "
        >
          ➕ ADD MENU
        </button>
      </Link>
    </div>

    {/* Table */}
    <div className="overflow-x-auto bg-white border-4 border-black shadow-[6px_6px_0_#000]">
      <table className="w-full border-collapse">
        <thead className="bg-blue-300 border-b-4 border-black">
          <tr className="text-black text-sm">
            <th className="p-3 border-r-4 border-black">No</th>
            <th className="p-3 border-r-4 border-black">Image</th>
            <th className="p-3 border-r-4 border-black">Nama Menu</th>
            <th className="p-3 border-r-4 border-black">Harga</th>
            <th className="p-3 border-r-4 border-black">Kategori</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="p-6 text-center font-bold">
                ⏳ Loading menu...
              </td>
            </tr>
          )}

          {!loading && menus.length === 0 && (
            <tr>
              <td colSpan="5" className="p-6 text-center font-bold">
                ❌ Belum ada menu
              </td>
            </tr>
          )}

          {menus.map((menu, index) => (
            <tr
              key={menu.id}
              className="bg-yellow-100 hover:bg-pink-200 transition border-b-4 border-black text-sm"
            >
              <td className="p-3 text-center font-bold border-r-4 border-black">
                {index + 1}
              </td>

              <td className="p-3 border-r-4 border-black max-w-55">
                <div className="overflow-x-auto">
                  <div className="flex gap-2 w-max">
                    {menu.image_food?.length > 0 ? (
                      menu.image_food.map((img, idx) => (
                        <img
                          key={idx}
                          src={getImageUrl(img.img_path)}
                          alt={menu.name_menu}
                          onClick={() => {
                            setPreviewImage(getImageUrl(img.img_path));
                            setZoom(1);
                          }}
                          className="
                            w-24 h-24 shrink-0 object-cover cursor-pointer
                            border-4 border-black
                            shadow-[3px_3px_0_#000]
                            hover:-translate-y-1 hover:shadow-[5px_5px_0_#000]
                            transition
                          "
                        />
                      ))
                    ) : (
                      <div
                        className="
                          w-24 h-24 shrink-0 bg-gray-200
                          border-4 border-black
                          flex items-center justify-center
                          font-bold text-[10px]
                        "
                      >
                        NO IMAGE
                      </div>
                    )}
                  </div>
                </div>
              </td>



              <td className="p-3 font-bold border-r-4 border-black">
                {menu.name_menu}
              </td>

              <td className="p-3 border-r-4 border-black">
                Rp {menu.price?.toLocaleString("id-ID")}
              </td>

              <td className="p-3 border-r-4 border-black">
                {menu.category_food?.name_category || "-"}
              </td>

              <td className="p-3 flex gap-2 justify-center">
                {/* Update */}
                <button
                  onClick={() => {
                    setSelectedMenu(menu);
                    openEditModal(menu);
                  }}
                  className="
                    bg-blue-400
                    text-black
                    font-bold
                    px-3 py-1
                    border-2 border-black
                    shadow-[2px_2px_0_#000]
                    transition-all duration-150
                    hover:bg-blue-500
                    hover:-translate-y-1
                    hover:shadow-[4px_4px_0_#000]
                    active:translate-y-0
                    active:shadow-[1px_1px_0_#000]
                  "
                >
                  ✏️ Update
                </button>
                {/* Delete */}
                <button
                  onClick={() => {
                    setSelectedMenu(menu);
                    setShowDelete(true);
                  }}
                  className="
                    bg-red-500
                    text-white
                    font-bold
                    px-3 py-1
                    border-2 border-black
                    shadow-[2px_2px_0_#000]
                    transition-all duration-150
                    hover:bg-red-600
                    hover:-translate-y-1
                    hover:shadow-[4px_4px_0_#000]
                    active:translate-y-0
                    active:shadow-[1px_1px_0_#000]
                  "
                >
                  🗑 Hapus
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

          {/* EDIT MODAL */}
     {isEditModalOpen && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <form
          onSubmit={handleEditSubmit}
          className="relative bg-yellow-200 border-4 border-black shadow-[6px_6px_0_#000] p-6 w-full max-w-xl"
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 border-2 border-black"
          >
            ✖
          </button>

          <h2 className="text-2xl font-extrabold mb-4">✏️ Edit Menu</h2>

          {/* 🖼 IMAGE EDITOR */}
          <div className="mb-4">
            <h3 className="font-extrabold mb-2">🖼 Images</h3>

            <div className="grid grid-cols-3 gap-3">
              {editImages.map((img, idx) =>
                img.isDeleted ? null : (
                  <div
                    key={idx}
                    className="relative border-4 border-black shadow-[3px_3px_0_#000]"
                  >
                    <img
                      src={img.preview}
                      className="w-full h-28 object-cover"
                    />

                    {/* GANTI IMAGE */}
                    <label className="absolute bottom-1 left-1 bg-blue-400 text-xs font-bold px-2 py-1 border-2 border-black cursor-pointer">
                      Ganti
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const updated = [...editImages];
                          updated[idx] = {
                            ...updated[idx],
                            file,
                            preview: URL.createObjectURL(file),
                          };
                          setEditImages(updated);
                        }}
                      />
                    </label>

                    {/* HAPUS */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...editImages];
                        updated[idx].isDeleted = true;
                        setEditImages(updated);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 border-2 border-black"
                    >
                      ✖
                    </button>
                  </div>
                )
              )}

              {/* ADD IMAGE */}
              <label className="border-4 border-dashed border-black h-28 flex items-center justify-center font-bold cursor-pointer">
                + ADD
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setEditImages([
                      ...editImages,
                      {
                        file,
                        preview: URL.createObjectURL(file),
                      },
                    ]);
                  }}
                />
              </label>
            </div>
          </div>

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="p-3 border-4 border-black font-bold"
              value={editForm.name_menu}
              onChange={(e) =>
                setEditForm({ ...editForm, name_menu: e.target.value })
              }
              required
            />

            <input
              type="number"
              className="p-3 border-4 border-black font-bold"
              value={editForm.price}
              onChange={(e) =>
                setEditForm({ ...editForm, price: e.target.value })
              }
              required
            />

            <select
              className="p-3 border-4 border-black font-bold"
              value={editForm.category_id}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  category_id: Number(e.target.value),
                })
              }
            >
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_category}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={isEditSubmitting}
            className="mt-6 bg-blue-400 px-6 py-3 border-4 border-black font-extrabold shadow-[4px_4px_0_#000]"
          >
            UPDATE MENU
          </button>
        </form>
      </div>
    )}

     {showDelete && (
              <DeletePopup
                  title="Hapus Menu?"
                  message={`Menu dengan nama "${selectedMenu.name_menu}" akan dihapus permanen!`}
                  onCancel={() => setShowDelete(false)}
                  onConfirm={async () => {
                  await supabase
                      .from("menu")
                      .delete()
                      .eq("id", selectedMenu.id);

                  setShowDelete(false);
                  setSelectedMenu(null);
                  fetchMenus();
                  }}
              />
          )}


      {previewImage && (
          <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
            
            {/* CLOSE */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-6 right-6 bg-red-500 text-white
                px-3 py-1 font-extrabold border-4 border-black
                shadow-[3px_3px_0_#000]"
            >
              ✖
            </button>

            {/* IMAGE CONTAINER */}
            <div className="bg-yellow-300 border-4 border-black
              shadow-[6px_6px_0_#000] p-4 max-w-[90vw] max-h-[90vh] overflow-hidden">

              <img
                src={previewImage}
                style={{ transform: `scale(${zoom})` }}
                className="max-w-full max-h-[70vh] object-contain transition-transform"
              />

              {/* ZOOM CONTROL */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
                  className="bg-blue-400 px-4 py-2 font-extrabold
                    border-4 border-black shadow-[3px_3px_0_#000]"
                >
                  ➖ Zoom Out
                </button>

                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                  className="bg-green-400 px-4 py-2 font-extrabold
                    border-4 border-black shadow-[3px_3px_0_#000]"
                >
                  ➕ Zoom In
                </button>
              </div>
            </div>
          </div>
        )}
  </div>
);

};

export default MenuListPage;
