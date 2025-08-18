"use client";

import { Product } from "../types/product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
}: ProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-xl">
                <svg
                  className="w-24 h-24 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div
                className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
                  product.badgeColor === "teal"
                    ? "from-teal-500 to-blue-600"
                    : product.badgeColor === "red"
                    ? "from-red-500 to-pink-600"
                    : product.badgeColor === "purple"
                    ? "from-purple-500 to-indigo-600"
                    : product.badgeColor === "green"
                    ? "from-green-500 to-emerald-600"
                    : product.badgeColor === "orange"
                    ? "from-orange-500 to-red-600"
                    : "from-violet-500 to-purple-600"
                }`}
              >
                {product.badge}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Key Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-teal-50 text-teal-800 rounded-full text-sm font-medium border border-teal-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution:</span>
                    <span className="font-medium">4K Ultra HD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Night Vision:</span>
                    <span className="font-medium">Up to 100m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weatherproof:</span>
                    <span className="font-medium">IP67 Rated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium">Up to 128GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Power:</span>
                    <span className="font-medium">12V DC / PoE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span className="font-medium">2 Years</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      ₮{product.price.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-500 line-through">
                      ₮{product.originalPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </div>
                    <div className="text-sm text-gray-600">Limited Time</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Contact sales functionality
                      alert(
                        "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                      );
                      onClose();
                    }}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Contact Sales
                  </button>
                  <button className="px-6 py-4 border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



