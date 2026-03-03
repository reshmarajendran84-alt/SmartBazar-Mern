import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-600">
          About SmartBazar
        </h1>
        <p className="mt-4 text-lg md:text-xl text-purple-600">
          Bringing quality products and seamless shopping experience right to your doorstep.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <img
            src="/images/download (3).jpg"
            alt="Shopping Experience"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Our Mission</h2>
          <p className="text-purple-600 mb-6">
            At SmartBazar, our mission is to provide our customers with a wide variety of high-quality products at affordable prices. We strive to make online shopping simple, safe, and enjoyable for everyone.
          </p>
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Our Vision</h2>
          <p className="text-purple-600">
            We envision a world where shopping is effortless, personalized, and accessible to everyone, bringing smiles to homes through convenience, quality, and trust.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-purple-600 text-center mb-8">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2 text-purple-600">Customer First</h3>
            <p className="text-purple-600 text-sm">
              We put our customers at the heart of everything we do.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2 text-purple-600">Quality Products</h3>
            <p className="text-purple-600 text-sm">
              We carefully select products to meet the highest standards.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2 text-purple-600">Fast Delivery</h3>
            <p className="text-purple-600 text-sm">
              Get your orders quickly and reliably, every time.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <h3 className="text-purple-600 font-semibold text-lg mb-2">Trust & Security</h3>
            <p className="text-purple-600 text-sm">
              Your data and transactions are safe with us.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">Join Us Today</h2>
        <p className="text-purple-600 mb-6">
          Experience the easiest and most enjoyable shopping journey with SmartBazar.
        </p>
        <a
          href="/"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default AboutPage;