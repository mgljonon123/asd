"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  badge: string;
  badgeColor: string;
  images?: string[];
  // Technical specifications (optional)
  resolution?: string;
  nightVision?: string;
  weatherProtection?: string;
  storage?: string;
  power?: string;
  warranty?: string;
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [showShopView, setShowShopView] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  const scrollToCompanyIntro = () => {
    const el = document.getElementById("company-intro");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // If section isn't mounted (e.g., in shop view), exit shop view then scroll
    setShowShopView(false);
    setTimeout(() => {
      const target = document.getElementById("company-intro");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setShowShopView(false);
    setTimeout(() => {
      const target = document.getElementById("products");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setLoadError(null);
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Алдаа гарлаа");
        const data = await res.json();
        const transformed: Product[] = (Array.isArray(data) ? data : []).map(
          (p: any): Product => {
            const price = Number(p.price) || 0;
            const originalPrice = price > 0 ? Math.round(price * 1.15) : price;
            const tags: string[] = Array.isArray(p.tags) ? p.tags : [];
            const features = tags.length
              ? tags
              : [p.category?.name || "Бүлэг", p.company?.name || "Компани"];
            const createdAt = p.createdAt ? new Date(p.createdAt) : null;
            const isNew = createdAt
              ? Date.now() - createdAt.getTime() < 14 * 24 * 60 * 60 * 1000
              : false;
            const outOfStock = p.stockStatus === "OUT_OF_STOCK";
            const badge = outOfStock ? "Дууссан" : isNew ? "Шинэ" : "Онцлох";
            const badgeColor = outOfStock
              ? "red"
              : isNew
              ? "red"
              : p.category?.type === "ALARM"
              ? "purple"
              : "teal";
            return {
              id: p.id || 0,
              name: p.name,
              price,
              originalPrice,
              description: p.description || "",
              features,
              badge,
              badgeColor,
              images: Array.isArray(p.images)
                ? p.images
                : typeof p.images === "string" && p.images
                ? [p.images]
                : [],
              resolution: p.resolution ?? undefined,
              nightVision: p.nightVision ?? undefined,
              weatherProtection: p.weatherProtection ?? undefined,
              storage: p.storage ?? undefined,
              power: p.power ?? undefined,
              warranty: p.warranty ?? undefined,
            } as Product;
          }
        );
        setProducts(transformed);
      } catch (e: any) {
        setLoadError(e?.message || "Ачааллахад алдаа гарлаа");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

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
                  <span>SpecialForceLLC</span>
                </div>
              </div>

              {/* Enhanced Navigation */}
              <nav className="hidden lg:flex space-x-8">
                <a
                  href="#"
                  className="relative text-teal-600 font-semibold group"
                >
                  Нүүр
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-blue-600 transform scale-x-100"></span>
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCompanyIntro();
                  }}
                  className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 group"
                >
                  Бидний тухай
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></span>
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToProducts();
                  }}
                  className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 group"
                >
                  Дэлгүүр
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></span>
                </a>

                <a
                  href="/admin/login"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 group"
                >
                  Админ
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-teal-500 to-blue-600"></span>
                </a>
              </nav>
            </div>

            {/* Enhanced Header Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="/admin/login"
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
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
              </a>
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
                <span>Нүүр хуудас руу буцах</span>
              </button>
            </div>
          </div>

          {/* Shop Products (fetched from API) */}
          <div className="mt-8 max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Бүтээгдэхүүнүүд
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Манай каталог дахь хамгийн сүүлийн бүтээгдэхүүнүүд
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingProducts && (
                <div className="col-span-full text-center text-gray-500">
                  Ачаалж байна...
                </div>
              )}
              {loadError && !isLoadingProducts && (
                <div className="col-span-full text-center text-red-600">
                  {loadError}
                </div>
              )}
              {!isLoadingProducts && !loadError && products.length === 0 && (
                <div className="col-span-full text-center text-gray-600">
                  Бүтээгдэхүүн байхгүй байна.
                </div>
              )}

              {products.map((p, idx) => (
                <div
                  key={p.id ?? idx}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer"
                  onClick={() => openProductModal(p)}
                >
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="relative w-full mx-6 aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-300 to-gray-400">
                      {Array.isArray(p.images) && p.images.length > 0 ? (
                        <Image
                          src={
                            p.images[0].startsWith("http") ||
                            p.images[0].startsWith("/") ||
                            p.images[0].startsWith("data:")
                              ? p.images[0]
                              : `/${p.images[0].replace(/^\/+/i, "")}`
                          }
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
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
                      )}
                    </div>
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
                        p.badgeColor === "teal"
                          ? "from-teal-500 to-blue-600"
                          : p.badgeColor === "red"
                          ? "from-red-500 to-pink-600"
                          : p.badgeColor === "purple"
                          ? "from-purple-500 to-indigo-600"
                          : p.badgeColor === "green"
                          ? "from-green-500 to-emerald-600"
                          : p.badgeColor === "orange"
                          ? "from-orange-500 to-red-600"
                          : "from-violet-500 to-purple-600"
                      }`}
                    >
                      {p.badge}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{p.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.features.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ₮{p.price.toLocaleString()}
                      </div>
                      {p.originalPrice > p.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ₮{p.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                    Бүх түвшний
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    хамгаалалт,
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    бүрэн итгэл.
                  </span>
                </h1>
              </div>

              {/* Enhanced Subtext */}
              <p className="text-gray-600 text-xl mb-10 leading-relaxed max-w-lg">
                <span className="font-semibold text-teal-600">
                  {" "}
                  "SpecialForceLLC
                </span>
                -ийн шийдлээр орчноо хамгаалж, эрсдэлийг бууруулж, гэмт хэргээс
                урьдчилан сэргийлээрэй.” -ээр сайжруулаарай.
              </p>

              {/* Enhanced CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <button
                  onClick={handleShopNow}
                  className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/25 btn-glow glow-animation"
                >
                  <span className="relative z-10">Дэлгүүр үзэх</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={scrollToCompanyIntro}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl text-lg hover:border-teal-500 hover:text-teal-600 transition-all duration-300 transform hover:scale-105 hover-lift"
                >
                  Дэлгэрэнгүй
                </button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-8 mb-16">
                <div className="text-center hover-lift p-4 rounded-xl">
                  <div className="text-3xl font-bold text-teal-600 mb-2 text-gradient-animate">
                    99.9%
                  </div>
                  <div className="text-gray-600 text-sm">Ажиллах чадвар</div>
                </div>
                <div className="text-center hover-lift p-4 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2 text-gradient-animate">
                    24/7
                  </div>
                  <div className="text-gray-600 text-sm">Хяналт</div>
                </div>
                <div className="text-center hover-lift p-4 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2 text-gradient-animate">
                    10K+
                  </div>
                  <div className="text-gray-600 text-sm">Харилцагчид</div>
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
                Биднийг дагаарай
              </div>
              <div className="flex flex-col space-y-6">
                <a
                  href="https://www.facebook.com/profile.php?id=100092759287365"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20"
                >
                  <svg
                    className="w-6 h-6 group-hover:text-blue-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section - Only show when not in shop view */}
      {!showShopView && (
        <section
          id="products"
          className="relative z-10 py-20 bg-gradient-to-br from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Манай дээд зэрэглэлийн
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  хяналтын камерууд
                </span>
              </h2>
              <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                Ямар ч орчинд тохирсон өндөр чанартай хяналтын камеруудын өргөн
                сонголтоос сонгоорой
              </p>
            </div>

            {/* Camera Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingProducts && (
                <div className="col-span-full text-center text-gray-500">
                  Ачаалж байна...
                </div>
              )}
              {loadError && !isLoadingProducts && (
                <div className="col-span-full text-center text-red-600">
                  {loadError}
                </div>
              )}
              {!isLoadingProducts && !loadError && products.length === 0 && (
                <div className="col-span-full text-center text-gray-600">
                  Бүтээгдэхүүн байхгүй байна.
                </div>
              )}

              {products.map((p, idx) => (
                <div
                  key={p.id ?? idx}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift overflow-hidden cursor-pointer border border-black hover:border-black hover:ring-2 hover:ring-black/20"
                  onClick={() => openProductModal(p)}
                >
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="relative w-full mx-6 aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-300 to-gray-400">
                      {Array.isArray(p.images) && p.images.length > 0 ? (
                        <Image
                          src={
                            p.images[0].startsWith("http") ||
                            p.images[0].startsWith("/") ||
                            p.images[0].startsWith("data:")
                              ? p.images[0]
                              : `/${p.images[0].replace(/^\/+/i, "")}`
                          }
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
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
                      )}
                    </div>
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
                        p.badgeColor === "teal"
                          ? "from-teal-500 to-blue-600"
                          : p.badgeColor === "red"
                          ? "from-red-500 to-pink-600"
                          : p.badgeColor === "purple"
                          ? "from-purple-500 to-indigo-600"
                          : p.badgeColor === "green"
                          ? "from-green-500 to-emerald-600"
                          : p.badgeColor === "orange"
                          ? "from-orange-500 to-red-600"
                          : "from-violet-500 to-purple-600"
                      }`}
                    >
                      {p.badge}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{p.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.features.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ₮{p.price.toLocaleString()}
                      </div>
                      {p.originalPrice > p.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ₮{p.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Company Introduction - After Products Section */}
      {!showShopView && (
        <section
          id="company-intro"
          className="relative z-10 py-16 bg-gradient-to-br from-white to-gray-50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
              Компанийн танилцуулга
            </h2>
            <div className="space-y-4 text-gray-900 leading-relaxed text-lg">
              <p>
                Манай компани 2007 онд БНСУ-ын хөрөнгө оруулагчаар байгуулагдаж
                2018 оноос үндэсний компани болж үйл ажиллагаа явуулж ирсэн.
              </p>
              <p>
                Мэдээлэл технологийн ололтод тулгуурласан хуульд, галын
                дохиоллын систем, IP камержуулалтын систем, цаг бүртгэлийн
                систем, авто зогсоолын автомат хаалтын систем, дохиолол суулгах
                зэрэг хэрэглэгчдийн сонголт тохируулах санал болгож ба дотоод
                гадаадын томоохон үйлдвэрлэгч БНСУ, ОХУ, БНХАУ, ИЗРАЙЛ улсуудаас
                техникийн хэрэгсэл тусгай сурвалжлаг болон бусад дагалдах
                хангамжийг хүргэж байна.
              </p>
              <p>
                Бид харуул хамгаалалт болон дохиолол хамгаалалтын систем
                нийлүүлэх гадна хяналтын камерын системийг мэргэжлийн өндөр
                түвшинд угсарч суурилуулдаг найдвартай хамт олон юм. Манай хамт
                олон хэрэглэгчдийн хэрэгцээ шаардлагад нийцүүлэн чанарын
                шаардлага хангахуйц үйлчилгээ үзүүлэхийн зэрэгцээ жилийн турш
                тасралтгүй найдвартай үр ашигтай туршлагатай мэргэжлийн
                байгууллага бөгөөд таныг хамтран ажиллахад бэлэн байна.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Product Detail Modal */}
      {isProductModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Бүтээгдэхүүний дэлгэрэнгүй
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
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="relative w-full mx-6 aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-300 to-gray-400">
                    {Array.isArray(selectedProduct.images) &&
                    selectedProduct.images.length > 0 ? (
                      <Image
                        src={
                          selectedProduct.images[0].startsWith("http") ||
                          selectedProduct.images[0].startsWith("/") ||
                          selectedProduct.images[0].startsWith("data:")
                            ? selectedProduct.images[0]
                            : `/${selectedProduct.images[0].replace(
                                /^\/+/i,
                                ""
                              )}`
                        }
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
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
                    )}
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
                      Гол боломжууд
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
                      Техникийн үзүүлэлт
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black">Нягтаршил:</span>
                        <span className="font-medium text-black">
                          {selectedProduct.resolution ?? "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Шөнийн хараа:</span>
                        <span className="font-medium text-black">
                          {selectedProduct.nightVision ?? "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">
                          Цаг агаарын хамгаалалт:
                        </span>
                        <span className="font-medium text-black">
                          {selectedProduct.weatherProtection ?? "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Санах ой:</span>
                        <span className="font-medium text-black">
                          {selectedProduct.storage ?? "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Тэжээл:</span>
                        <span className="font-medium text-black">
                          {selectedProduct.power ?? "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Баталгаа:</span>
                        <span className="font-medium text-black">
                          {selectedProduct.warranty ?? "-"}
                        </span>
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
                          % ХЯМДРАЛ
                        </div>
                        <div className="text-sm text-gray-600">Хугацаатай</div>
                      </div>
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
                    <span className="text-white">SpecialForceLLC</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  "SpecialForceLLC-ийн шийдлээр орчноо хамгаалж, эрсдэлийг
                  бууруулж, гэмт хэргээс урьдчилан сэргийлээрэй.” -ээр
                  сайжруулаарай.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=100092759287365"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-teal-400">
                  Түргэн холбоос
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Нүүр
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Бидний тухай
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Бүтээгдэхүүн
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Үйлчилгээ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      Дэмжлэг
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-teal-400">
                  Холбоо барих
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
                      <p className="text-gray-300 text-sm">Утас</p>
                      <p className="text-white font-medium">
                        +976 72203729 95959876
                      </p>
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
                      <p className="text-gray-300 text-sm">И-мэйл</p>
                      <p className="text-white font-medium">
                        Specialforcellc@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teал-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-teал-400"
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
                      <p className="text-gray-300 text-sm">Хаяг</p>
                      <p className="text-white font-medium">
                        Сүхбаатар дүүрэг, Улаанбаатар
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
                      className="w-full bg-gradient-to-r from-teал-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Борлуулалттай холбогдох
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2025 SpecialForceLLC. Бүх эрх хуулиар хамгаалагдсан.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teал-400 text-sm transition-colors duration-300"
                  >
                    Нууцлалын бодлого
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teал-400 text-sm transition-colors duration-300"
                  >
                    Үйлчилгээний нөхцөл
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teал-400 text-sm transition-colors duration-300"
                  >
                    Күүкийн бодлого
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
