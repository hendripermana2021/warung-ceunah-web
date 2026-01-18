const DeletePopup = ({ title, message, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-red-300 border-4 border-black p-6 w-full max-w-md
        shadow-[8px_8px_0_#000] animate-bounce-once"
      >
        {/* HEADER */}
        <div className="bg-yellow-300 border-4 border-black p-3 mb-4 text-center
          shadow-[4px_4px_0_#000]">
          <h2 className="text-2xl font-extrabold text-black">
            ⚠️ {title}
          </h2>
        </div>

        {/* MESSAGE */}
        <p className="text-center font-bold text-black mb-6">
          {message}
        </p>

        {/* ACTION */}
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="bg-blue-400 px-4 py-2 border-4 border-black font-extrabold
              shadow-[4px_4px_0_#000]
              hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]
              transition-all"
          >
            ❌ Batal
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 px-4 py-2 border-4 border-black font-extrabold
              shadow-[4px_4px_0_#000]
              hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]
              transition-all"
          >
            🗑️ Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
