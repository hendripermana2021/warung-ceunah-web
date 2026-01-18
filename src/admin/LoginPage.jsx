import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/admin");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 border-4 border-black shadow-[6px_6px_0_#000]"
      >
        <h2 className="text-2xl font-extrabold mb-4">🔐 LOGIN ADMIN</h2>

        <input
          className="w-full p-3 mb-3 border-4 border-black font-bold"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-3 mb-4 border-4 border-black font-bold"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-green-400 px-6 py-3 border-4 border-black font-extrabold shadow-[4px_4px_0_#000]"
        >
          {loading ? "LOGIN..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
