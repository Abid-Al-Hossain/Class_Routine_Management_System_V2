import React from "react";
import { Link } from "react-router-dom";
import { School, LogOut, Layout, RefreshCw, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { storage } from "../utils/storage";

interface NavbarProps {
  title: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  showLogout,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const resetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all app data back to defaults?",
      )
    ) {
      storage.clearAll();
      window.location.href = "/";
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-[60] bg-indigo-100/90 backdrop-blur-md border-b border-indigo-200/50 shadow-[0_4px_24px_rgba(79,70,229,0.12)] px-6 py-4"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-3 group transition-all"
        >
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform">
            <School size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
              ClassHub
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Management V2
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
            <Layout size={14} className="text-indigo-500" />
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all text-xs font-bold"
            >
              <RefreshCw size={14} />
              Reset Data
            </button>
            <Link
              to="/"
              className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>

            {showLogout && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[350px] bg-white shadow-2xl z-[70] p-8 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <School size={24} />
                  </div>
                  <span className="text-xl font-black text-gray-900">ClassHub</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <Layout size={18} className="text-indigo-600" />
                  <span className="text-sm font-black text-indigo-600 uppercase tracking-wider">
                    {title}
                  </span>
                </div>

                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-700 flex items-center justify-between group"
                >
                  Home
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    resetData();
                  }}
                  className="px-4 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-700 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 text-amber-600">
                    <RefreshCw size={18} />
                    Reset App Data
                  </div>
                </button>

                {showLogout && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout?.();
                    }}
                    className="mt-4 w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <LogOut size={18} />
                    Logout System
                  </button>
                )}
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Class Routine Management <br /> Refactored for Excellence
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
