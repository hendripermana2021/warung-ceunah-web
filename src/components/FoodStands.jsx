import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabase";
import ImageCarousel from "./ImageCarousel";


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
        category_id,
        image_food (
          id,
          img_path
        )
      `)
      .eq("category_id", categoryId);

      console.log("categoryId:", categoryId);

    if (!error) setFoods(data || []);
    setIsLoading(false);
  };

  const getImageUrl = (path) =>
  supabase.storage.from("food-images").getPublicUrl(path).data.publicUrl;



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
              <div className="grid sm:grid-cols-2 gap-4 max-h-130 overflow-y-auto pr-2">
                {foods.map((food) => {
                  const images = food.image_food?.map((img) =>
                    getImageUrl(img.img_path)
                  );

                  return (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className="bg-white border-4 border-black cursor-pointer
                        shadow-[4px_4px_0_#000] hover:-translate-y-1
                        hover:shadow-[6px_6px_0_#000] transition-all"
                    >
                      <ImageCarousel images={images} />

                      <div className="p-3">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-extrabold">{food.name_menu}</h4>
                          <span className="bg-red-500 text-yellow-200 font-extrabold
                            px-2 border-2 border-black">
                            Rp {food.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

        </section>
      </div>

      {selectedFood &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/60
            flex items-center justify-center">

            <div className="bg-yellow-200 border-4 border-black
              shadow-[8px_8px_0_#000] max-w-xl w-full p-4">

              <button
                onClick={() => setSelectedFood(null)}
                className="mb-2 bg-red-500 text-white
                  px-3 py-1 border-2 border-black font-bold"
              >
                ✖ Close
              </button>

              <ImageCarousel
                images={selectedFood.image_food.map((img) =>
                  getImageUrl(img.img_path)
                )}
              />

              <div className="mt-4">
                <h3 className="text-2xl font-extrabold">
                  {selectedFood.name_menu}
                </h3>

                <p className="font-bold mt-1">
                  Rp {selectedFood.price}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}

    </div>
  );
};


export default FoodStands;

