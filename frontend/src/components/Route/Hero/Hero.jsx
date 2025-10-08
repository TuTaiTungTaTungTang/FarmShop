import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  // Curated slides for agro carousel (do NOT use static/data.js)
  const slides = [
    {
      src: "https://thoibaotaichinhvietnam.vn/stores/news_dataimages/2025/102025/06/05/in_article/ngay-610-gia-lua-gao-tai-dong-bang-song-cuu-long-di-ngang-sang-dau-tuan-20251006055154.jpg?rt=20251006055157",
      title: "Gạo hữu cơ chất lượng cao",
      value: "Rice",
      caption: "Gạo thơm ngon, sản xuất theo quy trình hữu cơ."
    },
    {
      src: "https://mtcs.1cdn.vn/2023/05/30/rau-cu-qua.jpg",
      title: "Rau củ tươi sạch",
      value: "Vegetables",
      caption: "Rau thu hái trong ngày — an toàn cho gia đình bạn."
    },
    {
      src: "https://cdn2.fptshop.com.vn/unsafe/800x0/mua_nay_co_qua_gi_08_0592cc739c.jpg",
      title: "Trái cây theo mùa",
      value: "Fruits",
      caption: "Đa dạng trái cây theo mùa — ngọt tự nhiên, ít xử lý."
    },
    {
      src: "https://arockacoffee.com/upload/news/cafe-ngon-1059.png",
      title: "Cà phê rang xay nguyên chất",
      value: "Coffee",
      caption: "Cà phê địa phương, rang tại chỗ để giữ hương thơm."
    },
    {
      src: "https://suckhoedoisong.qltns.mediacdn.vn/zoom/600_315/324455921873985536/2022/3/17/loi-ich-mat-ong-1200x676-1647530259590803088207-0-0-676-1082-crop-1647530264945220536639.jpg",
      title: "Mật ong nguyên chất",
      value: "Honey",
      caption: "Mật ong rừng, không chất bảo quản."
    }
  ];

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartX = useRef(null);
  const delay = 4500;

  useEffect(() => {
    const next = () => setIndex((prev) => (prev + 1) % slides.length);
    timeoutRef.current = setInterval(next, delay);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [slides.length]);

  // Pause on hover / focus
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => { if (timeoutRef.current) { clearInterval(timeoutRef.current); timeoutRef.current = null; } };
    const onLeave = () => { if (!timeoutRef.current) timeoutRef.current = setInterval(() => setIndex(i => (i + 1) % slides.length), delay); };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onEnter);
    el.addEventListener('focusout', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', onEnter);
      el.removeEventListener('focusout', onLeave);
    };
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + slides.length) % slides.length);
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  const prevSlide = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    if (timeoutRef.current) clearInterval(timeoutRef.current);
  };
  const nextSlide = () => {
    setIndex((i) => (i + 1) % slides.length);
    if (timeoutRef.current) clearInterval(timeoutRef.current);
  };

  // Pointer / touch swipe support
  const onPointerDown = (e) => {
    touchStartX.current = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
  };
  const onPointerUp = (e) => {
    if (touchStartX.current == null) return;
    const endX = e.clientX ?? (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX);
    const dx = endX - touchStartX.current;
    const threshold = 50; // px
    if (dx > threshold) prevSlide();
    else if (dx < -threshold) nextSlide();
    touchStartX.current = null;
  };

  return (
    <section className="relative w-full overflow-hidden" ref={containerRef}>
      <div className="relative h-[70vh] 800px:h-[80vh]" onMouseDown={onPointerDown} onMouseUp={onPointerUp} onTouchStart={onPointerDown} onTouchEnd={onPointerUp}>
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={s.src}
              alt={s.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/1200x600?text=No+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className={`${styles.section} w-[90%] 800px:w-[60%] text-white`}>
                <h2 className="text-[34px] 600px:text-[46px] 800px:text-[64px] font-[800] leading-tight">
                  {s.title}
                </h2>
                <p className="mt-4 text-lg 600px:text-xl 800px:text-2xl text-white/95">{s.caption}</p>
                <div className="mt-6 flex items-center gap-4">
                  <Link to={`/products?category=${encodeURIComponent(s.value)}`}>
                    <div className={`${styles.button} inline-block py-3 px-6`}> 
                      <span className="text-white text-[18px] font-[700]">Mua ngay</span>
                    </div>
                  </Link>
                  <Link to={`/products?category=${encodeURIComponent(s.value)}`} className="text-white/95 underline text-base 800px:text-lg">
                    Xem chi tiết nông sản
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <button
          aria-label="Trước"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white z-20 text-2xl"
        >
          ‹
        </button>
        <button
          aria-label="Tiếp"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white z-20 text-2xl"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`w-4 h-4 rounded-full ${idx === index ? "bg-white" : "bg-white/60"}`}
              aria-label={`Chuyển đến slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;