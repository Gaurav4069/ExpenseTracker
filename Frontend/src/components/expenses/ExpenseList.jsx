import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpenseItem from "./ExpenseItem";
import ExpenseForm from "./ExpenseForm";
import ExpenseAIInput from "./ExpenseAIInput";
import { useGroup } from "../../context/GroupContext";

/* ================= ANIMATION ================= */

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const ExpenseList = () => {
  const { expenses, refreshGroup } = useGroup();

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [aiExpense, setAiExpense] = useState(null);

  const openAddForm = () => {
    setEditingExpense(null);
    setAiExpense(null);
    setShowForm(true);
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setAiExpense(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    setAiExpense(null);
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
        px-6 py-6
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

      <div className="relative">
        {/* ================= HEADER ================= */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* LEFT */}
          <h3 className="text-sm font-semibold tracking-[0.35em] text-gray-300">
            EXPENSES
          </h3>

          {/* RIGHT ACTIONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* AI INPUT */}
            <div
              className="
                flex items-center gap-3
                rounded-xl
                border border-indigo-500/20
                bg-indigo-500/[0.06]
                px-4 py-2
              "
            >
              <span className="text-xs font-semibold tracking-widest text-indigo-300 whitespace-nowrap">
                ADD WITH AI
              </span>

              <ExpenseAIInput
                onParsed={(data) => {
                  setAiExpense(data);
                  setShowForm(true);
                }}
              />
            </div>

            {/* PRIMARY CTA */}
            <button
              onClick={openAddForm}
              className="
                rounded-full px-6 py-2.5
                text-sm font-semibold
                text-black bg-white
                hover:bg-gray-200 transition
              "
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-6"
            >
              <ExpenseForm
                aiData={aiExpense}
                expense={editingExpense}
                onClose={closeForm}
                onSaved={async () => {
                  closeForm();
                  await refreshGroup();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= LIST ================= */}
        {expenses.length === 0 ? (
          <p className="text-sm italic text-gray-500">
            No expenses added yet
          </p>
        ) : (
          <div className="space-y-3">
            {expenses.map((e) => (
              <ExpenseItem
                key={e._id}
                expense={e}
                onEdit={() => openEditForm(e)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExpenseList;
