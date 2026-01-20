import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import DeletePopup from "../DeletePopup";
import { Link } from "react-router-dom";

const AddMenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [editImages, setEditImages] = useState([]); 
  const [form, setForm] = useState({
    name_menu: "",
    price: "",
    category_id: "",
    image: "",
  });
  const [editForm, setEditForm] = useState({
    id: null,
    name_menu: "",
    price: "",
    category_id: null,
    image: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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





  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    const { data } = await supabase
      .from("menu")
      .select(`
        *,
        category_food (
          id,
          name_category
        )
        image_food ( id, img_path )
      `)
      .order("created_at", { ascending: false });

    setMenus(data || []);
  };

    const getImageUrl = (path) => {
      return supabase.storage
        .from("food-images")
        .getPublicUrl(path).data.publicUrl;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.category_id) {
      alert("❌ Kategori wajib dipilih");
      setIsSubmitting(false);
      return;
    }

    // 1️⃣ INSERT MENU
    const { data: menuData, error: menuError } = await supabase
      .from("menu")
      .insert([{
        name_menu: form.name_menu,
        price: form.price,
        category_id: form.category_id,
      }])
      .select()
      .single();

    if (menuError) {
      alert(menuError.message);
      return;
    }

    const menuId = menuData.id;

    console.log("FILES:", images);

    // 2️⃣ UPLOAD IMAGES
    for (const file of images) {
      const filePath = `menu/${menuId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("food-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError.message);
        alert(uploadError.message);
        return;
      }

      const { error: imgError } = await supabase
        .from("image_food")
        .insert({
          id_menu: menuId,
          img_path: filePath,
        });

      if (imgError) {
        console.error("DB IMAGE ERROR:", imgError.message);
      }
    }


    // RESET
    setForm({ name_menu: "", price: "", category_id: "", image: "" });
    setImages([]);
    setPreviewImages([]);

    setIsSubmitting(false);

    fetchMenus();
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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 p-6">
      {/* HEADER */}
      <div className="bg-red-500 border-4 border-black shadow-[6px_6px_0_#000] p-6 mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-[2px_2px_0_#000]">
          🍜 ADMIN MENU WARUNG CEUNAH
        </h1>
        <p className="text-black font-bold mt-2">
          CRUD Menu – Retro Full Colour Edition
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-yellow-200 border-4 border-black shadow-[6px_6px_0_#000] p-6 mb-10"
      >
        <h2 className="text-2xl font-extrabold mb-4">➕ Tambah Menu</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="p-3 border-4 border-black font-bold"
            placeholder="Nama Menu"
            value={form.name_menu}
            onChange={(e) =>
              setForm({ ...form, name_menu: e.target.value })
            }
            required
          />

          <input
            type="number"
            className="p-3 border-4 border-black font-bold"
            placeholder="Harga"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            required
          />

          <select
            className="p-3 border-4 border-black font-bold"
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: e.target.value })
            }
            required
          >
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_category}
              </option>
            ))}
          </select>

          <input
            type="file"
            multiple
            accept="image/*"
            className="p-3 border-4 border-black font-bold bg-white"
            onChange={(e) => {
              const files = Array.from(e.target.files);

              setImages((prev) => [...prev, ...files]);
              setPreviewImages((prev) => [
                ...prev,
                ...files.map((file) => URL.createObjectURL(file)),
              ]);
            }}
          />


          <div className="flex gap-3 mt-2 flex-wrap">
            {previewImages.map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-20
                  border-4 border-black bg-white
                  shadow-[3px_3px_0_#000]"
              >
                {/* IMAGE */}
                <img
                  src={src}
                  className="w-full h-full object-cover"
                />

                {/* ❌ DELETE BUTTON */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-3 -right-3
                    w-6 h-6 bg-red-500 text-white
                    font-extrabold text-xs
                    border-2 border-black
                    shadow-[2px_2px_0_#000]
                    hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000]
                    transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>



        </div>


         <div className="flex gap-2 mt-3">
          <button
            disabled={isSubmitting}
            className={`mt-6 px-6 py-3 border-4 border-black font-extrabold shadow-[4px_4px_0_#000]
            ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-400 hover:-translate-y-1"}
            transition`}
          >
            {isSubmitting ? "MENYIMPAN..." : "TAMBAH MENU"}
          </button>

          <Link to="/admin/menu/list">
            <button
              type="button"
              className="mt-6 mr-4 px-6 py-3 border-4 border-black font-extrabold
                bg-red-400 shadow-[4px_4px_0_#000]
                hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]
                transition"
            >
              ⬅️ BACK
            </button>
          </Link>
        </div>
      </form>

      {/* LIST MENU */}
      <div className="grid md:grid-cols-2 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white border-4 border-black shadow-[6px_6px_0_#000] p-4 flex flex-col gap-3"

          >
            {/* IMAGE SCROLLER */}
            <div className="overflow-x-auto">
              <div className="flex gap-2">
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
                        w-32 h-32 shrink-0 object-cover cursor-pointer
                        border-4 border-black
                        shadow-[3px_3px_0_#000]
                        hover:-translate-y-1 hover:shadow-[5px_5px_0_#000]
                        transition
                      "
                    />
                  ))
                ) : (
                  <div className="w-32 h-32 bg-gray-200 border-4 border-black
                    flex items-center justify-center font-bold text-xs">
                    NO IMAGE
                  </div>
                )}
              </div>
            </div>



            <div className="flex-1">
              <h3 className="font-extrabold text-lg">
                {menu.name_menu}
              </h3>
              <p className="font-bold text-sm">
                Rp {menu.price} • {menu.category_food?.name_category}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEditModal(menu)}
                  className="bg-blue-400 px-3 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000]"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                        setShowDelete(true);
                        setSelectedMenu(menu);
                    }}
                  className="bg-red-400 px-3 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000]"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                    {/* <label className="absolute bottom-1 left-1 bg-blue-400 text-xs font-bold px-2 py-1 border-2 border-black cursor-pointer">
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
                    </label> */}

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

    </div>
  );
};

export default AddMenuPage;
