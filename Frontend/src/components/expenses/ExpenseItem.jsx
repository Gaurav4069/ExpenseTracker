import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import ExpenseForm from "./ExpenseForm";
import { deleteExpense } from "../../api/expenseApi";
import { showSuccess, showError } from "../../utils/toast";
import { useGroup } from "../../context/GroupContext";

const ExpenseItem = ({ expense }) => {
  const [editing, setEditing] = useState(false);
  const { refreshGroup, removeExpenseLocally } = useGroup();

  const remove = async () => {
    if (!confirm("Delete this expense?")) return;

    try {
      await deleteExpense(expense._id);

      // instant UI update
      removeExpenseLocally(expense._id);

      showSuccess("Expense deleted");
      refreshGroup();
    } catch {
      showError("Failed to delete expense");
    }
  };

  /* ================= EDIT MODE ================= */
  if (editing) {
    return (
      <ExpenseForm
        expense={expense}
        onClose={() => setEditing(false)}
        onSaved={async () => {
          setEditing(false);
          await refreshGroup();
        }}
      />
    );
  }

  /* ================= VIEW MODE ================= */
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-4
        rounded-2xl
        border border-white/10
        bg-white/[0.035]
        px-5 py-4
      "
    >
      {/* LEFT INFO */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-200">
          ₹{expense.amount}
        </p>

        <p className="text-sm text-gray-300">
          {expense.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-white">
          {expense.category && (
            <span className="rounded-full bg-green-500 px-2 py-0.5">
              {expense.category}
            </span>
          )}
          <span>
            Paid by {expense.payer?.name}
          </span>
          <span>•</span>
          <span>
            {new Date(expense.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button
          onClick={() => setEditing(true)}
          title="Edit expense"
          className="
            rounded-full p-2
            text-blue-400
            hover:bg-blue-500/10
            transition
          "
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={remove}
          title="Delete expense"
          className="
            rounded-full p-2
            text-red-400
            hover:bg-red-500/10
            transition
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default ExpenseItem;
