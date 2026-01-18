import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import DeletePopup from "../DeletePopup";
import EditCategoryModal from "./EditCategoryPage";
import AddCategoryPage from "./AddCategoryPage";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);



  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("category_food")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCategories(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-300 via-yellow-200 to-blue-300 p-6 sm:p-20 sm:pb-20">

      {/* HEADER */}
      <header className="bg-red-500 border-4 border-black shadow-[6px_6px_0_#000]
        p-6 mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-yellow-300
          drop-shadow-[2px_2px_0_#000]">
          🏷️ CATEGORY MENU
        </h1>
        <p className="text-black font-bold mt-2">
          Kelola kategori makanan & minuman
        </p>
      </header>

      {/* ADD BUTTON */}
      <div className="mb-6 text-right">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-400 px-6 py-3 font-extrabold
            border-4 border-black shadow-[4px_4px_0_#000]
            hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]
            transition-all"
        >
          ➕ TAMBAH KATEGORI
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="font-bold text-lg">⏳ Loading kategori...</p>
      ) : categories.length === 0 ? (
        <p className="font-bold text-lg">❌ Belum ada kategori</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:pb-20">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border-4 border-black
                shadow-[6px_6px_0_#000]
                hover:-translate-y-1 hover:shadow-[8px_8px_0_#000]
                transition-all"
            >
              <div className="p-4">
                <h3 className="text-xl font-extrabold text-black mb-2">
                  {cat.name_category}
                </h3>

                <p className="text-sm font-bold text-gray-700">
                  Dibuat: {new Date(cat.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowEdit(true);
                    }}
                    className="bg-blue-400 px-3 py-1 font-bold
                      border-2 border-black shadow-[2px_2px_0_#000]"
                  >
                    ✏️ Edit
                  </button>


                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowDelete(true);
                    }}
                    className="bg-red-400 px-3 py-1 font-bold
                      border-2 border-black shadow-[2px_2px_0_#000]"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEdit && (
      <EditCategoryModal
        category={editingCategory}
        onClose={() => setShowEdit(false)}
        onSuccess={fetchCategories}
      />
    )}

    {showAdd && (
      <AddCategoryPage
        onClose={() => setShowAdd(false)}
        onSuccess={fetchCategories}
      />
    )}    


      {showDelete && (
        <DeletePopup
            title="Hapus Category?"
            message={`Category dengan nama "${selectedCategory.name_category}" akan dihapus permanen!`}
            onCancel={() => setShowDelete(false)}
            onConfirm={async () => {
            await supabase
                .from("category_food")
                .delete()
                .eq("id", selectedCategory.id);

            setShowDelete(false);
            setSelectedCategory(null);
            fetchCategories();
            }}
        />
        )}
    </div>
  );
};

export default CategoryPage;
