"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaGift, FaShoppingBag, FaStar } from "react-icons/fa";

const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <div className="w-10 h-10 border-3 border-[#C4916E] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

/* ──────────────────────── Marquee Strip ──────────────────────── */
function MarqueeStrip() {
  const text =
    "FREE SHIPPING ON ORDERS ABOVE \u20B9499 \u2022 AVAILABLE ON AMAZON & FLIPKART \u2022 PREMIUM QUALITY GUARANTEED \u2022 PERFECT GIFT FOR YOUR LOVED ONES \u2022 ";

  return (
    <div className="bg-[#C4916E] overflow-hidden py-3 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="text-white text-sm md:text-base font-medium tracking-wider mx-4"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────── Hero Section ──────────────────────── */
function HeroSection() {
  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center min-h-[85vh] py-12 lg:py-0 gap-8 lg:gap-12">
          {/* Text Side */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[#C4916E] text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4">
              The Plush Stories&trade;
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] leading-tight mb-6">
              Every Toy Tells{" "}
              <span className="text-[#C4916E]">a Story</span>
            </h1>
            <p className="text-[#8B7355] text-base md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Handcrafted premium plush toys, perfect for gifting your loved ones
              or bringing joy to little hearts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#C4916E] text-white font-medium rounded-full hover:bg-[#b07d5c] transition-colors duration-300 text-sm md:text-base tracking-wide"
              >
                Shop Collection
              </Link>
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#C4916E] text-[#C4916E] font-medium rounded-full hover:bg-[#C4916E] hover:text-white transition-colors duration-300 text-sm md:text-base tracking-wide"
              >
                View on Amazon
              </a>
            </div>
          </motion.div>

          {/* 3D Bear Side */}
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Hero3D />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Categories Section ──────────────────────── */
const categories = [
  { name: "Bunny Collection", gradient: "from-[#E8B4A0]/60 to-[#C4916E]/60" },
  { name: "Teddy Bears", gradient: "from-[#C4916E]/60 to-[#8B7355]/60" },
  { name: "Farm Animals", gradient: "from-[#8B7355]/60 to-[#C4916E]/60" },
  { name: "Mini Plushies", gradient: "from-[#C4916E]/60 to-[#E8B4A0]/60" },
];

function CategoriesSection() {
  return (
    <section className="bg-[#FAF7F2] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2D2D] mb-4">
            Shop by Category
          </h2>
          <div className="w-16 h-0.5 bg-[#C4916E] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative group cursor-pointer rounded-2xl overflow-hidden h-64 md:h-72"
            >
              {/* Placeholder background */}
              <div className="absolute inset-0 bg-[#E8D8C8]" />
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} group-hover:opacity-80 transition-opacity duration-300`}
              />
              {/* Category name */}
              <div className="absolute inset-0 flex items-end p-6">
                <h3 className="text-white text-xl md:text-2xl font-semibold drop-shadow-md">
                  {cat.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Bestsellers Section ──────────────────────── */
const bestsellers = [
  { name: "Coco the Teddy Bear", price: "\u20B9599" },
  { name: "Lola the Bunny", price: "\u20B9499" },
  { name: "Milo the Puppy", price: "\u20B9549" },
  { name: "Daisy the Cow", price: "\u20B9449" },
  { name: "Peanut the Elephant", price: "\u20B9649" },
  { name: "Bella the Kitten", price: "\u20B9529" },
];

function BestsellersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2D2D] mb-3">
            Bestsellers
          </h2>
          <p className="text-[#8B7355] text-base md:text-lg">
            Our most loved plush toys
          </p>
          <div className="w-16 h-0.5 bg-[#C4916E] mx-auto mt-4" />
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {bestsellers.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex-shrink-0 w-64 md:w-72 snap-center"
            >
              <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden group cursor-pointer">
                {/* Image Placeholder */}
                <div className="h-64 md:h-72 bg-[#E8D8C8] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <svg
                    className="w-16 h-16 text-[#C4916E]/40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="text-[#2D2D2D] font-medium text-base mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#C4916E] font-semibold text-lg mb-3">
                    {product.price}
                  </p>
                  <button className="w-full py-2.5 text-sm font-medium border-2 border-[#C4916E] text-[#C4916E] rounded-full hover:bg-[#C4916E] hover:text-white transition-colors duration-300">
                    Shop Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Why Choose Us ──────────────────────── */
const features = [
  {
    icon: FaStar,
    title: "Premium Quality",
    desc: "Soft, safe, and durable materials that last for years of cuddles.",
  },
  {
    icon: FaGift,
    title: "Perfect Gift",
    desc: "Thoughtfully designed for every occasion, from birthdays to celebrations.",
  },
  {
    icon: FaShoppingBag,
    title: "Available Everywhere",
    desc: "Shop on Amazon, Flipkart & our website with fast delivery.",
  },
  {
    icon: FaHeart,
    title: "Made with Love",
    desc: "Each toy is crafted with care and attention to every detail.",
  },
];

function WhyChooseUsSection() {
  return (
    <section className="bg-[#FAF7F2] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2D2D] mb-4">
            Why Choose Us
          </h2>
          <div className="w-16 h-0.5 bg-[#C4916E] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C4916E]/10 mb-5">
                <feat.icon className="w-6 h-6 text-[#C4916E]" />
              </div>
              <h3 className="text-[#2D2D2D] font-semibold text-lg mb-2">
                {feat.title}
              </h3>
              <p className="text-[#8B7355] text-sm leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── CTA Banner ──────────────────────── */
function CTABanner() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#C4916E] to-[#8B7355] p-10 md:p-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Find Your Perfect Plush Companion
        </h2>
        <p className="text-white/80 text-base md:text-lg mb-8 max-w-lg mx-auto">
          Explore our collection of handcrafted plush toys and find the one that
          speaks to your heart.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#C4916E] font-semibold rounded-full hover:bg-[#FAF7F2] transition-colors duration-300 text-sm md:text-base tracking-wide"
        >
          Shop Now
        </Link>
      </motion.div>
    </section>
  );
}

/* ──────────────────────── Main Landing Page ──────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-[#FAF7F2]">
      <HeroSection />
      <MarqueeStrip />
      <CategoriesSection />
      <BestsellersSection />
      <WhyChooseUsSection />
      <CTABanner />
    </div>
  );
}
