import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            About SmartBazar
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Bringing quality products and seamless shopping experience right to your doorstep.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/images/download (3).jpg"
              alt="Shopping Experience"
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              At SmartBazar, our mission is to provide our customers with a wide
              variety of high-quality products at affordable prices. We strive
              to make online shopping simple, safe, and enjoyable for everyone.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>

            <p className="text-gray-600 leading-relaxed">
              We envision a world where shopping is effortless, personalized,
              and accessible to everyone, bringing smiles to homes through
              convenience, quality, and trust.
            </p>
          </div>

        </div>

        {/* Core Values */}
        <div className="mb-20">

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300 text-center">
              <h3 className="font-semibold text-lg mb-2 text-purple-600">
                Customer First
              </h3>
              <p className="text-gray-600 text-sm">
                We put our customers at the heart of everything we do.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300 text-center">
              <h3 className="font-semibold text-lg mb-2 text-purple-600">
                Quality Products
              </h3>
              <p className="text-gray-600 text-sm">
                We carefully select products to meet the highest standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300 text-center">
              <h3 className="font-semibold text-lg mb-2 text-purple-600">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Get your orders quickly and reliably, every time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300 text-center">
              <h3 className="font-semibold text-lg mb-2 text-purple-600">
                Trust & Security
              </h3>
              <p className="text-gray-600 text-sm">
                Your data and transactions are safe with us.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-purple-600 text-white rounded-xl py-12 px-6 shadow-lg">

          <h2 className="text-3xl font-bold mb-4">
            Join Us Today
          </h2>

          <p className="mb-6 text-purple-100">
            Experience the easiest and most enjoyable shopping journey with SmartBazar.
          </p>

          <a
            href="/"
            className="inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Shop Now
          </a>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;