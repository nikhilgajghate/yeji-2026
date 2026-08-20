/**
 * All customizable content lives here.
 * Swap the name, copy, reasons, quiz, and photo paths — no UI edits needed.
 */
window.YEJI_CONFIG = {
  name: "Yeji",

  hero: {
    line: "Happy 26th birthday",
    cta: "Open",
  },

  instructions: {
    title: "A little guide",
    body: "Click to proceed whenever you're ready babygooorlllll!",
    cta: "Got it",
  },

  tease: "I want to tell you something…",

  /** Pause (ms) after the tease appears, before the envelope opens */
  envelopeDelayMs: 2200,

  letter: {
    /** Drop a photo at this path, or leave empty for a placeholder slot */
    photo: "assets/photos/letter.jpg",
    message:
      "Write your letter here. This is the note that appears once the envelope opens — warm, personal, and just for her.",
  },

  reasonsIntro: "Here are 10 reasons why you're the best.",

  reasons: [
    "Reason 1 — replace me",
    "Reason 2 — replace me",
    "Reason 3 — replace me",
    "Reason 4 — replace me",
    "Reason 5 — replace me",
    "Reason 6 — replace me",
    "Reason 7 — replace me",
    "Reason 8 — replace me",
    "Reason 9 — replace me",
    "Reason 10 — replace me",
  ],

  twist:
    "Lol it's your 26th birthday — you think there would only be 10 reasons…? Fweaaaaakkkkkkinn! Here's 16 more.",

  moreReasons: [
    "Reason 11 — replace me",
    "Reason 12 — replace me",
    "Reason 13 — replace me",
    "Reason 14 — replace me",
    "Reason 15 — replace me",
    "Reason 16 — replace me",
    "Reason 17 — replace me",
    "Reason 18 — replace me",
    "Reason 19 — replace me",
    "Reason 20 — replace me",
    "Reason 21 — replace me",
    "Reason 22 — replace me",
    "Reason 23 — replace me",
    "Reason 24 — replace me",
    "Reason 25 — replace me",
    "Reason 26 — replace me",
  ],

  quizIntro: "Quick quiz — five questions, just for fun.",

  quiz: [
    {
      question: "Question 1 — replace me?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      /** Index of the “correct” answer (0-based). Wrong answers still advance. */
      correctIndex: 0,
      correctReply: "Exactly.",
      wrongReply: "Close enough — I'll allow it.",
    },
    {
      question: "Question 2 — replace me?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 1,
      correctReply: "You know us.",
      wrongReply: "Hmm… but cute try.",
    },
    {
      question: "Question 3 — replace me?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 2,
      correctReply: "Nailed it.",
      wrongReply: "We'll pretend that was right.",
    },
    {
      question: "Question 4 — replace me?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      correctReply: "Yes.",
      wrongReply: "Not quite — still love you.",
    },
    {
      question: "Question 5 — replace me?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 3,
      correctReply: "Perfect.",
      wrongReply: "Wrong answer, right person.",
    },
  ],

  finale: {
    message:
      "Write your closing message here — the last thing she sees, with a photo beside it.",
    photo: "assets/photos/finale.jpg",
  },
};
