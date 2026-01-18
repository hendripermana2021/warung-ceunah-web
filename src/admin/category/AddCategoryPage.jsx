import { useState } from "react";
import { supabase } from "../../lib/supabase";

const AddCategoryPage = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama kategori wajib diisi");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("category_food")
      .insert({ name_category: name });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onSuccess(); // refresh list
    onClose();   // tutup modal
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center">
      <div
        className="bg-yellow-200 border-4 border-black
        shadow-[8px_8px_0_#000] w-full max-w-md p-6"
      >
        {/* HEADER */}
        <h2 className="text-2xl font-extrabold mb-4">
          ➕ Tambah Kategori
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <label className="font-bold block mb-2">
            Nama Kategori
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Minuman"
            className="
              w-full px-4 py-2 mb-6
              border-4 border-black
              font-bold
              focus:outline-none
            "
          />

          {/* ACTION */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                bg-gray-300 px-4 py-2 font-extrabold
                border-4 border-black
                shadow-[3px_3px_0_#000]
              "
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`
                px-4 py-2 font-extrabold
                border-4 border-black
                shadow-[3px_3px_0_#000]
                ${loading ? "bg-gray-400" : "bg-green-400 hover:-translate-y-1"}
                transition
              `}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
