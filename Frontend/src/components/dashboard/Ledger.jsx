import { motion } from "framer-motion";
import { useGroup } from "../../context/GroupContext";

/* ================= ANIMATION ================= */

const ledgerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const Ledger = () => {
  const { expenses } = useGroup();

  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-sm italic text-gray-400">
        No transactions yet
      </p>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      {expenses.map((e) => (
        <motion.div
          key={e._id}
          variants={ledgerItem}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="
            relative rounded-3xl
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            px-6 py-5
          "
        >
          {/* subtle glow */}
          <div
            className="pointer-events-none absolute inset-0
                       bg-gradient-to-br
                       from-indigo-500/10
                       via-purple-500/5
                       to-transparent"
          />

          <div className="relative">
            {/* HEADER */}
            <div className="mb-1 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-200">
                  {e.description}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Paid by{" "}
                  <span className="font-medium text-gray-300">
                    {e.payer?.name}
                  </span>{" "}
                  • {new Date(e.date).toLocaleDateString()}
                </p>
              </div>

              <span className="text-lg font-bold text-gray-200">
                ₹{e.amount}
              </span>
            </div>

            {/* SPLITS */}
            <div className="mt-4 space-y-2">
              {e.splits.map((s, i) => (
                <div
                  key={i}
                  className="
                    flex items-center justify-between
                    rounded-xl
                    bg-white/[0.04]
                    px-4 py-2
                  "
                >
                  <span className="text-sm text-gray-300">
                    {s.participantId?.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-200">
                    ₹{s.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Ledger;
