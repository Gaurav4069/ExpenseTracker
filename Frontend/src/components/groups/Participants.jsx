import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check, X } from "lucide-react";
import api from "../../api/axios";
import { showSuccess, showError } from "../../utils/toast";
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

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const Participants = () => {
  const { groupId } = useParams();
  const { refreshGroup } = useGroup();

  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchParticipants = async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setParticipants(res.data.participants || []);
    } catch {
      showError("Failed to load participants");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [groupId]);

  const addParticipant = async () => {
    if (!name.trim()) {
      showError("Participant name required");
      return;
    }

    try {
      await api.post(`/groups/${groupId}/participants`, {
        name: name.trim(),
      });
      showSuccess("Participant added");
      setName("");
      fetchParticipants();
      refreshGroup();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to add participant");
    }
  };

  const updateParticipant = async (id) => {
    if (!editName.trim()) {
      showError("Name required");
      return;
    }

    try {
      await api.put(`/groups/participants/${id}`, {
        name: editName.trim(),
      });
      showSuccess("Participant updated");
      setEditingId(null);
      fetchParticipants();
      refreshGroup();
    } catch {
      showError("Update failed");
    }
  };

  const removeParticipant = async (id) => {
    if (!confirm("Remove participant?")) return;

    try {
      await api.delete(`/groups/${groupId}/participants/${id}`);
      showSuccess("Participant removed");
      fetchParticipants();
      refreshGroup();
    } catch {
      showError("Failed to remove participant");
    }
  };

  return (
    <motion.div
      variants={cardAnim}
      initial="hidden"
      animate="show"
      className="
        relative rounded-3xl
        border border-white/10
        bg-white/[0.02]
        backdrop-blur-2xl
        px-5 sm:px-7 py-6
        overflow-hidden
      "
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0
                      bg-gradient-to-br
                      from-indigo-500/10
                      via-purple-500/5
                      to-transparent" />

      <div className="relative">
        <h3 className="mb-6 text-sm font-semibold tracking-[0.3em] text-gray-300">
          PARTICIPANTS
        </h3>

        {/* ADD — RESPONSIVE */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            className="
              w-full sm:flex-1
              rounded-xl border border-white/20
              bg-transparent px-4 py-2.5 text-sm
              focus:outline-none focus:border-white/40
            "
            placeholder="Add participant"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={addParticipant}
            className="
              w-full sm:w-auto
              rounded-full bg-white px-6 py-2.5
              text-sm font-semibold text-black
              hover:bg-gray-200 transition
            "
          >
            Add
          </button>
        </div>

        {/* LIST */}
        {participants.length === 0 ? (
          <p className="text-sm italic text-gray-500">
            No participants added yet
          </p>
        ) : (
          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {participants.map((p) => (
              <motion.li
                key={p._id}
                variants={listItem}
                className="
                  rounded-xl bg-white/[0.03]
                  px-4 py-3
                  flex flex-col sm:flex-row
                  sm:items-center sm:justify-between
                  gap-3
                "
              >
                {/* NAME */}
                {editingId === p._id ? (
                  <input
                    className="
                      w-full sm:flex-1
                      rounded-lg border border-white/20
                      bg-transparent px-3 py-2 text-sm
                      focus:outline-none focus:border-white/40
                    "
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm text-gray-200">
                    {p.name}
                  </span>
                )}

                {/* BUTTONS */}
                <div className="flex justify-end gap-2">
                  {editingId === p._id ? (
                    <>
                      <button
                        onClick={() => updateParticipant(p._id)}
                        className="rounded-full p-2 text-green-400 hover:bg-green-500/10"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-full p-2 hover:bg-white/10"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(p._id);
                          setEditName(p.name);
                        }}
                        className="rounded-full p-2 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => removeParticipant(p._id)}
                        className="rounded-full p-2 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
};

export default Participants;
