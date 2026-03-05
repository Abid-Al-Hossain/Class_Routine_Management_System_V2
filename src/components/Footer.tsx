import React from "react";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0f25] border-t border-indigo-500/10 py-8 mt-auto overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

      {/* Decorative blobs */}
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px]"></div>
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/10 rounded-full blur-[80px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-black text-white tracking-tight">
                ClassHub
              </span>
              <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-[9px] font-black rounded-full uppercase tracking-widest border border-indigo-500/20">
                v2.0
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium max-w-sm">
              Precision routine management. Built for excellence.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Class Routine Management System
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Build with{" "}
              <Heart
                size={10}
                className="text-indigo-500 fill-indigo-500 animate-pulse"
              />{" "}
              for Excellence
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
