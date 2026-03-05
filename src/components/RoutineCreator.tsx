import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Clock,
  BookOpen,
  User,
  MapPin,
  ChevronRight,
  Sparkles,
  FlaskConical,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoutineStore } from "../store/routineStore";

interface RoutineCreatorProps {
  onSave: () => void;
  selectedDay: string;
  onDayChange: (day: string) => void;
}

export const RoutineCreator: React.FC<RoutineCreatorProps> = ({
  onSave,
  selectedDay,
  onDayChange,
}) => {
  const { routine, saveRoutine } = useRoutineStore();
  const [dayRoutine, setDayRoutine] = useState<any[]>(
    routine[selectedDay] || [],
  );

  useEffect(() => {
    setDayRoutine(routine[selectedDay] || []);
  }, [selectedDay, routine]);

  const addSlot = () => {
    setDayRoutine([
      ...dayRoutine,
      { time: "", subject: "", teacher: "", room: "", isLab: false },
    ]);
  };

  const removeSlot = (index: number) => {
    setDayRoutine(dayRoutine.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: any) => {
    const updated = [...dayRoutine];
    updated[index] = { ...updated[index], [field]: value };
    setDayRoutine(updated);
  };

  const handleSave = () => {
    saveRoutine(selectedDay, dayRoutine);
    onSave();
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Day Selector - More Prominent */}
      <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 flex flex-wrap gap-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`flex-1 min-w-[120px] px-6 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all duration-500 ${
              selectedDay === day
                ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 -translate-y-1"
                : "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <header className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                Timeline Management
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                Construct the academic flow for {selectedDay}
              </p>
            </div>
          </div>

          <button
            onClick={addSlot}
            className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all group"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform"
            />
            Add Period
          </button>
        </header>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {dayRoutine.map((slot, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={index}
                className={`relative group p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
                  slot.isLab
                    ? "bg-gradient-to-br from-violet-50/50 to-indigo-50/50 border-indigo-100 shadow-xl shadow-indigo-500/5"
                    : "bg-white border-transparent hover:border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Time Section */}
                  <div className="lg:col-span-3 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 px-1">
                      <Clock size={12} className="text-indigo-400" /> Duration
                    </label>
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) =>
                        updateSlot(index, "time", e.target.value)
                      }
                      placeholder="09:00 - 10:30"
                      className="w-full bg-gray-50/50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>

                  {/* Subject & Teacher */}
                  <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 px-1">
                        <BookOpen size={12} className="text-violet-400" />{" "}
                        Subject
                      </label>
                      <input
                        type="text"
                        value={slot.subject}
                        onChange={(e) =>
                          updateSlot(index, "subject", e.target.value)
                        }
                        placeholder="Course Name"
                        className="w-full bg-gray-50/50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 px-1">
                        <User size={12} className="text-emerald-400" />{" "}
                        Instructor
                      </label>
                      <input
                        type="text"
                        value={slot.teacher}
                        onChange={(e) =>
                          updateSlot(index, "teacher", e.target.value)
                        }
                        placeholder="Full Name"
                        className="w-full bg-gray-50/50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  {/* Room & Actions */}
                  <div className="lg:col-span-3 flex gap-4 items-end">
                    <div className="space-y-3 flex-grow">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 px-1">
                        <MapPin size={12} className="text-amber-400" /> Location
                      </label>
                      <input
                        type="text"
                        value={slot.room}
                        onChange={(e) =>
                          updateSlot(index, "room", e.target.value)
                        }
                        placeholder="Room No."
                        className="w-full bg-gray-50/50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                      />
                    </div>

                    <button
                      onClick={() => removeSlot(index)}
                      className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Sub-controls */}
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => updateSlot(index, "isLab", !slot.isLab)}
                    className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      slot.isLab
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    <FlaskConical size={14} />
                    Lab Session
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                      Sequence #{index + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {dayRoutine.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border-4 border-dashed border-gray-50 rounded-[3rem] flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                <LayoutGrid size={40} />
              </div>
              <h4 className="text-xl font-black text-gray-300 uppercase tracking-widest">
                Workspace Empty
              </h4>
              <p className="text-gray-400 mt-2 font-medium">
                Click "Add Period" to start building the schedule.
              </p>
              <button
                onClick={addSlot}
                className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Add First Slot
              </button>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-6 pt-12">
            <button
              onClick={addSlot}
              className="px-10 py-6 bg-white border-2 border-dashed border-gray-200 text-gray-400 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:border-indigo-400 hover:text-indigo-500 transition-all flex items-center justify-center gap-4 flex-[2]"
            >
              <Plus size={24} />
              Add Session
            </button>
            <button
              onClick={handleSave}
              className="px-10 py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 flex-[3]"
            >
              <Save size={20} />
              Deploy Schedule
              <ChevronRight size={20} className="text-indigo-200" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-5 bg-white/20 backdrop-blur-xl rounded-[2rem]">
            <Sparkles size={32} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black tracking-tight mb-2">
              Automated Persistence
            </h4>
            <p className="text-indigo-100 text-lg leading-relaxed font-medium">
              Every detail is synchronized with your profile locally. This
              specialized portfolio version ensures your custom routines remain
              intact across browser sessions without needing a backend server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
