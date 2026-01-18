'use client'
import { Link } from "react-router-dom";

const WarungCeunahLanding = () => {
  return (
    <div className="min-h-screen bg-[#FFF1C1] flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#FF5C5C] border-4 border-black rounded-3xl shadow-[10px_10px_0px_0px_#000] p-8">

        {/* Ornamen */}
        <div className="absolute -top-5 -left-5 w-16 h-16 bg-[#4ADE80] border-4 border-black rotate-12"></div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#FACC15] border-4 border-black rounded-full"></div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-black tracking-tight drop-shadow-[4px_4px_0px_#fff]">
            🍜 WARUNG CEUNAH
          </h1>

          <p className="mt-4 inline-block bg-white text-black font-bold px-4 py-2 border-2 border-black rotate-[-2deg]">
            Rasa Juara, Harga Bersahabat!
          </p>
        </div>

        {/* Deskripsi */}
        <p className="mt-6 text-center text-black font-medium text-lg">
          Menu rumahan favorit, minuman segar, dan cemilan jadul.  
          Cocok buat nongkrong santai & perut kenyang 😋
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/food"
            className="bg-black text-white px-6 py-3 font-bold border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_#16a34a] hover:translate-x-1 hover:translate-y-1 transition"
          >
            Lihat Menu 🍽️
          </Link>

          <Link
            to="/order"
            className="bg-white text-black px-6 py-3 font-bold border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_#2563eb] hover:translate-x-1 hover:translate-y-1 transition"
          >
            Pesan Sekarang 🛒
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WarungCeunahLanding;
