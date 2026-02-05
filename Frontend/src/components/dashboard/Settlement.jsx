import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGroup } from "../../context/GroupContext";
import { explainSettlementAI } from "../../api/aiApi";

const Settlement = () => {
  const { settlements } = useGroup();
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleExplain = async () => {
    if (!settlements || settlements.length === 0) return;

    setLoading(true);
    setExplanation("");
    setHasGenerated(true);

    try {
      const res = await explainSettlementAI({ settlements });
      setExplanation(res.data.explanation);
    } catch {
      setExplanation(
        "AI is currently unavailable. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative rounded-3xl
        border border-white/10
        bg-white/[0.02]
        backdrop-blur-2xl
        px-6 py-6
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
        <h3 className="mb-5 text-sm font-semibold tracking-[0.35em] text-gray-300">
          SETTLEMENTS
        </h3>

        {/* SETTLEMENT LIST */}
        {settlements.length === 0 ? (
          <p className="text-sm italic text-gray-400">
            All settled 🎉
          </p>
        ) : (
          <ul className="space-y-2">
            {settlements.map((s, i) => (
              <li
                key={i}
                className="
                  flex items-center justify-between
                  rounded-xl
                  bg-white/[0.04]
                  px-4 py-2.5
                "
              >
                <span className="text-sm text-gray-200">
                  <span className="font-medium">{s.fromName}</span>{" "}
                  pays{" "}
                  <span className="font-medium">{s.toName}</span>
                </span>

                <span className="text-sm font-semibold text-gray-200">
                  ₹{s.amount}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* AI EXPLANATION */}
        {settlements.length > 0 && (
          <div
            className="
              mt-6 rounded-2xl
              border border-indigo-500/20
              bg-indigo-500/[0.08]
              px-5 py-4
            "
          >
            {/* AI HEADER */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.35em] text-indigo-300">
                AI EXPLANATION
              </p>

              <button
                onClick={handleExplain}
                disabled={loading}
                className="
                  rounded-full px-4 py-1.5
                  text-xs font-semibold
                  text-indigo-300
                  border border-indigo-500/30
                  bg-indigo-500/[0.15]
                  hover:bg-indigo-500/[0.25]
                  disabled:opacity-50
                  transition
                "
              >
                {hasGenerated ? "Regenerate" : "Explain with AI"}
              </button>
            </div>

            {/* AI CONTENT */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.p
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm italic text-gray-400"
                >
                  Analyzing settlements…
                </motion.p>
              ) : explanation ? (
                <motion.p
                  key="result"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm italic leading-relaxed text-gray-200"
                >
                  {explanation}
                </motion.p>
              ) : (
                <p className="text-sm italic text-gray-500">
                  Let AI explain the most efficient way to settle balances.
                </p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settlement;
