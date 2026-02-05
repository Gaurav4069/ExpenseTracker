import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GroupProvider } from "../../context/GroupContext";

import Participants from "./Participants";
import BalanceTable from "../dashboard/BalanceTable";
import GroupContributions from "./GroupContributions";

/* ================= SECTION ANIMATION ================= */

const sectionItem = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const GroupParticipantsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();


  return (
    <GroupProvider groupId={groupId}>
      <div className="min-h-screen bg-black px-4 sm:px-6 py-10">
        {/* GLASS CONTAINER (NO MOTION HERE) */}
        <div
          className="
            relative mx-auto max-w-6xl
            rounded-[2.5rem]
            border border-white/10
            bg-white/[0.015]
            backdrop-blur-[22px]
            px-6 sm:px-10 py-10
            space-y-20
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

          <div className="relative space-y-20">
            {/* PARTICIPANTS — SCROLL TRIGGERED */}
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: false,
                amount: 0.1,
              }}
            >
              <Participants />
            </motion.div>

            {/* BALANCE TABLE — AFTER SCROLL */}
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: false,
                amount: 0.1,
              }}
            >
              <BalanceTable />
            </motion.div>

            {/* CONTRIBUTIONS — LAST */}
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: false,
                amount: 0.1,
              }}
            >
              <GroupContributions />
            </motion.div>
            <motion.div
              variants={sectionItem}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: false,
                amount: 0.1,
              }}
              className="pt-6 flex justify-center"
            >
              <button
                onClick={() =>
                  navigate(`/groups/${groupId}/expenses`)
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
                View Expenses →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </GroupProvider>
  );
};

export default GroupParticipantsPage;
