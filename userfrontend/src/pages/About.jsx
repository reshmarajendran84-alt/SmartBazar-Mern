import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ─── HERO SECTION ─── */}
      <div className="relative h-[250px] sm:h-[350px] md:h-[400px] overflow-hidden">
        <img
          src="/images/1.jpg"
          alt="Shopping"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            About SmartBazar
          </h1>
          <p className="mt-3 text-sm sm:text-lg text-gray-200 max-w-xl">
            Your trusted online shopping destination for quality and convenience
          </p>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">

          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-lg group">
            <img
              src="/images/78bb9974428a1c13.webp"
              alt="Shopping Experience"
              className="w-full h-[250px] sm:h-[350px] object-cover 
              group-hover:scale-110 transition duration-500"
            />
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At SmartBazar, we aim to deliver high-quality products at the
                best prices. We make shopping simple, fast, and enjoyable for
                everyone.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We want to create a seamless and personalized shopping
                experience that brings convenience and happiness to every home.
              </p>
            </div>
          </div>

        </div>

        {/* ─── CORE VALUES ─── */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {[
              {
                title: "Customer First",
                desc: "Customers are our top priority in everything we do.",
                icon: "👥"
              },
              {
                title: "Quality Products",
                desc: "We ensure only the best products reach you.",
                icon: "🏆"
              },
              {
                title: "Fast Delivery",
                desc: "Quick and reliable delivery every time.",
                icon: "🚚"
              },
              {
                title: "Secure Shopping",
                desc: "Your data and payments are always protected.",
                icon: "🔒"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md text-center
                hover:shadow-xl hover:-translate-y-2 transition duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-lg text-purple-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* ─── CTA SECTION ─── */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 
        text-white rounded-2xl py-12 px-6 shadow-xl">

          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Start Shopping Today
          </h2>

          <p className="text-sm sm:text-base text-indigo-100 mb-6">
            Discover amazing deals and enjoy a smooth shopping experience.
          </p>

          <a
            href="/products"
            className="inline-block bg-white text-indigo-600 font-semibold 
            px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Shop Now →
          </a>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;