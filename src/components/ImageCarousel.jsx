import { useState } from "react";

const ImageCarousel = ({ images = [], onClick }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-32 bg-gray-200 flex items-center justify-center font-bold">
        NO IMAGE
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={images[index]}
        onClick={onClick}
        className="h-32 w-full object-cover border-b-4 border-black cursor-pointer"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2
              bg-white border-2 border-black px-2 font-bold"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2
              bg-white border-2 border-black px-2 font-bold"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
