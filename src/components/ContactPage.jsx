import React from "react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-blue-200 border-4 border-black shadow-[6px_6px_0_#000] flex items-center justify-center p-6">

      <div className="w-full max-w-2xl bg-yellow-300 border-4 border-black shadow-[6px_6px_0_#000] p-8 text-center">

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-red-600 drop-shadow-[3px_3px_0_#000] mb-4">
          📬 Hubungi Warung Ceunah
        </h1>

        <p className="text-lg sm:text-xl font-bold text-black mb-8">
          Mau pesan, tanya menu, atau cuma pengen nanya? 😄
        </p>

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">

          {/* WhatsApp */}
          <a
            href="https://wa.me/6282167827302?text=Halo%20Warung%20Ceunah!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-400 text-black font-extrabold py-3 px-6 border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all"
          >
            📱 WhatsApp
          </a>

          {/* LINE */}
          <a
            href="https://line.me/R/ti/p/yuli.tan1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-lime-400 text-black font-extrabold py-3 px-6 border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] transition-all"
          >
            💬 LINE
          </a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-lg sm:text-xl font-bold text-purple-700 drop-shadow-[1px_1px_0_#000]">
          🍜 Warung sederhana, rasa luar biasa!
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
