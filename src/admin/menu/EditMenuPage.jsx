const EditMenuPage = ({
  isOpen,
  onClose,
  onSubmit,
  editForm,
  setEditForm,
  editImages,
  setEditImages,
  isSubmitting,
  category
}) => {
  if (!isOpen) return null;
  const getImageUrl = (path) => {
        return supabase.storage
          .from("food-images")
          .getPublicUrl(path).data.publicUrl;
      };

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

  openEditModal(editForm)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="relative bg-yellow-200 border-4 border-black
          shadow-[6px_6px_0_#000] p-6 w-full max-w-xl"
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500
            text-white font-bold px-3 py-1 border-2 border-black"
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
                  className="relative border-4 border-black
                    shadow-[3px_3px_0_#000]"
                >
                  <img
                    src={img.preview}
                    className="w-full h-28 object-cover"
                  />

                  {/* GANTI IMAGE */}
                  <label className="absolute bottom-1 left-1 bg-blue-400
                    text-xs font-bold px-2 py-1 border-2 border-black cursor-pointer">
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

                  {/* DELETE IMAGE */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...editImages];
                      updated[idx].isDeleted = true;
                      setEditImages(updated);
                    }}
                    className="absolute top-1 right-1 bg-red-500
                      text-white text-xs px-2 border-2 border-black"
                  >
                    ✖
                  </button>
                </div>
              )
            )}

            {/* ADD IMAGE */}
            <label
              className="border-4 border-dashed border-black h-28
                flex items-center justify-center font-bold cursor-pointer"
            >
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
          disabled={isSubmitting}
          className="mt-6 bg-blue-400 px-6 py-3
            border-4 border-black font-extrabold
            shadow-[4px_4px_0_#000]"
        >
          {isSubmitting ? "UPDATING..." : "UPDATE MENU"}
        </button>
      </form>
    </div>
  );
};

export default EditMenuPage;
