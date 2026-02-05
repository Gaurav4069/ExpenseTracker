import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check, X } from "lucide-react";
import api from "../../api/axios";
import { showSuccess, showError } from "../../utils/toast";
import { useGroup } from "../../context/GroupContext";

/* ================= HERO ANIMATION ================= */

const heroVariant = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

const GroupHeader = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { summary, refreshGroup } = useGroup();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(summary?.groupName || "");

  useEffect(() => {
    if (summary?.groupName) {
      setName(summary.groupName);
    }
  }, [summary]);

  if (!summary) return null;

  const updateName = async () => {
    if (!name.trim()) {
      showError("Group name required");
      return;
    }

    try {
      await api.put(`/groups/${groupId}`, { name });
      showSuccess("Group name updated");
      setEditing(false);
      refreshGroup();
    } catch (err) {
      showError(err.response?.data?.message || "Update failed");
    }
  };

  const deleteGroup = async () => {
    if (!confirm("Delete this group permanently?")) return;

    try {
      await api.delete(`/groups/${groupId}`);
      showSuccess("Group deleted");
      navigate("/groups");
    } catch (err) {
      showError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <motion.section
      variants={heroVariant}
      initial="hidden"
      animate="show"
      className="
        relative mb-14
        min-h-[240px]
        rounded-[2.5rem]
        border border-white/10
        bg-transparent
        backdrop-blur-3xl
        px-10 py-16
        overflow-hidden
      "
    >
      {/* Ultra-soft glow (no solid bg) */}
      <div
        className="pointer-events-none absolute inset-0 bg-transparent"
      />

      <div className="relative max-w-4xl">
        {/* EDIT MODE */}
        {editing ? (
          <div className="flex flex-wrap items-center gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="
                w-full max-w-md
                rounded-2xl
                border border-white/20
                bg-transparent
                px-6 py-3 text-base
                focus:outline-none focus:border-white/40
              "
            />

            <button
              onClick={updateName}
              className="
                flex items-center gap-2
                rounded-full bg-white px-6 py-3
                text-sm font-semibold text-black
                hover:bg-gray-200 transition
              "
            >
              <Check size={16} />
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setName(summary.groupName);
              }}
              className="
                flex items-center gap-2
                rounded-full border border-white/20
                px-6 py-3 text-sm
                hover:bg-white/5 transition
              "
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        ) : (
          <>
            {/* HERO TITLE */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl
                           font-extrabold tracking-tight">
              {summary.groupName}
            </h1>

            {/* SUBTITLE */}
            <p className="mt-5 max-w-xl
                          text-sm sm:text-base
                          text-gray-400">
              Track expenses, understand settlements, and manage this group
              effortlessly.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => setEditing(true)}
                className="
                  flex items-center gap-2
                  rounded-full px-7 py-3
                  text-sm font-semibold
                  bg-white text-black
                  hover:scale-105 transition
                "
              >
                <Pencil size={16} />
                Edit Group
              </button>

              <button
                onClick={deleteGroup}
                className="
                  flex items-center gap-2
                  rounded-full px-7 py-3
                  text-sm font-semibold
                  border border-white/20
                  text-white
                  hover:bg-white/10 transition
                "
              >
                <Trash2 size={16} />
                Delete Group
              </button>
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default GroupHeader;
