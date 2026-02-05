import { motion } from "framer-motion";
import { useGroup } from "../../context/GroupContext";

/* ================= ANIMATIONS ================= */

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const GroupContributions = () => {
  const { balances } = useGroup();

  if (!balances || balances.length === 0) {
    return (
      <motion.p
        variants={cardAnim}
        initial="hidden"
        animate="show"
        className="text-sm italic text-gray-500"
      >
        No contributions yet
      </motion.p>
    );
  }

  return (
    <motion.div
      variants={cardAnim}
      initial="hidden"
      animate="show"
      className="
        relative rounded-3xl
        border border-white/10
        bg-white/[0.02]
        backdrop-blur-2xl
        px-7 py-6
        overflow-hidden
      "
    >
      {/* Soft glow */}
      <div
        className="pointer-events-none absolute inset-0
                   bg-gradient-to-br
                   from-indigo-500/10
                   via-purple-500/5
                   to-transparent"
      />

      <div className="relative">
        {/* Header */}
        <h3 className="mb-6 text-sm font-semibold tracking-[0.3em] text-gray-300">
          CONTRIBUTIONS
        </h3>

        {/* List */}
        <motion.ul
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {balances.map((b) => {
            const isPositive = b.balance >= 0;

            return (
              <motion.li
                key={b.participantId || b.name}
                variants={listItem}
                className="
                  flex items-center justify-between
                  rounded-xl
                  bg-white/[0.03]
                  px-4 py-3
                  hover:bg-white/[0.05]
                  transition
                "
              >
                <span className="text-sm text-gray-200">
                  {b.name}
                </span>

                <span
                  className={`text-sm font-semibold ${
                    isPositive
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {isPositive ? "Gets" : "Owes"} ₹
                  {Math.abs(b.balance)}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default GroupContributions;
