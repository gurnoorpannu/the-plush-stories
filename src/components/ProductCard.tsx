"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaAmazon } from "react-icons/fa";
import { SiFlipkart } from "react-icons/si";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasImages = product.images && product.images.length > 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-brand-subtle"
    >
      {/* Badges */}
      {product.isBestseller && (
        <span className="absolute top-3 left-3 z-10 bg-brand-primary text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          Bestseller
        </span>
      )}
      {product.isNewArrival && (
        <span
          className={`absolute top-3 z-10 bg-brand-secondary text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
            product.isBestseller ? "left-24" : "left-3"
          }`}
        >
          New
        </span>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-subtle">
          {hasImages ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/40 via-brand-subtle to-brand-primary/20 flex items-center justify-center">
              <span className="text-brand-muted text-sm font-medium">
                No Image
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="inline-block text-[10px] font-medium uppercase tracking-widest text-brand-muted bg-brand-subtle px-2.5 py-0.5 rounded-full mb-2">
          {product.category}
        </span>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-playfair text-base font-semibold text-brand-dark leading-snug mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-brand-primary">
            &#8377;{product.price.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-sm text-brand-muted line-through">
              &#8377;{product.originalPrice!.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Marketplace Links */}
        <div className="flex items-center gap-2 mb-3">
          {product.amazonLink && (
            <a
              href={product.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy on Amazon"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF9900]/10 text-[#FF9900] hover:bg-[#FF9900]/20 transition-colors duration-200"
            >
              <FaAmazon size={14} />
            </a>
          )}
          {product.flipkartLink && (
            <a
              href={product.flipkartLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy on Flipkart"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2874F0]/10 text-[#2874F0] hover:bg-[#2874F0]/20 transition-colors duration-200"
            >
              <SiFlipkart size={14} />
            </a>
          )}
        </div>

        {/* Buy Now Button */}
        <button
          disabled
          className="w-full py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-muted bg-brand-subtle rounded-lg cursor-not-allowed transition-colors duration-200"
        >
          Coming Soon
        </button>
      </div>
    </motion.div>
  );
}
