const FallingLeaves = () => {
  return (
    <>
      {Array.from({ length: 25 }).map((_, idx) => {
        const size = 20 + Math.random() * 30;
        const left = Math.random() * 100;
        const duration = 8 + Math.random() * 8;
        const delay = Math.random() * 5;
        const rotate = Math.random() * 360;

        return (
          <img
            key={idx}
            src="/clover.png" // ✅ cukup "/clover.png" kalau file ada di public
            alt="leaf"
            className="z-2 absolute opacity-80 animate-fall pointer-events-none"
            style={{
              width: `${size}px`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `rotate(${rotate}deg)`,
              filter: `blur(${Math.random() * 2}px)`,
              top: "-10vh", // mulai dari atas layar
            }}
          />
        );
      })}
    </>
  );
};

export default FallingLeaves;
