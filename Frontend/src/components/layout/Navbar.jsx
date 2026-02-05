import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { showInfo } from "../../utils/toast";
import { useEffect, useState } from "react";

/* ================= SCROLL VISIBILITY ================= */

const useScrollDirection = () => {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 80) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      setLastY(currentY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return visible;
};

/* ================= VARIANTS ================= */

const navbarVariants = {
  hidden: { y: -80, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 16 },
  },
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ================= TYPEWRITER ================= */

const text = "SplitEase";

const letter = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const visible = useScrollDirection();

  const handleLogout = () => {
    logout();
    showInfo("Logged out successfully");
    navigate("/login");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="navbar"
          variants={navbarVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="fixed top-0 left-0 right-0 z-50 h-16
                     bg-transparent backdrop-blur-md"
        >
          <motion.div
            className="max-w-7xl mx-auto h-full flex items-center justify-between px-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* LOGO with Typewriter */}
            <Link to="/">
              <motion.div
                className="flex text-lg font-bold tracking-tight text-white"
                variants={container}
                initial="hidden"
                animate="show"
                transition={{
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                {text.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    variants={letter}
                    transition={{
                      delay: i * 0.15,
                      duration: 0.4,
                    }}
                    className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </Link>

            {/* ACTION BUTTONS */}
            <motion.nav
              className="flex items-center gap-4"
              variants={container}
            >
              {user ? (
                <>
                  <motion.div variants={item}>
                    <Link
                      to="/groups"
                      className="px-4 py-2 rounded-full text-sm font-medium
                                 text-white border border-white/30
                                 hover:bg-white hover:text-black transition"
                    >
                      Groups
                    </Link>
                  </motion.div>

                  <motion.button
                    variants={item}
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-sm font-medium
                               bg-red-500/20 text-red-400
                               hover:bg-red-500 hover:text-white transition"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div variants={item}>
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-full text-sm font-medium
                                 text-white border border-white/30
                                 hover:bg-white hover:text-black transition"
                    >
                      Login
                    </Link>
                  </motion.div>

                  <motion.div variants={item}>
                    <Link
                      to="/register"
                      className="px-5 py-2 rounded-full text-sm font-semibold
                                 bg-white text-black
                                 hover:bg-gray-200 transition"
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.nav>
          </motion.div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
