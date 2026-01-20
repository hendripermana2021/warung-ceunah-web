import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null); // success | error

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");

      // 🎯 ERROR HANDLING YANG MANUSIAWI
      if (error.message.includes("Invalid login credentials")) {
        setMessage("❌ Email atau password salah");
      } else if (error.message.includes("Email not confirmed")) {
        setMessage("📧 Email belum dikonfirmasi");
      } else {
        setMessage(error.message);
      }

      setLoading(false);
      return;
    }

    // ✅ SUCCESS
    setStatus("success");
    setMessage("✅ Login berhasil! Mengalihkan ke admin...");

    setTimeout(() => {
      navigate("/admin", { replace: true });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 w-[90%] max-w-sm
          border-4 border-black shadow-[6px_6px_0_#000]"
      >
        <h2 className="text-2xl font-extrabold mb-4 text-center">
          🔐 LOGIN ADMIN
        </h2>

        {/* 🔔 MESSAGE */}
        {message && (
          <div
            className={`mb-4 p-3 border-4 font-bold text-center
              ${
                status === "error"
                  ? "bg-red-300 border-red-700 text-black"
                  : "bg-green-300 border-green-700 text-black"
              }`}
          >
            {message}
          </div>
        )}

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
          className={`w-full px-6 py-3 border-4 border-black
            font-extrabold shadow-[4px_4px_0_#000]
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-400 hover:-translate-y-1"
            }
            transition-all`}
        >
          {loading ? "LOGIN..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
