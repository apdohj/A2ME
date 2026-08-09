"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is boosting safe for my account?",
    answer:
      "Absolutely! We use VPN protection that matches your region, play at natural hours, and follow strict security protocols. In our 5+ years of operation, we maintain a 99.9% safety rate with zero permanent bans.",
  },
  {
    question: "How long does the boosting process take?",
    answer:
      "It depends on the rank difference and game. Typically, you can expect 1-3 divisions per day. With Express delivery, we prioritize your order for even faster completion. You'll see an estimated ETA in the calculator.",
  },
  {
    question: "Can I play on my account during the boost?",
    answer:
      "Yes! You can pause your order at any time from your dashboard and resume it whenever you're ready. Just click the Pause button and the booster will stop immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept InstaPay, Vodafone Cash, Orange Cash and other regional payment methods. All transactions are encrypted and secure.",
  },
  {
    question: "How do I communicate with my booster?",
    answer:
      "Once your order starts, you'll have access to a private encrypted chat room in your dashboard where you can communicate directly with your assigned booster in real-time.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "We offer a full money-back guarantee if we can't complete your order. Our customer support team is available 24/7 to handle any issues or concerns you may have.",
  },
  {
    question: "Can I choose a specific booster?",
    answer:
      "Yes! You can browse our Top Boosters section and select a specific pro player. However, for the fastest start time, we recommend letting our system assign the best available booster.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-slate-400">
            Everything you need to know about our services.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  className="w-5 h-5 text-neon-blue shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
