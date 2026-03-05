import React, { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Trash2,
} from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBoxProps {
  username: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    messages = [],
    fetchMessages,
    addMessage,
    deleteMessage,
  } = useChatStore();

  useEffect(() => {
    if (isOpen) fetchMessages();
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = () => {
    if (message.trim()) {
      addMessage(username, message);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-4 rounded-2xl shadow-2xl shadow-indigo-200 flex items-center gap-2 font-bold group"
          >
            <MessageSquare
              size={24}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap">
              Chat with peers
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.9,
              transformOrigin: "bottom right",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "64px" : "500px",
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-100 w-80 lg:w-96 border border-white overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold tracking-tight">Community Chat</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 size={18} />
                  ) : (
                    <Minimize2 size={18} />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div
                  ref={scrollRef}
                  className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar bg-indigo-50/10"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
                      <MessageSquare size={48} className="mb-2" />
                      <p className="text-sm font-bold">Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <motion.div
                        initial={{
                          opacity: 0,
                          x: msg.sender === username ? 20 : -20,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        key={msg.id || index}
                        className={`flex flex-col ${msg.sender === username ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm relative group transition-all ${
                            msg.sender === username
                              ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100 shadow-lg"
                              : "bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm"
                          }`}
                        >
                          <p
                            className={`text-[10px] font-black uppercase mb-1 opacity-60`}
                          >
                            {msg.sender}
                          </p>
                          <p className="font-medium leading-relaxed">
                            {msg.content}
                          </p>

                          {msg.sender === username && (
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Share a message..."
                      className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
