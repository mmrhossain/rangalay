"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus, Search, HelpCircle } from "lucide-react";

const FAQPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "About Raangalay", "Orders & Shipping", "Customization", "Sustainability"];

  const faqs = [
    {
      category: "About Raangalay",
      question: "What does the name 'Raangalay' signify?",
      answer: "Raangalay is derived from 'Rang' (Color) and 'Alay' (House). It represents a sanctuary where color is celebrated as a universal language, connecting modern lifestyle with our deep cultural roots."
    },
    {
      category: "Sustainability",
      question: "What materials do you use in your products?",
      answer: "We are committed to sylvan craftsmanship. We primarily use handwoven cloth, organic fibers, bamboo, wood, and clay. Every product is handcrafted-there are no ready-made components in our workshop."
    },
    {
      category: "About Raangalay",
      question: "What is the 'Jongla' signature?",
      answer: "Jongla is our protest and our pride. Named after a wild flower in the Garo Hills, it represents the irrepressible brightness of the forest. We reclaim the term to celebrate indigenous beauty over urban stereotypes."
    },
    {
      category: "Customization",
      question: "Can I customize a design to fit my personality?",
      answer: "Yes. Raangalay is about personal expression. We offer customization services so that our heritage-inspired pieces align perfectly with your individual style and needs."
    },
    {
      category: "Orders & Shipping",
      question: "Do you ship internationally?",
      answer: "Absolutely. Our vision is to take Bangladeshi craftsmanship beyond national borders. We ship our festive and ethnic experiences to patrons worldwide."
    },
    {
      category: "Sustainability",
      question: "How do you support the local community?",
      answer: "We empower nearly 60 artisans, focusing on rural women, indigenous communities, and students. By providing economic freedom and a platform for their natural education, we keep our heritage alive."
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20 md:pb-24">
      <section className="pt-20 md:pt-28 pb-12 md:pb-16 bg-white border-b border-slate-100 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tight sm:tracking-tighter uppercase mb-6">
              How can we <span className="text-primary italic font-serif text-4xl md:text-8xl block md:inline">Help?</span>
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm md:text-base">
              Find answers to common questions about our heritage, our craft, and your journey with the House of Color.
            </p>
          </motion.div>

          <div className="mt-8 md:mt-12 max-w-2xl mx-auto relative">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a topic (e.g., 'Jongla' or 'Shipping')"
              className="w-full pl-12 md:pl-14 pr-4 md:pr-6 h-12 md:h-14 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm text-sm md:text-base"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 md:px-8 h-10 md:h-11 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.08em] md:tracking-widest transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-teal-600/20"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 md:py-20">
              <HelpCircle className="mx-auto w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No results found for your search.</p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="container mt-8 md:mt-12">
        <div className="bg-slate-900 rounded-[1.5rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4">Still have questions?</h3>
            <p className="text-slate-400 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
              If you could not find what you were looking for, our team is ready to assist you personally.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button className="bg-primary hover:bg-primary/80 text-white px-6 md:px-10 h-11 md:h-12 rounded-full font-black uppercase text-[10px] tracking-[0.08em] md:tracking-widest transition-all">
                Contact Support
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 md:px-10 h-11 md:h-12 rounded-full font-black uppercase text-[10px] tracking-[0.08em] md:tracking-widest transition-all backdrop-blur-md">
                WhatsApp Us
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        </div>
      </section>
    </div>
  );
};

const FAQItem = ({ faq }: { faq: { question: string; answer: string } }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
      className={`border transition-all duration-300 ${isOpen ? "bg-white border-primary shadow-xl rounded-[1.25rem] md:rounded-[2rem]" : "bg-transparent border-slate-200 rounded-[1rem] md:rounded-[1.5rem]"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 md:px-8 py-4 md:py-6 min-h-11 flex items-center justify-between text-left"
      >
        <span className={`text-base md:text-lg font-bold tracking-tight ${isOpen ? "text-teal-900" : "text-slate-800"}`}>
          {faq.question}
        </span>
        <div className={`flex-shrink-0 ml-3 md:ml-4 p-2 rounded-full transition-colors ${isOpen ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400"}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-8 pb-5 md:pb-8 text-slate-500 leading-relaxed font-medium text-sm md:text-base border-t border-slate-50 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQPage;
