"use client";

import { FiMapPin, FiBriefcase, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.3,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

export default function Path() {
  const cards = [
    {
      icon: <FiMapPin className="text-white text-2xl" />,
      bg: "bg-green-50",
      btnBg: "bg-yellow-500 hover:bg-yellow-600",
      textColor: "text-yellow-500",
      title: "I'm a Landowner",
      description:
        "Individual, cooperative, or government entity with land seeking partners to unlock development potential. Connect with verified investors and developer groups.",
      items: [
        "Connect with individual & group investors",
        "Retain ownership while building",
        "Professional project management",
      ],
      link: "#landowner",
      linkText: "Join as Landowner →",
    },
    {
      icon: <FiBriefcase className="text-white text-2xl" />,
      bg: "bg-gray-100",
      btnBg: "bg-gray-900 hover:bg-yellow-500",
      textColor: "text-gray-900",
      title: "I'm an Investor/Developer",
      description:
        "Individual investor, investment group, cooperative, or government entity with capital seeking land. Form investor groups for larger projects and shared financing.",
      items: [
        "Access vetted land opportunities",
        "Form or join investor groups",
        "Streamlined partnership process",
      ],
      link: "#investor",
      linkText: "Join as Investor →",
    },
    {
      icon: <FiUsers className="text-white text-2xl" />,
      bg: "bg-yellow-100",
      btnBg: "bg-yellow-500 hover:bg-yellow-600",
      textColor: "text-yellow-500",
      title: "I'm a Mandate",
      description:
        "Individual, firm, or organization facilitating deals between landowners and investor groups. Specialize in large-scale government and cooperative projects.",
      items: [
        "Access to both sides of deals",
        "Competitive commission structure",
        "Professional support system",
      ],
      link: "#mandate",
      linkText: "Join as Mandate →",
    },
  ];

  return (
    <section className="w-full flex flex-col items-center mt-16 mb-10 px-2">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
        Choose Your Path
      </h2>
      <p className="text-gray-700 text-base sm:text-lg mb-10 text-center max-w-2xl">
        Whether you own land, have capital, or facilitate deals, we have the perfect solution for you.
      </p>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl justify-center">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`${card.bg} rounded-xl p-7 flex-1 max-w-sm flex flex-col items-start shadow`}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
          >
            <div className="bg-yellow-500 rounded-lg p-3 mb-4">
              {card.icon}
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-700 mb-4">{card.description}</p>

            <ul className="mb-6 space-y-2 text-gray-700">
              {card.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={card.textColor}>&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={card.link}
              className={`${card.btnBg} text-white font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2`}
            >
              {card.linkText}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}