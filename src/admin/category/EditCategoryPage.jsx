import { useState } from "react";
import { supabase } from "../../lib/supabase";

const EditCategoryModal = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category.name_category || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("category_food")
      .update({ name_category: name })
      .eq("id", category.id);

    setLoading(false);

    if (error) {
      alert("❌ Gagal update kategori");
      console.error(error);
      return;
    }

    onSuccess(); // refresh list
    onClose();   // tutup modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-black shadow-[6px_6px_0_#000] p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-extrabold mb-4">
          ✏️ Edit Category
        </h2>

        <label className="block font-bold mb-2">
          Nama Category
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border-4 border-black font-bold mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 border-2 border-black font-bold"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border-2 border-black font-bold
              ${loading ? "bg-green-200" : "bg-green-400 shadow-[2px_2px_0_#000]"}`}
          >
            {loading ? "⏳ Menyimpan..." : "💾 Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryModal;
