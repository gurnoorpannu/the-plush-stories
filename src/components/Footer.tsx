"use client";

import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/theplushstories",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://wa.me/917814550583",
    icon: FaWhatsapp,
    label: "WhatsApp",
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#2D2D2D" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3
              className="text-2xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-playfair-var), serif",
                color: "#FAF7F2",
              }}
            >
              The Plush Stories
              <span className="text-sm align-super" style={{ color: "#C4916E" }}>
                &trade;
              </span>
            </h3>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "#8B8680" }}
            >
              Premium plush toys crafted with love. Perfect for gifting,
              collecting, and creating memories that last a lifetime.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#C4916E" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[#C4916E]"
                    style={{ color: "#8B8680" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#C4916E" }}
              >
                Get in Touch
              </h4>
              <a
                href="tel:+917814550583"
                className="block text-sm transition-colors duration-200 hover:text-[#C4916E]"
                style={{ color: "#8B8680" }}
              >
                +91 78145 50583
              </a>
            </div>

            <div className="space-y-4">
              <h4
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#C4916E" }}
              >
                Follow Us
              </h4>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: "#3D3D3D", color: "#8B8680" }}
                    aria-label={social.label}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C4916E";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#3D3D3D";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#8B8680";
                    }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div
          className="mt-14 pt-8"
          style={{ borderTop: "1px solid #3D3D3D" }}
        >
          <p className="text-center text-xs" style={{ color: "#8B8680" }}>
            &copy; {new Date().getFullYear()} The Plush Stories&trade;. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
