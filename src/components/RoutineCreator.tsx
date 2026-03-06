import React, { useEffect, useState } from "react";
import {
  Save,
  Clock,
  BookOpen,
  User,
  MapPin,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRoutineStore } from "../store/routineStore";

interface ClassInput {
  subject: string;
  teacher: string;
  room: string;
  isLab?: boolean;
}

interface LabInput extends ClassInput {
  startTime: string;
  endTime: string;
}

interface RoutineCreatorProps {
  onSave: () => void;
  selectedDay: string;
  onDayChange: (day: string) => void;
}

const InputField = ({
  icon: Icon,
  placeholder,
  value,
  onChange,
  colorClass,
}: any) => (
  <div className="relative group">
    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${colorClass}`}>
      <Icon size={16} />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-50/50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all duration-150 font-bold text-gray-700 placeholder:text-gray-400 hover:border-indigo-200"
    />
  </div>
);

export const RoutineCreator: React.FC<RoutineCreatorProps> = ({
  onSave,
  selectedDay,
  onDayChange,
}) => {
  const { routine, saveRoutine } = useRoutineStore();

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const [classTest, setClassTest] = useState<ClassInput | null>(null);
  const [morningClasses, setMorningClasses] = useState<(ClassInput | null)[]>([
    null,
    null,
  ]);
  const [midDayLab, setMidDayLab] = useState(false);
  const [midDayClasses, setMidDayClasses] = useState<
    (ClassInput | LabInput | null)[]
  >([null, null, null]);
  const [afternoonLab, setAfternoonLab] = useState(false);
  const [afternoonClasses, setAfternoonClasses] = useState<
    (ClassInput | LabInput | null)[]
  >([null, null, null]);

  // Load from local store
  useEffect(() => {
    const routineData = routine[selectedDay];
    if (routineData) {
      setClassTest(routineData.classTest || null);
      setMorningClasses(routineData.morningSlots || [null, null]);
      setMidDayLab(routineData.midDaySlots?.[0]?.isLab || false);
      setMidDayClasses(routineData.midDaySlots || [null, null, null]);
      setAfternoonLab(routineData.afternoonSlots?.[0]?.isLab || false);
      setAfternoonClasses(routineData.afternoonSlots || [null, null, null]);
    } else {
      setClassTest(null);
      setMorningClasses([null, null]);
      setMidDayLab(false);
      setMidDayClasses([null, null, null]);
      setAfternoonLab(false);
      setAfternoonClasses([null, null, null]);
    }
  }, [selectedDay, routine]);

  const handleSave = () => {
    const routineData = {
      classTest: classTest,
      morningSlots: morningClasses.map(
        (slot) => slot || { subject: "", teacher: "", room: "" },
      ),
      midDaySlots: midDayLab
        ? [
            {
              isLab: true,
              ...(midDayClasses[0] || {}),
              startTime: "11:00",
              endTime: "13:30",
            },
          ]
        : midDayClasses.map((slot) => ({ isLab: false, ...(slot || {}) })),
      afternoonSlots: afternoonLab
        ? [
            {
              isLab: true,
              ...(afternoonClasses[0] || {}),
              startTime: "14:30",
              endTime: "17:00",
            },
          ]
        : afternoonClasses.map((slot) => ({ isLab: false, ...(slot || {}) })),
    };

    saveRoutine(selectedDay, routineData);
    onSave();
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Day Selector */}
      <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 flex overflow-x-auto gap-1 custom-scrollbar-hide whitespace-nowrap scroll-smooth">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`flex-1 min-w-[120px] px-6 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all duration-100 ${
              selectedDay === day
                ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 -translate-y-1"
                : "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        <header className="flex items-center gap-3 px-2">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Timeline Editor
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Configure {selectedDay}'s schedule structure.
            </p>
          </div>
        </header>

        {/* Class Test */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-rose-500" />
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              Class Test{" "}
              <span className="text-gray-400 font-medium text-sm ml-2">
                (8:30 AM - 9:00 AM)
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              icon={BookOpen}
              colorClass="text-violet-500"
              placeholder="Subject"
              value={classTest?.subject || ""}
              onChange={(e: any) =>
                setClassTest({
                  ...(classTest || { teacher: "", room: "" }),
                  subject: e.target.value,
                })
              }
            />
            <InputField
              icon={User}
              colorClass="text-emerald-500"
              placeholder="Teacher"
              value={classTest?.teacher || ""}
              onChange={(e: any) =>
                setClassTest({
                  ...(classTest || { subject: "", room: "" }),
                  teacher: e.target.value,
                })
              }
            />
            <InputField
              icon={MapPin}
              colorClass="text-amber-500"
              placeholder="Room"
              value={classTest?.room || ""}
              onChange={(e: any) =>
                setClassTest({
                  ...(classTest || { subject: "", teacher: "" }),
                  room: e.target.value,
                })
              }
            />
          </div>
        </motion.div>

        {/* Morning Classes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-indigo-500" />
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              Morning Classes{" "}
              <span className="text-gray-400 font-medium text-sm ml-2">
                (9:00 AM - 10:40 AM)
              </span>
            </h3>
          </div>
          <div className="space-y-4">
            {morningClasses.map((slot, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-50"
              >
                <InputField
                  icon={BookOpen}
                  colorClass="text-violet-500"
                  placeholder="Subject"
                  value={slot?.subject || ""}
                  onChange={(e: any) => {
                    const newClasses = [...morningClasses];
                    newClasses[index] = {
                      ...(newClasses[index] || { teacher: "", room: "" }),
                      subject: e.target.value,
                    };
                    setMorningClasses(newClasses);
                  }}
                />
                <InputField
                  icon={User}
                  colorClass="text-emerald-500"
                  placeholder="Teacher"
                  value={slot?.teacher || ""}
                  onChange={(e: any) => {
                    const newClasses = [...morningClasses];
                    newClasses[index] = {
                      ...(newClasses[index] || { subject: "", room: "" }),
                      teacher: e.target.value,
                    };
                    setMorningClasses(newClasses);
                  }}
                />
                <InputField
                  icon={MapPin}
                  colorClass="text-amber-500"
                  placeholder="Room"
                  value={slot?.room || ""}
                  onChange={(e: any) => {
                    const newClasses = [...morningClasses];
                    newClasses[index] = {
                      ...(newClasses[index] || { subject: "", teacher: "" }),
                      room: e.target.value,
                    };
                    setMorningClasses(newClasses);
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mid-Day Classes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Mid-Day Classes{" "}
                <span className="text-gray-400 font-medium text-sm ml-2">
                  (11:00 AM - 1:30 PM)
                </span>
              </h3>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={midDayLab}
                  onChange={(e) => {
                    setMidDayLab(e.target.checked);
                    setMidDayClasses([null, null, null]);
                  }}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors duration-150 ease-in-out ${midDayLab ? "bg-indigo-600" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-150 ease-in-out ${midDayLab ? "transform translate-x-6" : ""}`}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                Lab Session
              </span>
            </label>
          </div>

          <div
            className={`space-y-4 rounded-2xl p-4 transition-colors duration-150 ${midDayLab ? "bg-indigo-50/50 border border-indigo-100" : ""}`}
          >
            {midDayLab ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  icon={BookOpen}
                  colorClass="text-violet-500"
                  placeholder="Lab Subject"
                  value={midDayClasses[0]?.subject || ""}
                  onChange={(e: any) => {
                    const newClasses = [...midDayClasses];
                    newClasses[0] = {
                      ...(newClasses[0] || {
                        teacher: "",
                        room: "",
                        startTime: "",
                        endTime: "",
                      }),
                      subject: e.target.value,
                      isLab: true,
                    } as LabInput;
                    setMidDayClasses(newClasses);
                  }}
                />
                <InputField
                  icon={User}
                  colorClass="text-emerald-500"
                  placeholder="Instructor"
                  value={midDayClasses[0]?.teacher || ""}
                  onChange={(e: any) => {
                    const newClasses = [...midDayClasses];
                    newClasses[0] = {
                      ...(newClasses[0] || {
                        subject: "",
                        room: "",
                        startTime: "",
                        endTime: "",
                      }),
                      teacher: e.target.value,
                      isLab: true,
                    } as LabInput;
                    setMidDayClasses(newClasses);
                  }}
                />
                <InputField
                  icon={MapPin}
                  colorClass="text-amber-500"
                  placeholder="Lab Room"
                  value={midDayClasses[0]?.room || ""}
                  onChange={(e: any) => {
                    const newClasses = [...midDayClasses];
                    newClasses[0] = {
                      ...(newClasses[0] || {
                        subject: "",
                        teacher: "",
                        startTime: "",
                        endTime: "",
                      }),
                      room: e.target.value,
                      isLab: true,
                    } as LabInput;
                    setMidDayClasses(newClasses);
                  }}
                />
              </div>
            ) : (
              midDayClasses.map((slot, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-50"
                >
                  <InputField
                    icon={BookOpen}
                    colorClass="text-violet-500"
                    placeholder="Subject"
                    value={slot?.subject || ""}
                    onChange={(e: any) => {
                      const newClasses = [...midDayClasses];
                      newClasses[index] = {
                        ...(newClasses[index] || { teacher: "", room: "" }),
                        subject: e.target.value,
                      };
                      setMidDayClasses(newClasses);
                    }}
                  />
                  <InputField
                    icon={User}
                    colorClass="text-emerald-500"
                    placeholder="Teacher"
                    value={slot?.teacher || ""}
                    onChange={(e: any) => {
                      const newClasses = [...midDayClasses];
                      newClasses[index] = {
                        ...(newClasses[index] || { subject: "", room: "" }),
                        teacher: e.target.value,
                      };
                      setMidDayClasses(newClasses);
                    }}
                  />
                  <InputField
                    icon={MapPin}
                    colorClass="text-amber-500"
                    placeholder="Room"
                    value={slot?.room || ""}
                    onChange={(e: any) => {
                      const newClasses = [...midDayClasses];
                      newClasses[index] = {
                        ...(newClasses[index] || { subject: "", teacher: "" }),
                        room: e.target.value,
                      };
                      setMidDayClasses(newClasses);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Afternoon Classes Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-violet-500" />
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Afternoon{" "}
                <span className="text-gray-400 font-medium text-sm ml-2">
                  (2:30 PM - 5:00 PM)
                </span>
              </h3>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={afternoonLab}
                  onChange={(e) => {
                    setAfternoonLab(e.target.checked);
                    setAfternoonClasses([null, null, null]);
                  }}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors duration-150 ease-in-out ${afternoonLab ? "bg-indigo-600" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-150 ease-in-out ${afternoonLab ? "transform translate-x-6" : ""}`}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                Lab Session
              </span>
            </label>
          </div>

          <div
            className={`space-y-4 rounded-2xl p-4 transition-colors duration-150 ${afternoonLab ? "bg-indigo-50/50 border border-indigo-100" : ""}`}
          >
            {afternoonLab ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  icon={BookOpen}
                  colorClass="text-violet-500"
                  placeholder="Lab Subject"
                  value={afternoonClasses[0]?.subject || ""}
                  onChange={(e: any) => {
                    const newClasses = [...afternoonClasses];
                    newClasses[0] = {
                      ...(newClasses[0] || {
                        teacher: "",
                        room: "",
                        startTime: "",
                        endTime: "",
                      }),
                      subject: e.target.value,
                      isLab: true,
                    } as LabInput;
                    setAfternoonClasses(newClasses);
                  }}
                />
                <InputField
                  icon={User}
                  colorClass="text-emerald-500"
                  placeholder="Instructor"
                  value={afternoonClasses[0]?.teacher || ""}
                  onChange={(e: any) => {
                    const newClasses = [...afternoonClasses];
                    newClasses[0] = {
                      ...(newClasses[0] || {
                        subject: "",
                        room: "",
                        startTime: "",
                        endTime: "",
                      }),
                      teacher: e.target.value,
                      isLab: true,
                    } as LabInput;
                    setAfternoonClasses(newClasses);
                  }}
                />
                <InputField
                  icon={MapPin}
                  colorClass="text-amber-500"
                  placeholder="Lab Room"
                  value={afternoonClasses[0]?.room || ""}
                  onChange={(e: any) => {
                    const newClasses = [...afternoonClasses];
                    newClasses[0] = {
                      ...(newClasses[0] || {
                        subject: "",
                        teacher: "",
                        startTime: "",
                        endTime: "",
                      }),
                      room: e.target.value,
                      isLab: true,
                    } as LabInput;
                    setAfternoonClasses(newClasses);
                  }}
                />
              </div>
            ) : (
              afternoonClasses.map((slot, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-50"
                >
                  <InputField
                    icon={BookOpen}
                    colorClass="text-violet-500"
                    placeholder="Subject"
                    value={slot?.subject || ""}
                    onChange={(e: any) => {
                      const newClasses = [...afternoonClasses];
                      newClasses[index] = {
                        ...(newClasses[index] || { teacher: "", room: "" }),
                        subject: e.target.value,
                      };
                      setAfternoonClasses(newClasses);
                    }}
                  />
                  <InputField
                    icon={User}
                    colorClass="text-emerald-500"
                    placeholder="Teacher"
                    value={slot?.teacher || ""}
                    onChange={(e: any) => {
                      const newClasses = [...afternoonClasses];
                      newClasses[index] = {
                        ...(newClasses[index] || { subject: "", room: "" }),
                        teacher: e.target.value,
                      };
                      setAfternoonClasses(newClasses);
                    }}
                  />
                  <InputField
                    icon={MapPin}
                    colorClass="text-amber-500"
                    placeholder="Room"
                    value={slot?.room || ""}
                    onChange={(e: any) => {
                      const newClasses = [...afternoonClasses];
                      newClasses[index] = {
                        ...(newClasses[index] || { subject: "", teacher: "" }),
                        room: e.target.value,
                      };
                      setAfternoonClasses(newClasses);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="pt-8">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-200 hover:scale-[1.01] active:scale-95 transition-all duration-150 py-6 flex items-center justify-center gap-3"
          >
            <Save size={20} />
            Deploy Schedule
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-10 mt-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
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
