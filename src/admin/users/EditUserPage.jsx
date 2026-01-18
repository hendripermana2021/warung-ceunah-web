import { useState } from "react";
import { supabase } from "../../lib/supabase";

const EditUserPage = ({ user, onClose, onSuccess }) => {
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await supabase
      .from("users")
      .update({ email })
      .eq("id", user.id);

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleUpdate}
        className="bg-white border-4 border-black shadow-[6px_6px_0_#000] p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-extrabold mb-4">
          ✏️ Edit User
        </h2>

        <input
          className="w-full mb-4 p-3 border-4 border-black font-bold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 border-2 border-black font-bold"
          >
            Batal
          </button>

          <button
            type="submit"
            className="bg-green-400 px-4 py-2 border-2 border-black font-bold shadow-[2px_2px_0_#000]"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
