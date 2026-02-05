import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GroupProvider } from "../../context/GroupContext";

import ExpenseFilters from "../expenses/ExpenseFilters";
import ExpenseList from "../expenses/ExpenseList";
import Ledger from "../dashboard/Ledger";
import Settlement from "../dashboard/Settlement";

/* ================= SCROLL ANIMATION ================= */

const sectionItem = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1], // 👈 smooth cinematic ease
    },
  },
};

const viewportConfig = {
  once: false,          // 👈 repeat on scroll
  margin: "-120px",     // 👈 delayed trigger = smoother
};

const GroupExpensesPage = () => {
  const { groupId } = useParams();

  return (
    <GroupProvider groupId={groupId}>
      <div className="min-h-screen bg-black px-4 sm:px-6 py-10">
        {/* GLASS CONTAINER */}
        <div
          className="
            relative mx-auto max-w-6xl
            rounded-[2.5rem]
            border border-white/10
            bg-white/[0.015]
            backdrop-blur-[22px]
            px-6 sm:px-10 py-10
            space-y-24
          "
        >
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute inset-0
                       bg-gradient-to-br
                       from-indigo-500/10
                       via-purple-500/5
                       to-transparent"
          />

          <div className="relative space-y-24">
            {/* 1️⃣ FILTERS */}
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
            >
              <ExpenseFilters />
            </motion.div>

            {/* 2️⃣ EXPENSE LIST */}
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
            >
              <ExpenseList />
            </motion.div>

            {/* 3️⃣ LEDGER */}
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
            >
              <Ledger />
            </motion.div>

            {/* 4️⃣ SETTLEMENT */}
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
            >
              <Settlement />
            </motion.div>
          </div>
        </div>
      </div>
    </GroupProvider>
  );
};

export default GroupExpensesPage;
