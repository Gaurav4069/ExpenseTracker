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

const tableBody = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const rowAnim = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const BalanceTable = () => {
  const { balances } = useGroup();

  if (!balances || balances.length === 0) {
    return (
      <motion.p
        variants={cardAnim}
        initial="hidden"
        animate="show"
        className="text-sm italic text-gray-500"
      >
        No balance data available
      </motion.p>
    );
  }

  return (
    <motion.div
      variants={cardAnim}
      initial="hidden"
      animate="show"
      className="
        relative overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/[0.02]
        backdrop-blur-2xl
      "
    >
      {/* Soft glow */}
      <div className="pointer-events-none absolute inset-0
                      bg-gradient-to-br
                      from-indigo-500/10
                      via-purple-500/5
                      to-transparent" />

      <div className="relative">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-sm font-semibold tracking-[0.3em] text-gray-300">
            BALANCES
          </h3>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-widest text-gray-400">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-widest text-gray-400">
                STATUS
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold tracking-widest text-gray-400">
                AMOUNT
              </th>
            </tr>
          </thead>

          <motion.tbody
            variants={tableBody}
            initial="hidden"
            animate="show"
          >
            {balances.map((b) => {
              const isPositive = b.balance >= 0;

              return (
                <motion.tr
                  key={b.participantId || b.name}
                  variants={rowAnim}
                  className="
                    border-b border-white/5 last:border-none
                    hover:bg-white/[0.04] transition
                  "
                >
                  <td className="px-6 py-3 text-gray-200">
                    {b.name}
                  </td>

                  <td
                    className={`px-6 py-3 text-sm font-medium ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? "Gets" : "Owes"}
                  </td>

                  <td
                    className={`px-6 py-3 text-right font-semibold ${
                      isPositive ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    ₹{Math.abs(b.balance)}
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BalanceTable;
