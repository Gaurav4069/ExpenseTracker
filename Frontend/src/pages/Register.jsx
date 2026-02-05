import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { showSuccess, showError } from "../utils/toast";
import { motion } from "framer-motion";

/* ================= VARIANT ================= */

const formVariant = {
  hidden: {
    opacity: 0,
    x: -120,
    y: 60,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    x: [-120, 20, 0],
    y: [60, -10, 0],
    scale: 1,
    transition: {
      duration: 1.1,
      delay: 0.35,
      ease: "easeOut",
    },
  },
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!name || !email || !password) {
      showError("All fields are required");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      showSuccess("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <motion.div
        variants={formVariant}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm rounded-2xl
                   bg-white/5 backdrop-blur-xl
                   border border-white/10
                   p-8 text-white shadow-2xl"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Create account ✨
        </h2>

        {/* Name */}
        <input
          className="w-full rounded-lg bg-black/40
                     border border-white/10
                     px-4 py-3 text-sm
                     placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          className="w-full mt-4 rounded-lg bg-black/40
                     border border-white/10
                     px-4 py-3 text-sm
                     placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          className="w-full mt-4 rounded-lg bg-black/40
                     border border-white/10
                     px-4 py-3 text-sm
                     placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={submit}
          className="mt-6 w-full rounded-lg
                     bg-white text-black
                     py-3 font-semibold
                     transition"
        >
          Register
        </motion.button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link className="text-white hover:underline" to="/login">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
