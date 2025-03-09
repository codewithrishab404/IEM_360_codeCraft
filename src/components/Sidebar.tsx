import { NavElements } from "@/lib";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, AlertTriangle } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

const Sidebar: React.FC<{ navElements: NavElements[] }> = ({ navElements }) => {
  const navigate = useNavigate(); // React Router navigation hook
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      className="w-72 bg-gradient-to-b from-blue-700 to-indigo-900 shadow-2xl rounded-l-2xl flex flex-col dark:from-slate-900 dark:to-slate-800 h-full py-6 backdrop-blur-lg border border-white/10"
    >
      <ul className="flex flex-col space-y-1">
        {navElements.map((navElement, idx) => (
          <NavLink to={navElement.linkTo} key={idx} end>
            {({ isActive }) => (
              <motion.li
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex gap-4 items-center p-4 mx-4 cursor-pointer rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white shadow-lg border-l-4 border-blue-400"
                    : "text-white hover:bg-white/10 hover:border-l-4 hover:border-blue-400"
                }`}
              >
                {navElement.logo}
                <span className="font-medium">{navElement.displayName}</span>
              </motion.li>
            )}
          </NavLink>
        ))}
      </ul>

      <div className="mt-auto mb-6 flex flex-col space-y-4 px-4">
        {/* Report Issue Button - Redirects to /report */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-6 py-3 flex items-center justify-center gap-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition-all"
          onClick={() => navigate("/dashboard/report")} // Redirect to report page
        >
          <AlertTriangle size={18} />
          Report Issue
        </motion.button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="px-6 py-3 flex items-center justify-center gap-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition-all"
        >
          <LogOut size={18} />
          Log out
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
