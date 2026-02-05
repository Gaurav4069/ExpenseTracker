import { useState } from "react";
import { motion } from "framer-motion";
import { useGroup } from "../../context/GroupContext";
import { getAISummary } from "../../api/aiApi";

/* ================= ANIMATIONS ================= */

// Card entry
const cardAnim = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

// Inner stagger
const contentContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const contentItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const AISummaryCard = () => {
  const { summary } = useGroup();
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!summary) return;

    setLoading(true);
    setAiSummary("");
    setHasGenerated(true);

    try {
      const res = await getAISummary({
        totalSpent: summary.totalSpent,
        balances: summary.balances,
      });
      setAiSummary(res.data.summary);
    } catch {
      setAiSummary(
        "AI is currently unavailable. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={cardAnim}
      className="
        relative overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/[0.02]
        backdrop-blur-2xl
        px-7 py-6
      "
    >
      {/* AI accent line */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px]
                      bg-gradient-to-b from-indigo-400/60 to-purple-400/20" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0
                      bg-gradient-to-br
                      from-indigo-500/15 via-purple-500/8
                      to-transparent" />

      {/* STAGGERED CONTENT */}
      <motion.div
        variants={contentContainer}
        initial="hidden"
        animate="show"
        className="relative"
      >
        {/* Header */}
        <motion.div variants={contentItem} className="mb-4">
          <p className="text-xs tracking-[0.3em] text-indigo-300">
            AI INSIGHTS
          </p>
          <h3 className="mt-1 text-sm font-semibold text-gray-200">
            Expense Summary
          </h3>
        </motion.div>

        {/* Content */}
        <motion.div variants={contentItem}>
          {loading ? (
            <p className="text-sm italic text-gray-400 animate-pulse">
              Generating insights…
            </p>
          ) : aiSummary ? (
            <p className="text-sm leading-relaxed text-gray-300">
              {aiSummary}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Generate an AI-powered summary to understand spending
              patterns and settlements at a glance.
            </p>
          )}
        </motion.div>

        {/* Button */}
        <motion.div variants={contentItem} className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={loading || !summary}
            className="
              inline-flex items-center justify-center
              rounded-full px-6 py-2.5
              text-xs font-semibold tracking-wide
              text-indigo-200
              border border-indigo-500/30
              bg-indigo-500/10
              hover:bg-indigo-500/20
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
            "
          >
            {hasGenerated
              ? "Regenerate AI Summary"
              : "Generate AI Summary"}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AISummaryCard;
