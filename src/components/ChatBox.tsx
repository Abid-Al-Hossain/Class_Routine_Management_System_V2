import React, { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Trash2,
  Edit2,
  Reply,
  Smile,
} from "lucide-react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { useChatStore, ChatChannel } from "../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBoxProps {
  username: string;
  userRole?: string;
  channel?: ChatChannel;
  title?: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  username,
  userRole,
  channel = "general",
  title = "Community Chat",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    messages = [],
    fetchMessages,
    addMessage,
    deleteMessage,
    editMessage,
  } = useChatStore();

  useEffect(() => {
    if (isOpen) fetchMessages(channel);
  }, [isOpen, fetchMessages, channel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized, editingId, replyingId]);

  const handleSend = () => {
    if (message.trim()) {
      if (editingId) {
        editMessage(editingId, message.trim());
        setEditingId(null);
      } else {
        addMessage(username, message.trim(), channel, userRole, replyingId || undefined);
        setReplyingId(null);
      }
      setMessage("");
      setShowEmojiPicker(false);
      fetchMessages(channel);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const scrollToMessage = (id: string) => {
    const element = document.getElementById(`chat-message-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedMessageId(id);
      setTimeout(() => setHighlightedMessageId(null), 1500);
    }
  };

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setReplyingId(null);
    setMessage(content);
  };

  const handleReply = (id: string) => {
    setReplyingId(id);
    setEditingId(null);
    setMessage("");
  };

  const cancelAction = () => {
    setEditingId(null);
    setReplyingId(null);
    setMessage("");
  };

  const activeReferenceMessage = messages.find(
    (m) => m.id === (editingId || replyingId)
  );

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
            <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-150 ease-in-out whitespace-nowrap">
              Chat with peers
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
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
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-100 w-80 lg:w-96 border border-white overflow-hidden flex flex-col origin-bottom-right"
          >
            {/* Header */}
            <motion.div layout="position" className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white flex justify-between items-center shrink-0 h-[64px] relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold tracking-tight">{title}</h3>
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
            </motion.div>

            {/* Body Wrapper */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="flex flex-col overflow-hidden"
                >
                  <div
                    ref={scrollRef}
                    className="h-[350px] lg:h-[400px] p-4 overflow-y-auto space-y-4 custom-scrollbar bg-indigo-50/10 shrink-0"
                  >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
                      <MessageSquare size={48} className="mb-2" />
                      <p className="text-sm font-bold">Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMe = msg.sender === username;
                      const repliedMsg = msg.replyToId
                        ? messages.find((m) => m.id === msg.replyToId)
                        : null;

                      return (
                        <motion.div
                          id={`chat-message-${msg.id}`}
                          initial={{
                            opacity: 0,
                            x: isMe ? 20 : -20,
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          key={msg.id || index}
                          className={`flex flex-col ${
                            isMe ? "items-end" : "items-start"
                          } transition-all duration-500 rounded-2xl ${
                            highlightedMessageId === msg.id
                              ? "ring-4 ring-indigo-500 scale-[1.02] shadow-2xl relative z-10"
                              : ""
                          }`}
                        >
                          <div
                            className={`max-w-[85%] p-3 rounded-2xl text-sm relative group transition-all ${
                              isMe
                                ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100 shadow-lg"
                                : "bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1 gap-4">
                              <p className="text-[10px] font-black uppercase opacity-60">
                                {msg.sender}
                              </p>
                              {msg.senderRole && (
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                                  isMe ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"
                                }`}>
                                  {msg.senderRole}
                                </span>
                              )}
                            </div>

                            {/* Replied Message Snippet */}
                            {repliedMsg && (
                              <div
                                onClick={() => scrollToMessage(repliedMsg.id)}
                                className={`mb-2 pl-2 border-l-2 text-xs opacity-80 cursor-pointer hover:opacity-100 transition-all ${
                                  isMe
                                    ? "border-indigo-300 bg-indigo-700/50 hover:bg-indigo-700"
                                    : "border-indigo-500 bg-gray-50 hover:bg-gray-100"
                                } p-1.5 rounded-r-md rounded-l-sm line-clamp-1`}
                              >
                                <strong>{repliedMsg.sender}:</strong>{" "}
                                {repliedMsg.content}
                              </div>
                            )}

                            <p className="font-medium leading-relaxed">
                              {msg.content}
                            </p>

                            {/* Action Buttons */}
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                                isMe ? "-left-16" : "-right-8"
                              }`}
                            >
                              {!isMe && (
                                <button
                                  onClick={() => handleReply(msg.id)}
                                  className="text-gray-400 hover:text-indigo-500 p-1 bg-white rounded-full shadow-sm border border-gray-100"
                                  title="Reply"
                                >
                                  <Reply size={12} />
                                </button>
                              )}
                              {isMe && (
                                <>
                                  <button
                                    onClick={() => handleEdit(msg.id, msg.content)}
                                    className="text-gray-400 hover:text-indigo-500 p-1 bg-white rounded-full shadow-sm border border-gray-100"
                                    title="Edit"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="text-gray-400 hover:text-red-500 p-1 bg-white rounded-full shadow-sm border border-gray-100"
                                    title="Delete"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-50 flex flex-col">
                  {/* Active Action Banner */}
                  <AnimatePresence>
                    {(editingId || replyingId) && activeReferenceMessage && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center gap-2 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 text-xs truncate">
                          {editingId ? (
                            <Edit2 size={12} className="text-indigo-500 shrink-0" />
                          ) : (
                            <Reply size={12} className="text-indigo-500 shrink-0" />
                          )}
                          <span className="font-bold text-gray-600 shrink-0">
                            {editingId ? "Editing:" : `Replying to ${activeReferenceMessage.sender}:`}
                          </span>
                          <span className="text-gray-500 truncate">
                            {activeReferenceMessage.content}
                          </span>
                        </div>
                        <button
                          onClick={cancelAction}
                          className="text-gray-400 hover:text-gray-600 shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-4 flex gap-2 relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-3 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
                    >
                      <Smile size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-[4.5rem] left-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-gray-100 bg-white"
                        >
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            theme={Theme.LIGHT}
                            width={320}
                            height={350}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Share a message..."
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center"
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
