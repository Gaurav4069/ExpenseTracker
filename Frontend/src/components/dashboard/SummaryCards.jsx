import { motion } from "framer-motion";
import { useGroup } from "../../context/GroupContext";

/* ================= ANIMATION ================= */

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardAnim = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const SummaryCards = () => {
  const { summary } = useGroup();
  if (!summary) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-5"
    >
      <Card
        title="TOTAL SPENT"
        value={summary.totalSpent}
        accent="blue"
      />
      <Card
        title="YOU OWE"
        value={getOwe(summary.balances)}
        accent="red"
      />
      <Card
        title="YOU GET"
        value={getGet(summary.balances)}
        accent="green"
      />
    </motion.div>
  );
};

const getOwe = (balances) =>
  Math.abs(balances.find((b) => b.balance < 0)?.balance || 0);

const getGet = (balances) =>
  balances.find((b) => b.balance > 0)?.balance || 0;

/* ================= CARD ================= */

const accentMap = {
  blue: "from-blue-500/20 via-blue-500/10 to-transparent text-blue-300",
  red: "from-red-500/20 via-red-500/10 to-transparent text-red-300",
  green: "from-green-500/20 via-green-500/10 to-transparent text-green-300",
};

const Card = ({ title, value, accent }) => {
  return (
    <motion.div
      variants={cardAnim}
      className="
        relative overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/[0.02]              /* 👈 ultra glass */
        backdrop-blur-2xl
        px-6 py-6
        min-h-[110px]
      "
    >
      {/* Soft accent glow */}
      <div
        className={`pointer-events-none absolute inset-0
                    bg-gradient-to-br ${accentMap[accent]} opacity-50`}
      />

      <div className="relative">
        <p className="text-xs tracking-[0.25em] text-gray-400 mb-3">
          {title}
        </p>

        <p className="text-3xl font-semibold tracking-tight">
          ₹{value}
        </p>
      </div>
    </motion.div>
  );
};

export default SummaryCards;
