"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

export default function ThreeStepProcess() {
  const steps = [
    { number: 1, title: "Register", text: "Choose your role category (Individual, Cooperative, Government) and create your profile" },
    { number: 2, title: "Post Needs", text: "Submit requests, form investor groups, and browse opportunities that match your criteria" },
    { number: 3, title: "Get Matched", text: "Connect with verified partners, join investor groups, and manage large-scale joint ventures" },
  ];

  return (
    <section className="w-full py-16 bg-gray-50 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center"
      >
        Simple 3-Step Process
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-gray-700 text-base sm:text-lg mb-10 text-center max-w-2xl"
      >
        Get matched with the right partners in minutes, not months
      </motion.p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            custom={i}                 // passes i to the variant function
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow"
          >
            <div className="relative">
              <span className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-yellow-400 opacity-25 blur-lg animate-pulse" />
              <div className="relative bg-gray-900 text-yellow-400 font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-full mb-4 border-4 border-yellow-400">
                {step.number}
              </div>
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">{step.title}</h3>
            <p className="text-gray-700 text-center">{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
