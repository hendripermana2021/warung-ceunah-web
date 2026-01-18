import React from "react";

const LocationPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-yellow-200 border-4 border-black shadow-[6px_6px_0_#000] flex flex-col items-center p-6 sm:p-20">

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-red-600 drop-shadow-[3px_3px_0_#000]">
          📍 Lokasi Warung Ceunah
        </h1>
        <p className="mt-2 text-lg sm:text-xl font-bold text-black">
          Gampang dicari, susah dilupain 😋
        </p>
      </header>

      {/* Card Lokasi */}
      <main className="w-full max-w-4xl bg-white border-4 border-black shadow-[6px_6px_0_#000] p-6 sm:p-10 space-y-6">

        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-green-700 drop-shadow-[2px_2px_0_#000]">
            🍜 Warung Ceunah
          </h2>

          <p className="text-lg font-bold text-black">
            📍 Jl. Contoh Warung No. 12
          </p>

          <p className="text-lg font-bold text-black">
            🕘 Buka: 09.00 – 21.00
          </p>

          <p className="text-lg font-bold text-black">
            📅 Setiap Hari (Libur kalau habis 😆)
          </p>
        </div>

        {/* Map */}
        <div className="w-full h-64 sm:h-96 border-4 border-black shadow-[5px_5px_0_#000] overflow-hidden">
        <iframe
          title="Lokasi Warung Ceunah"
          src="https://www.google.com/maps?q=HM9X%2BFCF%20Jl.%20HM.%20Joni%20Medan&output=embed"
          width="100%"
          height="100%"
          className="border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>


        <p className="text-center text-lg sm:text-xl font-bold text-blue-700 drop-shadow-[1px_1px_0_#000]">
          📢 Datang lapar, pulang kenyang!
        </p>
      </main>
    </div>
  );
};

export default LocationPage;
