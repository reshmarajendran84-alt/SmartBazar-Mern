import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold 
          bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            About SmartBazar
          </h1>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Bringing quality products and seamless shopping experience right to your doorstep.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-center mb-16 sm:mb-20">

          {/* Image */}
          <div className="relative group overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/images/download (3).jpg"
              alt="Shopping Experience"
              className="w-full h-[250px] sm:h-[350px] object-cover 
              transform group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Our Mission
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                At SmartBazar, our mission is to provide our customers with a wide
                variety of high-quality products at affordable prices. We strive
                to make online shopping simple, safe, and enjoyable for everyone.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Our Vision
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We envision a world where shopping is effortless, personalized,
                and accessible to everyone, bringing smiles to homes through
                convenience, quality, and trust.
              </p>
            </div>
          </div>

        </div>

        {/* Core Values */}
        <div className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {[
              {
                title: "Customer First",
                desc: "We put our customers at the heart of everything we do."
              },
              {
                title: "Quality Products",
                desc: "We carefully select products to meet the highest standards."
              },
              {
                title: "Fast Delivery",
                desc: "Get your orders quickly and reliably, every time."
              },
              {
                title: "Trust & Security",
                desc: "Your data and transactions are safe with us."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-md 
                hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center"
              >
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-purple-600">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 
        text-white rounded-2xl py-10 sm:py-12 px-4 sm:px-6 shadow-xl">

          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Join Us Today
          </h2>

          <p className="mb-6 text-purple-100 text-sm sm:text-base">
            Experience the easiest and most enjoyable shopping journey with SmartBazar.
          </p>

          <a
            href="/"
            className="inline-block bg-white text-purple-600 font-semibold 
            px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-md"
          >
            Shop Now
          </a>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;