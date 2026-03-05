import React from "react";
import { Github, Globe, Heart } from "lucide-react";
import { motion } from "framer-motion";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-black text-gray-900 tracking-tight">
                ClassHub
              </span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                v2.0
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              Elevating academic management with intelligence.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <motion.a
              whileHover={{ y: -2, color: "#4f46e5" }}
              href="#"
              className="text-gray-400 transition-colors"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              whileHover={{ y: -2, color: "#4f46e5" }}
              href="#"
              className="text-gray-400 transition-colors"
            >
              <Globe size={20} />
            </motion.a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Intelligent Routine Management
            System
          </p>
          <div className="flex items-center gap-2">
            Build with <Heart size={10} className="text-red-400 fill-red-400" />{" "}
            for Excellence
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
