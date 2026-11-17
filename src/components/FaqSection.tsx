import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FOOTER_FAQS } from '../data/editorialData';
import { Reveal } from './MotionPrimitives';

export const FaqSection: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="faq-section-heading"
      className="bg-white border-t border-[#E2E8F0] text-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <h2
                id="faq-section-heading"
                className="text-xl sm:text-2xl font-bold text-[#0A0A0A]"
              >
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                Clear answers regarding feasibility, confidentiality, and realistic recovery
                expectations before you engage our analysts.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-3">
              {FOOTER_FAQS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={faq.question}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-white border-[#D4AF37]/70 shadow-[0_10px_28px_-10px_rgba(10,10,10,0.08)]'
                        : 'bg-[#F8FAFC]/80 border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1] hover:shadow-[0_6px_18px_-8px_rgba(10,10,10,0.06)]'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-semibold text-[#0A0A0A] cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 ml-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#946E00]' : 'text-[#475569]'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="px-6 pb-5 text-sm text-[#475569] leading-relaxed border-t border-[#E2E8F0]/60 pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
