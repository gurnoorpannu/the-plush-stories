"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { getProduct } from "@/lib/firebaseUtils";
import { FaAmazon } from "react-icons/fa";
import { SiFlipkart } from "react-icons/si";
import {
  IoArrowBack,
  IoShareSocialOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProduct(id);
        if (!data) {
          setNotFound(true);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  const hasImages = product?.images && product.images.length > 0;
  const hasDiscount =
    product?.originalPrice && product.originalPrice > product.price;
  const hasMarketplaceLinks = product?.amazonLink || product?.flipkartLink;

  // Loading State
  if (loading) {
    return (
      <section className="min-h-screen bg-brand-cream pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-brand-subtle rounded-full mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="aspect-square bg-brand-subtle rounded-2xl" />
              <div className="space-y-4 py-4">
                <div className="h-3 w-20 bg-brand-subtle rounded-full" />
                <div className="h-8 w-3/4 bg-brand-subtle rounded-full" />
                <div className="h-6 w-1/3 bg-brand-subtle rounded-full" />
                <div className="h-px bg-brand-subtle my-6" />
                <div className="space-y-2">
                  <div className="h-3 bg-brand-subtle rounded-full w-full" />
                  <div className="h-3 bg-brand-subtle rounded-full w-5/6" />
                  <div className="h-3 bg-brand-subtle rounded-full w-4/6" />
                </div>
                <div className="flex gap-3 mt-8">
                  <div className="h-12 bg-brand-subtle rounded-xl flex-1" />
                  <div className="h-12 bg-brand-subtle rounded-xl flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Not Found State
  if (notFound || !product) {
    return (
      <section className="min-h-screen bg-brand-cream pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-subtle flex items-center justify-center">
              <span className="text-4xl">&#128533;</span>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-brand-dark mb-3">
              Product Not Found
            </h2>
            <p className="text-brand-muted text-sm mb-8">
              This plush toy seems to have wandered off. Let&apos;s get you back!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors duration-200"
            >
              <IoArrowBack size={16} />
              Back to Products
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-brand-cream pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors duration-200 mb-8"
          >
            <IoArrowBack size={16} />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-subtle mb-3">
              {hasImages ? (
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/40 via-brand-subtle to-brand-primary/20 flex items-center justify-center">
                  <span className="text-brand-muted text-lg font-medium">
                    No Image Available
                  </span>
                </div>
              )}

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isBestseller && (
                  <span className="bg-brand-primary text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Bestseller
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-brand-secondary text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    New Arrival
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === idx
                        ? "border-brand-primary shadow-sm"
                        : "border-transparent hover:border-brand-subtle"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="py-2"
          >
            {/* Category */}
            <span className="inline-block text-[10px] font-medium uppercase tracking-widest text-brand-muted bg-brand-subtle px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold text-brand-primary">
                &#8377;{product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-brand-muted line-through">
                    &#8377;{product.originalPrice!.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {Math.round(
                      ((product.originalPrice! - product.price) /
                        product.originalPrice!) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <div className="h-px bg-brand-subtle mb-6" />

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-3">
                  Description
                </h3>
                <p className="text-brand-dark/80 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Marketplace Buttons */}
            <div className="space-y-3 mb-6">
              {hasMarketplaceLinks ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  {product.amazonLink && (
                    <a
                      href={product.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF9900] text-white text-sm font-semibold rounded-xl hover:bg-[#e68a00] transition-colors duration-200 shadow-sm"
                    >
                      <FaAmazon size={18} />
                      Buy on Amazon
                    </a>
                  )}
                  {product.flipkartLink && (
                    <a
                      href={product.flipkartLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2874F0] text-white text-sm font-semibold rounded-xl hover:bg-[#1a5dc7] transition-colors duration-200 shadow-sm"
                    >
                      <SiFlipkart size={16} />
                      Buy on Flipkart
                    </a>
                  )}
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-muted bg-brand-subtle rounded-xl cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-subtle rounded-xl text-sm text-brand-muted hover:text-brand-primary hover:border-brand-primary/40 transition-colors duration-200"
            >
              {copied ? (
                <>
                  <IoCheckmarkCircle size={16} className="text-green-600" />
                  <span className="text-green-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <IoShareSocialOutline size={16} />
                  Share
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
