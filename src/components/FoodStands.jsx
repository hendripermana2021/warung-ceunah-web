import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabase";


const FoodStands = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 FETCH CATEGORY
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("category_food")
      .select("id, name_category")
      .order("name_category");

    if (!error) {
      setCategories(data);
      setSelectedCategory(data[0]); // auto select pertama
      fetchFoodsByCategory(data[0].id);
    }
  };

  // 🔹 FETCH FOOD BY CATEGORY
  const fetchFoodsByCategory = async (categoryId) => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("menu")
      .select(`
        id,
        name_menu,
        price,
        image,
        category_id
      `)
      .eq("category_id", categoryId);

    if (!error) setFoods(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-yellow-200 border-4 border-black p-6 sm:p-20">

      {/* HEADER */}
      <header className="text-center mb-8">
        <h2 className="text-5xl font-extrabold text-red-600 drop-shadow-[3px_3px_0_#000]">
          🍽️ Menu Warung Ceunah
        </h2>
        <p className="font-bold">
          Pilih kategori → pilih makanan 😋
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">

        {/* SIDEBAR CATEGORY */}
        <aside className="bg-blue-200 border-4 border-black p-4">
          <h3 className="text-xl font-extrabold mb-4">
            🏷️ Kategori Makanan
          </h3>

          <ul className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat);
                  fetchFoodsByCategory(cat.id);
                }}
                className={`px-3 py-2 font-bold border-2 border-black
                  shadow-[3px_3px_0_#000] transition
                  ${
                    selectedCategory?.id === cat.id
                      ? "bg-red-400 -translate-y-1 shadow-[5px_5px_0_#000]"
                      : "bg-yellow-300 hover:-translate-y-1"
                  }`}
              >
                {cat.name_category}
              </button>
            ))}
          </ul>
        </aside>

        {/* FOOD GRID */}
        <section className="bg-green-200 border-4 border-black p-4">
          <h3 className="text-xl font-extrabold mb-4">
            🍜 {selectedCategory?.name_category}
          </h3>

          {isLoading ? (
              <p className="font-bold">⏳ Loading menu...</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className="relative bg-white border-4 border-black cursor-pointer
                      shadow-[4px_4px_0_#000] hover:-translate-y-1
                      hover:shadow-[6px_6px_0_#000] transition-all"
                  >
                    {/* IMAGE */}
                    <img
                      src={food.image || "/placeholder.png"}
                      alt={food.name_menu}
                      className="h-32 w-full object-cover border-b-4 border-black"
                    />

                    {/* CONTENT */}
                    <div className="p-3">
                      {/* NAME + PRICE */}
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-extrabold text-black text-base">
                          {food.name_menu}
                        </h4>

                        <span className="bg-red-500 text-yellow-200 font-extrabold
                          px-2 py-0.5 border-2 border-black
                          shadow-[2px_2px_0_#000] text-sm">
                          Rp {food.price}
                        </span>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {food.description || "Tidak ada deskripsi"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

        </section>
      </div>

      {/* MODAL DETAIL (tetap pakai punyamu, tinggal ganti field) */}
    </div>
  );
};


export default FoodStands;

