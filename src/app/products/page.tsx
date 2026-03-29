"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Category } from "@/lib/types";
import { getProducts, getCategories } from "@/lib/firebaseUtils";
import ProductCard from "@/components/ProductCard";
import { IoSearchOutline, IoChevronDown } from "react-icons/io5";

type SortOption = "newest" | "price-low" | "price-high";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const sortLabels: Record<SortOption, string> = {
    newest: "Newest",
    "price-low": "Price: Low to High",
    "price-high": "Price: High to Low",
  };

  return (
    <section className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="pt-28 pb-10 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-playfair text-4xl md:text-5xl font-bold text-brand-dark mb-3"
        >
          Our Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-brand-muted text-sm md:text-base max-w-md mx-auto"
        >
          Discover premium plush toys crafted with love
        </motion.p>
      </div>

      {/* Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-brand-subtle rounded-xl text-sm text-brand-dark placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-brand-subtle rounded-xl text-sm text-brand-dark hover:border-brand-primary/40 transition-colors duration-200 min-w-[200px] justify-between"
            >
              <span>{sortLabels[sortBy]}</span>
              <IoChevronDown
                size={14}
                className={`text-brand-muted transition-transform duration-200 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-brand-subtle rounded-xl shadow-lg z-20 min-w-[200px] overflow-hidden">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setSortOpen(false);
                    }}
                    className={`block w-full text-left px-5 py-2.5 text-sm transition-colors duration-150 ${
                      sortBy === option
                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                        : "text-brand-dark hover:bg-brand-subtle"
                    }`}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeCategory === "all"
                ? "bg-brand-primary text-white shadow-sm"
                : "bg-white text-brand-muted border border-brand-subtle hover:border-brand-primary/40 hover:text-brand-secondary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat.name
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-white text-brand-muted border border-brand-subtle hover:border-brand-primary/40 hover:text-brand-secondary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-brand-subtle animate-pulse"
              >
                <div className="aspect-square bg-brand-subtle" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-brand-subtle rounded-full w-16" />
                  <div className="h-4 bg-brand-subtle rounded-full w-3/4" />
                  <div className="h-4 bg-brand-subtle rounded-full w-1/2" />
                  <div className="h-10 bg-brand-subtle rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-subtle flex items-center justify-center">
              <span className="text-3xl">&#127868;</span>
            </div>
            <h3 className="font-playfair text-xl font-semibold text-brand-dark mb-2">
              No products found
            </h3>
            <p className="text-brand-muted text-sm">
              Check back soon! We are always adding new plush friends.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
