import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GroupProvider } from "../context/GroupContext";

import GroupHeader from "../components/groups/GroupHeader";
import SummaryCards from "../components/dashboard/SummaryCards";
import AISummaryCard from "../components/dashboard/AISummaryCard";

/* ================= PAGE STAGGER ================= */

const pageContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.35,
    },
  },
};

const pageItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const GroupDashboard = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  return (
    <GroupProvider groupId={groupId}>
      <div className="min-h-screen bg-black px-4 sm:px-6 py-10">
        {/* GLASS CONTAINER */}
        <motion.div
          variants={pageContainer}
          initial="hidden"
          animate="show"
          className="
            relative mx-auto max-w-7xl
            rounded-[2.75rem]
            border border-white/10
            bg-white/[0.015]
            backdrop-blur-[22px]
            px-6 sm:px-10 py-10
            space-y-10
            overflow-hidden
          "
        >
          {/* ambient glow */}
          <div
            className="pointer-events-none absolute inset-0
                       bg-gradient-to-br
                       from-indigo-500/10
                       via-purple-500/5
                       to-transparent"
          />

          <div className="relative space-y-10">
            {/* 1️⃣ HEADER */}
            <motion.div variants={pageItem}>
              <GroupHeader />
            </motion.div>

            {/* 2️⃣ SUMMARY */}
            <motion.div variants={pageItem}>
              <SummaryCards />
            </motion.div>

            {/* 3️⃣ AI SUMMARY */}
            <motion.div variants={pageItem}>
              <AISummaryCard />
            </motion.div>

            {/* 4️⃣ CTA BUTTON — LAST */}
            <motion.div
              variants={pageItem}
              className="pt-6 flex justify-center"
            >
              <button
                onClick={() =>
                  navigate(`/groups/${groupId}/participants`)
                }
                className="
                  rounded-full px-8 py-3
                  text-sm font-semibold
                  border border-white/20
                  text-white
                  bg-white/[0.03]
                  backdrop-blur-xl
                  hover:bg-white/[0.06]
                  transition
                "
              >
                View Participants & Balances →
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </GroupProvider>
  );
};

export default GroupDashboard;


/* <GroupContributions /> <ExpenseFilters /> <ExpenseList /> <Ledger/> <Settlement /> */