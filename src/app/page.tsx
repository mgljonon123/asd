"use client";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  badge: string;
  badgeColor: string;
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [showShopView, setShowShopView] = useState(false);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleShopNow = () => {
    setShowShopView(true);
  };

  const handleBackToHome = () => {
    setShowShopView(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              {/* Enhanced Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  <span>securo</span>
                  <span className="text-transparent bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text">
                    x
                  </span>
                </div>
              </div>

              {/* Enhanced Navigation */}
              <nav className="hidden lg:flex space-x-8">
                <a
                  href="#"
                  className="relative text-teal-600 font-semibold group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-blue-600 transform scale-x-100"></span>
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 group"
                >
                  About Us
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></span>
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 group"
                >
                  Shop
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></span>
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 group"
                >
                  Service
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></span>
                </a>
                <a
                  href="/admin"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 group"
                >
                  Admin
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></span>
                </a>
              </nav>
            </div>

            {/* Enhanced Header Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group">
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group">
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-teal-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Shop View - New Content */}
      {showShopView && (
        <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>

            {/* Shop Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Our Security
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Solutions
                </span>
              </h1>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                Discover our comprehensive range of security cameras, alarm
                systems, and monitoring solutions designed to protect your
                property and loved ones.
              </p>
            </div>

            {/* Shop Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Security Cameras Category */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Security Cameras
                </h3>
                <p className="text-gray-600 mb-6">
                  High-quality surveillance cameras with advanced features like
                  night vision, motion detection, and remote monitoring.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-semibold">
                    Starting from ₮280,000
                  </span>
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                    View All
                  </button>
                </div>
              </div>

              {/* Alarm Systems Category */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Alarm Systems
                </h3>
                <p className="text-gray-600 mb-6">
                  Intelligent alarm systems with mobile app control, real-time
                  alerts, and professional monitoring services.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 font-semibold">
                    Starting from ₮450,000
                  </span>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    View All
                  </button>
                </div>
              </div>

              {/* Monitoring Services Category */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Monitoring Services
                </h3>
                <p className="text-gray-600 mb-6">
                  24/7 professional monitoring with instant response, emergency
                  dispatch, and comprehensive reporting.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold">
                    Starting from ₮150,000/month
                  </span>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto">
                Our security experts are here to help you choose the perfect
                solution for your needs. Get a free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Free Quote
                </button>
                <button className="px-8 py-4 border-2 border-teal-500 text-teal-600 font-semibold rounded-xl text-lg hover:bg-teal-50 transition-all duration-300">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not in shop view */}
      {!showShopView && (
        <div className="relative z-10 flex min-h-screen">
          {/* Left Side - Enhanced White Background */}
          <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center relative">
            <div className="max-w-2xl">
              {/* Enhanced Headline */}
              <div className="mb-8">
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    SECURE YOUR
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PLACE FROM
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    TOP TO BOTTOM
                  </span>
                </h1>
              </div>

              {/* Enhanced Subtext */}
              <p className="text-gray-600 text-xl mb-10 leading-relaxed max-w-lg">
                Reduce risk, ship products faster, and resolve issues
                proactively, by upgrading your infrastructure with
                <span className="font-semibold text-teal-600"> securex</span>.
              </p>

              {/* Enhanced CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <button
                  onClick={handleShopNow}
                  className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/25 btn-glow glow-animation"
                >
                  <span className="relative z-10">Shop Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl text-lg hover:border-teal-500 hover:text-teal-600 transition-all duration-300 transform hover:scale-105 hover-lift">
                  Learn More
                </button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-8 mb-16">
                <div className="text-center hover-lift p-4 rounded-xl">
                  <div className="text-3xl font-bold text-teal-600 mb-2 text-gradient-animate">
                    99.9%
                  </div>
                  <div className="text-gray-600 text-sm">Uptime</div>
                </div>
                <div className="text-center hover-lift p-4 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2 text-gradient-animate">
                    24/7
                  </div>
                  <div className="text-gray-600 text-sm">Monitoring</div>
                </div>
                <div className="text-center hover-lift p-4 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2 text-gradient-animate">
                    10K+
                  </div>
                  <div className="text-gray-600 text-sm">Customers</div>
                </div>
              </div>
            </div>

            {/* Enhanced Image Gallery */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300"></div>
                <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl transform -rotate-2 absolute top-2 left-2 hover:rotate-0 transition-transform duration-300"></div>
                <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-xl transform rotate-1 absolute top-4 left-4 hover:rotate-0 transition-transform duration-300"></div>
              </div>
              <div className="flex space-x-3">
                <button className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Black Background */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10"></div>
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Enhanced Security Camera */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative group">
                {/* Camera Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-blue-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                {/* Enhanced Camera Body */}
                <div className="relative w-96 h-80 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 float-animation">
                  {/* Camera Details */}
                  <div className="absolute top-4 left-4 right-4 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>

                  {/* Enhanced Camera Lens */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-gray-900 to-black rounded-full border-8 border-gray-400 shadow-inner">
                    <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full"></div>
                    <div className="absolute inset-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full"></div>

                    {/* Enhanced LED Lights */}
                    <div className="absolute top-4 left-4 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>

                    {/* Center Lens */}
                    <div className="absolute inset-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full border-2 border-gray-500"></div>
                  </div>

                  {/* Enhanced Camera Mount */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-full border-4 border-gray-300 shadow-xl"></div>
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Social Media Links */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white">
              <div className="writing-mode-vertical text-sm font-medium mb-8 text-gray-300">
                Follow Us On
              </div>
              <div className="flex flex-col space-y-6">
                <button className="group w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20">
                  <svg
                    className="w-6 h-6 group-hover:text-blue-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="group w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20">
                  <svg
                    className="w-6 h-6 group-hover:text-blue-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="group w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20">
                  <svg
                    className="w-6 h-6 group-hover:text-pink-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section - Only show when not in shop view */}
      {!showShopView && (
        <section className="relative z-10 py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Our Premium
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Security Cameras
                </span>
              </h2>
              <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                Choose from our wide range of high-quality security cameras
                designed for every environment
              </p>
            </div>

            {/* Camera Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Camera Card 1 - Dome Camera */}
              <div
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer"
                onClick={() =>
                  openProductModal({
                    id: 1,
                    name: "HD Dome Camera Pro",
                    price: 450000,
                    originalPrice: 550000,
                    description:
                      "1080p HD resolution with night vision and motion detection",
                    features: ["1080p HD", "Night Vision", "Motion Detection"],
                    badge: "Best Seller",
                    badgeColor: "teal",
                  })
                }
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {/* Camera Image Placeholder */}
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-gray-600"
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
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Best Seller
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    HD Dome Camera Pro
                  </h3>
                  <p className="text-gray-600 mb-4">
                    1080p HD resolution with night vision and motion detection
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                      1080p HD
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Night Vision
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      Motion Detection
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₮450,000
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₮550,000
                    </div>
                  </div>

                  {/* Action Buttons */}
                </div>
              </div>

              {/* Camera Card 2 - Bullet Camera */}
              <div
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer"
                onClick={() =>
                  openProductModal({
                    id: 2,
                    name: "4K Bullet Camera Ultra",
                    price: 850000,
                    originalPrice: 950000,
                    description:
                      "4K ultra HD with 360° pan and tilt capabilities",
                    features: ["4K Ultra HD", "360° View", "Weatherproof"],
                    badge: "New",
                    badgeColor: "red",
                  })
                }
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-gray-600"
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
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    New
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    4K Bullet Camera Ultra
                  </h3>
                  <p className="text-gray-600 mb-4">
                    4K ultra HD with 360° pan and tilt capabilities
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      4K Ultra HD
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      360° View
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Weatherproof
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₮850,000
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₮950,000
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Contact sales functionality
                        alert(
                          "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                        );
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>

              {/* Camera Card 3 - PTZ Camera */}
              <div
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer"
                onClick={() =>
                  openProductModal({
                    id: 3,
                    name: "PTZ Security Camera",
                    price: 1250000,
                    originalPrice: 1450000,
                    description:
                      "Professional PTZ with AI-powered tracking and analytics",
                    features: ["AI Tracking", "PTZ Control", "Analytics"],
                    badge: "Premium",
                    badgeColor: "purple",
                  })
                }
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-gray-600"
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
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Premium
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    PTZ Security Camera
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Professional PTZ with AI-powered tracking and analytics
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      AI Tracking
                    </span>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                      PTZ Control
                    </span>
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                      Analytics
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₮1,250,000
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₮1,450,000
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Contact sales functionality
                        alert(
                          "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                        );
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>

              {/* Camera Card 4 - Wireless Camera */}
              <div
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer"
                onClick={() =>
                  openProductModal({
                    id: 4,
                    name: "WiFi Security Camera",
                    price: 320000,
                    originalPrice: 380000,
                    description:
                      "Wireless HD camera with mobile app control and cloud storage",
                    features: ["WiFi", "Mobile App", "Cloud Storage"],
                    badge: "Wireless",
                    badgeColor: "green",
                  })
                }
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-gray-600"
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
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Wireless
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    WiFi Security Camera
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Wireless HD camera with mobile app control and cloud storage
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      WiFi
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                      Mobile App
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Cloud Storage
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₮320,000
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₮380,000
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Contact sales functionality
                        alert(
                          "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                        );
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>

              {/* Camera Card 5 - Doorbell Camera */}
              <div
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer"
                onClick={() =>
                  openProductModal({
                    id: 5,
                    name: "Smart Doorbell Camera",
                    price: 280000,
                    originalPrice: 350000,
                    description:
                      "Video doorbell with two-way audio and motion alerts",
                    features: ["Two-way Audio", "Motion Alerts", "HD Video"],
                    badge: "Smart",
                    badgeColor: "orange",
                  })
                }
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-gray-600"
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
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Smart
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Smart Doorbell Camera
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Video doorbell with two-way audio and motion alerts
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      Two-way Audio
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      Motion Alerts
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      HD Video
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₮280,000
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₮350,000
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Contact sales functionality
                        alert(
                          "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                        );
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>

              {/* Camera Card 6 - Thermal Camera */}
              <div
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer"
                onClick={() =>
                  openProductModal({
                    id: 6,
                    name: "Thermal Security Camera",
                    price: 1800000,
                    originalPrice: 2100000,
                    description:
                      "Advanced thermal imaging for complete darkness detection",
                    features: [
                      "Thermal Imaging",
                      "Night Detection",
                      "Heat Sensing",
                    ],
                    badge: "Thermal",
                    badgeColor: "violet",
                  })
                }
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-gray-600"
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
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Thermal
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Thermal Security Camera
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Advanced thermal imaging for complete darkness detection
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs font-medium">
                      Thermal Imaging
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      Night Detection
                    </span>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                      Heat Sensing
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₮1,800,000
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₮2,100,000
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Contact sales functionality
                        alert(
                          "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                        );
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                View All Cameras
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Product Detail Modal - Only show when not in shop view */}
      {!showShopView && isProductModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={() => setIsProductModalOpen(false)}
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
                      selectedProduct.badgeColor === "teal"
                        ? "from-teal-500 to-blue-600"
                        : selectedProduct.badgeColor === "red"
                        ? "from-red-500 to-pink-600"
                        : selectedProduct.badgeColor === "purple"
                        ? "from-purple-500 to-indigo-600"
                        : selectedProduct.badgeColor === "green"
                        ? "from-green-500 to-emerald-600"
                        : selectedProduct.badgeColor === "orange"
                        ? "from-orange-500 to-red-600"
                        : "from-violet-500 to-purple-600"
                    }`}
                  >
                    {selectedProduct.badge}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.features.map((feature, index) => (
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
                          ₮{selectedProduct.price.toLocaleString()}
                        </div>
                        <div className="text-lg text-gray-500 line-through">
                          ₮{selectedProduct.originalPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(
                            ((selectedProduct.originalPrice -
                              selectedProduct.price) /
                              selectedProduct.originalPrice) *
                              100
                          )}
                          % OFF
                        </div>
                        <div className="text-sm text-gray-600">
                          Limited Time
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          // Contact sales functionality
                          alert(
                            "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                          );
                          setIsProductModalOpen(false);
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
      )}

      {/* Contact & Footer Section - Only show when not in shop view */}
      {!showShopView && (
        <footer className="relative z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div className="text-2xl font-bold">
                    <span className="text-white">securo</span>
                    <span className="text-transparent bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text">
                      x
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  Your trusted partner in security solutions. We provide
                  cutting-edge security cameras and monitoring systems to
                  protect what matters most.
                </p>
                <div className="flex space-x-4">
                  <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-teal-400">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-teal-400">
                  Contact Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Phone</p>
                      <p className="text-white font-medium">+976 9900-1234</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Email</p>
                      <p className="text-white font-medium">info@securox.mn</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Address</p>
                      <p className="text-white font-medium">
                        Sukhbaatar District, Ulaanbaatar
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Contact sales functionality
                        alert(
                          "Таны хүсэлтийг хүлээн авлаа. Бид танд удахгүй холбогдох болно!"
                        );
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2024 Securox. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
