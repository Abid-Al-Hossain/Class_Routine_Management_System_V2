import { storage, STORAGE_KEYS } from "./storage";

export const seedMockDataIfNeeded = () => {
  const routines = storage.get(STORAGE_KEYS.ROUTINES, {});
  const notifications = storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
  const messages = storage.get(STORAGE_KEYS.MESSAGES, []);
  const requests = storage.get(STORAGE_KEYS.REQUESTS, []);

  let seeded = false;

  if (Object.keys(routines).length === 0) {
    storage.set(STORAGE_KEYS.ROUTINES, {
      Sunday: {
        classTest: { subject: "Software Engineering", teacher: "SRN", room: "301" },
        morningSlots: [
          { subject: "Database Systems", teacher: "MR", room: "405" },
          { subject: "Computer Networks", teacher: "RH", room: "406" },
        ],
        midDaySlots: [null, null, null],
        afternoonSlots: [null, null, null],
      },
      Monday: {
        classTest: null,
        morningSlots: [null, null],
        midDaySlots: [
          { subject: "Web Engineering Lab", teacher: "AAH", room: "Networking Lab", isLab: true, startTime: "11:00", endTime: "13:30" }
        ],
        afternoonSlots: [null, null, null],
      },
      Tuesday: {
        classTest: { subject: "Machine Learning", teacher: "FB", room: "201" },
        morningSlots: [
          { subject: "Artificial Intelligence", teacher: "FB", room: "201" },
          { subject: "Compiler Design", teacher: "ZK", room: "305" },
        ],
        midDaySlots: [null, null, null],
        afternoonSlots: [
          { subject: "AI Lab", teacher: "FB", room: "AI Lab", isLab: true, startTime: "14:30", endTime: "17:00" }
        ],
      }
    });
    seeded = true;
  }

  if (notifications.length === 0) {
    storage.set(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: "mock_notif_1",
        content: "Campus will remain closed on Thursday due to the national holiday.",
        sender: "System Coordinator",
        targetRole: "all",
        timestamp: new Date().toISOString(),
      },
      {
        id: "mock_notif_2",
        content: "The Web Engineering Lab for Monday has been shifted to the new Networking Lab.",
        sender: "Teacher AAH",
        targetRole: "student",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      }
    ]);
    seeded = true;
  }

  if (messages.length === 0) {
    storage.set(STORAGE_KEYS.MESSAGES, [
      {
        id: "mock_msg_0",
        sender: "System Coordinator",
        senderRole: "coordinator",
        content: "Welcome to ClassHub V2! This global chat connects everyone. Feel free to use it for cross-role communication.",
        channel: "general",
        timestamp: new Date(Date.now() - 10000000).toISOString(),
      },
      {
        id: "mock_msg_1",
        sender: "Class Representative",
        senderRole: "representative",
        content: "Hey everyone, don't forget that the SE assignment is due tomorrow morning!",
        channel: "general",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "mock_msg_2",
        sender: "Teacher SRN",
        senderRole: "teacher",
        content: "I have uploaded the lecture slides to the portal. Please review them before the class test.",
        channel: "general",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "mock_msg_3",
        sender: "Student John",
        senderRole: "student",
        content: "Thank you sir! Also, does anyone know if the library is open this afternoon?",
        channel: "general",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        replyToId: "mock_msg_2",
      }
    ]);
    seeded = true;
  }

  if (requests.length === 0) {
    storage.set(STORAGE_KEYS.REQUESTS, [
      {
        id: "mock_req_1",
        teacherName: "Teacher MR",
        content: "Requesting to swap Tuesday's morning slot with Teacher ZK.",
        timestamp: new Date(Date.now() - 15000000).toISOString(),
        acceptStatus: "pending",
      }
    ]);
    seeded = true;
  }

  return seeded;
};
