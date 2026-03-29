"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className="text-2xl font-semibold tracking-tight"
                style={{
                  fontFamily: "var(--font-playfair-var), serif",
                  color: "#2D2D2D",
                }}
              >
                The Plush Stories
                <span
                  className="text-sm align-super"
                  style={{ color: "#C4916E" }}
                >
                  &trade;
                </span>
              </motion.span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium tracking-wide transition-colors duration-200 hover:text-[#C4916E]"
                  style={{ color: "#8B7355" }}
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
              <Link
                href="/admin"
                className="text-xs font-normal tracking-wide transition-colors duration-200 hover:text-[#C4916E]"
                style={{ color: "#8B8680" }}
              >
                Admin
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative z-50 flex flex-col items-center justify-center w-10 h-10 gap-1.5"
              aria-label="Toggle navigation menu"
            >
              <motion.span
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="block h-0.5 w-6 rounded-full"
                style={{ backgroundColor: "#2D2D2D" }}
              />
              <motion.span
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-6 rounded-full"
                style={{ backgroundColor: "#2D2D2D" }}
              />
              <motion.span
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="block h-0.5 w-6 rounded-full"
                style={{ backgroundColor: "#2D2D2D" }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-40 h-full w-[75%] max-w-sm md:hidden"
            style={{ backgroundColor: "#FAF7F2" }}
          >
            <div className="flex flex-col justify-center h-full px-10 gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-2xl font-medium tracking-wide transition-colors duration-200 hover:text-[#C4916E]"
                    style={{
                      fontFamily: "var(--font-playfair-var), serif",
                      color: "#2D2D2D",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + navLinks.length * 0.08,
                  duration: 0.4,
                }}
                className="mt-6 pt-6"
                style={{ borderTop: "1px solid #F0EBE3" }}
              >
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-normal tracking-wide transition-colors duration-200 hover:text-[#C4916E]"
                  style={{ color: "#8B8680" }}
                >
                  Admin
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}
