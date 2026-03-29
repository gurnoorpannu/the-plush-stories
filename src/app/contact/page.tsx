"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaPhone, FaInstagram, FaEnvelope, FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";

const contactCards = [
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    detail: "+91 78145 50583",
    buttonText: "Chat with us",
    href: "https://wa.me/917814550583",
    color: "#25D366",
  },
  {
    icon: FaPhone,
    title: "Phone",
    detail: "+91 78145 50583",
    buttonText: "Call Us",
    href: "tel:+917814550583",
    color: "#C4916E",
  },
  {
    icon: FaInstagram,
    title: "Instagram",
    detail: "@theplushstories",
    buttonText: "Follow Us",
    href: "https://www.instagram.com/theplushstories",
    color: "#E1306C",
  },
  {
    icon: FaEnvelope,
    title: "Email",
    detail: "Coming Soon",
    buttonText: "Coming Soon",
    href: "#",
    color: "#8B7355",
    disabled: true,
  },
];

const faqs = [
  {
    question: "Where can I buy your toys?",
    answer:
      "Our toys are available on Amazon, Flipkart, and other major marketplaces. Visit our Products page to find direct links.",
  },
  {
    question: "Do you offer bulk/wholesale orders?",
    answer:
      "Yes! Contact us via WhatsApp for wholesale pricing and bulk orders.",
  },
  {
    question: "Are your toys safe for children?",
    answer:
      "Absolutely! All our plush toys are made with child-safe, non-toxic materials and meet safety standards.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "We're working on adding gift wrapping options. Stay tuned!",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#F0EBE3] rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-[#F0EBE3]/50 transition-colors"
      >
        <span className="font-medium text-[#2D2D2D] text-base md:text-lg pr-4">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#C4916E] flex-shrink-0"
        >
          <FaChevronDown />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-[#8B8680] leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message feature coming soon!", {
      icon: "📬",
      style: {
        background: "#FFFFFF",
        color: "#2D2D2D",
        border: "1px solid #F0EBE3",
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h1
            className="font-[family-name:var(--font-playfair-var)] text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2D2D] mb-4"
          >
            Get in Touch
          </h1>
          <p className="text-[#8B8680] text-lg md:text-xl max-w-md mx-auto">
            We&apos;d love to hear from you
          </p>
        </motion.div>
      </section>

      {/* Contact Cards Grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#F0EBE3] hover:shadow-md transition-shadow"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="text-2xl" style={{ color: card.color }} />
                </div>
                <h3 className="font-semibold text-[#2D2D2D] text-lg mb-1">
                  {card.title}
                </h3>
                <p className="text-[#8B8680] text-sm mb-4">{card.detail}</p>
                <a
                  href={card.disabled ? undefined : card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    card.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={`inline-block px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    card.disabled
                      ? "bg-[#F0EBE3] text-[#8B8680] cursor-not-allowed"
                      : "text-white hover:opacity-90 hover:scale-105"
                  }`}
                  style={
                    card.disabled
                      ? undefined
                      : { backgroundColor: card.color }
                  }
                >
                  {card.buttonText}
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[family-name:var(--font-playfair-var)] text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-3">
            Send Us a Message
          </h2>
          <p className="text-[#8B8680] text-center mb-10">
            Have a question or feedback? Fill out the form below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-[#F0EBE3] space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#2D2D2D] mb-1.5"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#F0EBE3] bg-[#FAF7F2] text-[#2D2D2D] placeholder-[#8B8680]/60 focus:outline-none focus:ring-2 focus:ring-[#C4916E]/40 focus:border-[#C4916E] transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2D2D2D] mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#F0EBE3] bg-[#FAF7F2] text-[#2D2D2D] placeholder-[#8B8680]/60 focus:outline-none focus:ring-2 focus:ring-[#C4916E]/40 focus:border-[#C4916E] transition-all"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#2D2D2D] mb-1.5"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 rounded-xl border border-[#F0EBE3] bg-[#FAF7F2] text-[#2D2D2D] placeholder-[#8B8680]/60 focus:outline-none focus:ring-2 focus:ring-[#C4916E]/40 focus:border-[#C4916E] transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#2D2D2D] mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-[#F0EBE3] bg-[#FAF7F2] text-[#2D2D2D] placeholder-[#8B8680]/60 focus:outline-none focus:ring-2 focus:ring-[#C4916E]/40 focus:border-[#C4916E] transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#C4916E] text-white font-semibold text-base hover:bg-[#b07d5e] active:scale-[0.98] transition-all"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-2xl mx-auto px-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[family-name:var(--font-playfair-var)] text-3xl md:text-4xl font-bold text-[#2D2D2D] text-center mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-[#8B8680] text-center mb-10">
            Quick answers to common questions
          </p>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FAQItem question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
