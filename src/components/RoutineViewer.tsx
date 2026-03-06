import React from "react";

interface Slot {
  subject: string;
  teacher: string;
  room: string;
  isLab?: boolean;
}

interface RoutineData {
  classTest?: Slot | null;
  morningSlots?: (Slot | null)[];
  midDaySlots?: (Slot | null)[];
  afternoonSlots?: (Slot | null)[];
}

interface RoutineViewerProps {
  routine: Record<string, RoutineData>;
}

export const RoutineViewer: React.FC<RoutineViewerProps> = ({ routine }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeSlots = [
    { time: "8:30 - 9:00", type: "classTest" },
    { time: "9:00 - 9:50", type: "morning", index: 0 },
    { time: "9:50 - 10:40", type: "morning", index: 1 },
    { time: "11:00 - 11:50", type: "midDay", index: 0 },
    { time: "11:50 - 12:40", type: "midDay", index: 1 },
    { time: "12:40 - 1:30", type: "midDay", index: 2 },
    { time: "2:30 - 3:20", type: "afternoon", index: 0 },
    { time: "3:20 - 4:10", type: "afternoon", index: 1 },
    { time: "4:10 - 5:00", type: "afternoon", index: 2 },
  ];

  const getSlotContent = (day: string, slot: (typeof timeSlots)[0]) => {
    // Use the routine prop directly instead of local state.
    const dayRoutine: RoutineData = routine[day] || {};

    if (slot.type === "classTest") {
      return { content: dayRoutine.classTest || "No Class", colSpan: 1 };
    } else if (slot.type === "morning") {
      return {
        content: dayRoutine.morningSlots?.[slot.index!] || "No Class",
        colSpan: 1,
      };
    } else if (slot.type === "midDay") {
      const slotContent = dayRoutine.midDaySlots?.[slot.index!];
      if (slotContent?.isLab) {
        return { content: slotContent, colSpan: 3 };
      }
      return { content: slotContent || "No Class", colSpan: 1 };
    } else if (slot.type === "afternoon") {
      const slotContent = dayRoutine.afternoonSlots?.[slot.index!];
      if (slotContent?.isLab) {
        return { content: slotContent, colSpan: 3 };
      }
      return { content: slotContent || "No Class", colSpan: 1 };
    }
    return { content: "No Class", colSpan: 1 };
  };

  const renderClassInfo = (classInfo: any) => {
    if (
      !classInfo ||
      !classInfo.subject?.trim() ||
      !classInfo.teacher?.trim() ||
      !classInfo.room?.trim()
    ) {
      return <div className="text-xs text-gray-400">No Class</div>;
    }

    return (
      <div className="text-xs text-gray-900">
        <div>
          <strong>Subject:</strong> {classInfo.subject}
        </div>
        <div>
          <strong>Teacher:</strong> {classInfo.teacher}
        </div>
        <div>
          <strong>Room:</strong> {classInfo.room}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Mobile Card View (shown below md breakpoint) */}
      <div className="md:hidden space-y-6">
        {days.map((day) => {
          const dayRoutine = routine[day] || {};
          const hasClasses = 
            dayRoutine.classTest || 
            dayRoutine.morningSlots?.some((s: any) => s) || 
            dayRoutine.midDaySlots?.some((s: any) => s) || 
            dayRoutine.afternoonSlots?.some((s: any) => s);

          if (!hasClasses) return null;

          return (
            <div key={day} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-white font-black uppercase tracking-widest text-xs">{day}</h3>
                <span className="text-indigo-200 text-[10px] font-bold">Schedule</span>
              </div>
              <div className="p-4 space-y-3">
                {timeSlots.map((slot, idx) => {
                  const { content } = getSlotContent(day, slot);
                  if (typeof content === "string" && content === "No Class") return null;

                  return (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-50">
                      <div className="flex-shrink-0 w-24">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mb-1">Time</p>
                        <p className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100 inline-block">{slot.time}</p>
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-2">Subject & Details</p>
                        {renderClassInfo(content)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {!days.some(day => {
          const dr = routine[day] || {};
          return dr.classTest || dr.morningSlots?.some(s => s) || dr.midDaySlots?.some(s => s) || dr.afternoonSlots?.some(s => s);
        }) && (
          <div className="text-center py-12 text-gray-400">
            <p>No classes scheduled for the week.</p>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Table View (hidden below md breakpoint) */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="min-w-full border-separate border-spacing-0 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1 text-left font-medium">
                Day
              </th>
              {timeSlots.map((slot, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-2 py-1 font-medium"
                >
                  {slot.time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              let skipCount = 0; // To handle lab sessions spanning multiple columns
              return (
                <tr key={day} className="border-t border-gray-300">
                  <td className="border border-gray-300 px-2 py-1 font-medium bg-gray-50">
                    {day}
                  </td>
                  {timeSlots.map((slot, index) => {
                    if (skipCount > 0) {
                      skipCount--;
                      return null;
                    }

                    const { content, colSpan } = getSlotContent(day, slot);
                    if (colSpan > 1) {
                      skipCount = colSpan - 1;
                    }

                    return (
                      <td
                        key={index}
                        colSpan={colSpan}
                        className="border border-gray-300 px-2 py-1 text-center"
                      >
                        {typeof content === "string" ? (
                          <div className="text-xs text-gray-400">{content}</div> // Handles "No Class" as a string
                        ) : (
                          <div>{renderClassInfo(content)}</div> // Handles valid class info
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
