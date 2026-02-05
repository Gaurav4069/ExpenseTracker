import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate,Link } from "react-router-dom";
import { showSuccess, showError } from "../utils/toast";
import { motion } from "framer-motion";

/* ================= VARIANT ================= */

const formVariant = {
  hidden: {
    opacity: 0,
    x: -120,   // 👈 left se aaye
    y: 60,     // 👈 thoda neeche
    scale: 0.95,
  },
  show: {
    opacity: 1,
    x: [ -120, 20, 0 ],   // 👈 overshoot + settle
    y: [ 60, -10, 0 ],
    scale: 1,
    transition: {
      duration: 0.9,
      delay: 1,
      ease: "power4.out",
    },
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/groups" replace />;
  }

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      showSuccess("Login successful");
      navigate("/groups", { replace: true });
    } catch (err) {
      showError(err.response?.data?.message || "Login failed");
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
          Welcome back 👋
        </h2>

        {/* Email */}
        <input
          className="w-full rounded-lg bg-black/40
                     border border-white/10
                     px-4 py-3 text-sm
                     placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          className="w-full mt-4 rounded-lg bg-black/40
                     border border-white/10
                     px-4 py-3 text-sm
                     placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-white/20"
          type="password"
          placeholder="Password"
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
          Login
        </motion.button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link className="text-white hover:underline" to="/register">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
