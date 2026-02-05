import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

/* ================= CARD + LIST VARIANTS ================= */

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const getCardVariant = (isMobile) => ({
  hiddenLeft: {
    opacity: 0,
    x: isMobile ? 0 : -90,
    y: isMobile ? 40 : 24,
  },
  hiddenRight: {
    opacity: 0,
    x: isMobile ? 0 : 90,
    y: isMobile ? 40 : 24,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 55,
      damping: 22,
      mass: 1.1,
    },
  },
});

const emptyVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ================= TYPEWRITER VARIANTS ================= */

const titleContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const titleLetter = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut" },
  },
};

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  /* 🔥 KEY FOR INFINITE TYPEWRITER */
  const [titleKey, setTitleKey] = useState(0);

  const navigate = useNavigate();

  /* ================= RESPONSIVE CHECK ================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================= TYPEWRITER LOOP ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleKey((k) => k + 1); // 👈 force re-mount
    }, 3500); // typing + pause

    return () => clearInterval(interval);
  }, []);

  /* ================= FETCH GROUPS ================= */
  const fetchGroups = async () => {
    try {
      const res = await axios.get("/groups");
      setGroups(res.data);
    } catch {
      showError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  /* ================= CREATE GROUP ================= */
  const createGroup = async () => {
    if (!name.trim()) {
      showError("Group name required");
      return;
    }

    try {
      const res = await axios.post("/groups", {
        name,
        participants: [],
      });

      showSuccess("Group created");
      setName("");
      navigate(`/groups/${res.data._id}`);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create group");
    }
  };

  const cardVariant = getCardVariant(isMobile);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">

        {/* ================= YOUR GROUPS (INFINITE TYPEWRITER) ================= */}
        <motion.h2
          key={titleKey}   // 👈 IMPORTANT
          className="text-2xl sm:text-3xl font-bold mb-12 text-center tracking-widest"
          variants={titleContainer}
          initial="hidden"
          animate="show"
        >
          {"YOUR GROUPS".split("").map((char, index) => (
            <motion.span
              key={index}
              variants={titleLetter}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        {/* ================= CREATE GROUP ================= */}
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-16">
          <input
            className="
              flex-1 rounded-lg
              bg-white/5 border border-white/10
              px-4 py-3 text-sm
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-white/20
            "
            placeholder="New group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={createGroup}
            className="
              rounded-lg px-6 py-3
              font-semibold bg-white text-black
              hover:scale-105 transition
            "
          >
            Create
          </button>
        </div>

        {/* ================= SKELETON LOADING ================= */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white/5
                           border border-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && groups.length === 0 && (
          <motion.div
            variants={emptyVariant}
            initial="hidden"
            animate="show"
            className="text-center text-gray-400 mt-24 px-4"
          >
            <p className="text-lg mb-2">No groups yet 🫤</p>
            <p className="text-sm">
              Create your first group to start tracking expenses
            </p>
          </motion.div>
        )}

        {/* ================= GROUP CARDS ================= */}
        {!loading && groups.length > 0 && (
          <motion.ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
          >
            {groups.map((g, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.li
                  key={g._id}
                  variants={cardVariant}
                  initial={isLeft ? "hiddenLeft" : "hiddenRight"}
                  whileInView="show"
                  viewport={{ once: false, amount: 0.45 }}

                  whileHover={
                    !isMobile
                      ? {
                          y: -4,
                          scale: 1.015,
                          transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          },
                        }
                      : {}
                  }

                  onClick={() => navigate(`/groups/${g._id}`)}
                  className="
                    cursor-pointer
                    rounded-2xl p-5 sm:p-6
                    bg-white/5 backdrop-blur-xl
                    border border-white/10
                    hover:border-white/30
                    hover:shadow-[0_0_28px_rgba(255,255,255,0.08)]
                    transition
                  "
                >
                  <div className="text-base sm:text-lg font-semibold">
                    {g.name}
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    Total Spent: ₹{g.totalSpent || 0}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}

        <div className="h-32" />
      </div>
    </div>
  );
};

export default Groups;
