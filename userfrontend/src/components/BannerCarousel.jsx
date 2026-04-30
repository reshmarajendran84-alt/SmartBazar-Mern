import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import api from "../utils/api";
 
export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/banners/active");
        setBanners(data);
      } catch (err) {
        console.error("Failed to load banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);
 
  if (loading) {
    return (
      <div className="w-full h-[420px] bg-gray-100 animate-pulse rounded-xl" />
    );
  }
 
  if (!banners.length) return null;
 
  return (
    <section className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={banners.length > 1}
        pagination={{ clickable: true }}
        navigation={banners.length > 1}
        className="w-full rounded-xl overflow-hidden shadow-md"
        style={{
          // Custom Swiper pagination & nav colors via CSS vars
          "--swiper-pagination-color": "#6366f1",
          "--swiper-navigation-color": "#ffffff",
          "--swiper-navigation-size": "22px",
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            {banner.link ? (
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <BannerImage banner={banner} />
              </a>
            ) : (
              <BannerImage banner={banner} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
 
// ── Single slide image ─────────────────────────────────────
function BannerImage({ banner }) {
  return (
    <div className="relative w-full h-[260px] sm:h-[360px] md:h-[460px] lg:h-[520px] bg-gray-200 overflow-hidden">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Optional overlay title */}
      {banner.title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-6 py-5">
          <p className="text-white text-lg font-semibold drop-shadow">
            {banner.title}
          </p>
        </div>
      )}
    </div>
  );
}
 