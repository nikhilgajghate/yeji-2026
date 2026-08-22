/**
 * All customizable content lives here.
 * Swap the name, copy, reasons, quiz, and photo paths — no UI edits needed.
 */
window.YEJI_CONFIG = {
  name: "Yeji",

  nav: {
    back: "Gaurrr back babygoorlll?",
    next: "okay..?",
  },

  hero: {
    line: "Happy 26th birthday",
    cta: "Open",
    orShouldISay: "....or should I say",
    korean: "예지야, 스물여섯 번째 생일 축하해",
  },

  instructions: {
    title: "A little guide 4 u",
    body: "You see those two buttons down there?\n\nthat's how you navigate, okay?",
    cta: "Yeeeetttttuhh!",
  },

  tease: " But first, I want to tell you something...",

  card: {
    label: "For you",
    openCta: "Open",
    /** Shown right after she taps Open, before the card contents */
    afterOpenMessage: "Okayyy... here goes",
    /** Drop a photo at this path, or leave empty for a placeholder slot */
    photo: "assets/photos/letter.jpg",
    message:
      "LOLOLOLddd! You thought it would be that easy?? Fweeeeakinnnell give bubu a kiss first!",
  },

  afterLetter: [
    "one more",
    "ONE MORE!",
  ],

  reasonsIntro: "Okay that was goof! Now here's 10 reasons why you're the best.",

  reasons: [
    {
      text: "You're soo goofy! It lightens my mood and brightens my day",
      photo: "assets/photos/goofy.jpeg",
    },
    {
      text: "You're so beautiful. I'm not even kidding. You're a natural beauty.",
      photo: "assets/photos/you are a natural beauty.jpeg",
    },
    {
      text: "You taught me how to pose candidly for the camera!",
      photo: "assets/photos/you taught me how to take pose candidly.jpeg",
    },
    {
      text: "You have some bad habits but they're 0 calories and you're not drinking it as much!!",
      photo: "assets/photos/you have some bad habits but they're 0 calories and you're not drinking as much!!.jpeg",
    },
    {
      text: "You like cars",
      photo: "assets/photos/you like cars.jpeg",
    },
    {
      text: "You like cars pt 2",
      photo: "assets/photos/you like cars pt 2.jpeg",
    },
    {
      text: "Goofy pt 2",
      photo: "assets/photos/goofy pt 2.jpeg",
    },
    {
      text: "Goofy pt 3",
      photo: "assets/photos/goofy pt 3.jpeg",
    },
    {
      text: "Goofy pt 4",
      photo: "assets/photos/goofy pt 4.jpeg",
    },
    {
      text: "We like being goofy together",
      photo: "assets/photos/we like being goofy together.jpeg",
    },
  ],

  twist:
    "Lol it's your 26th birthday — you think there would only be 10 reasons…? Fweaaaaakkkkkkinn! Here's 16 more.",

  moreReasons: [
    {
      text: "Matching couple",
      photo: "assets/photos/matching couple.jpeg",
    },
    {
      text: "We are a unique couple",
      photo: "assets/photos/we are a unique couple.jpeg",
    },
    {
      text: "You have a great fashion sense",
      photo: "assets/photos/you have a great fashion sense.jpeg",
    },
    {
      text: "No really you have a great fashion sense",
      photo: "assets/photos/no really you have a great fashion sense.jpeg",
    },
    {
      text: "You look so peaceful",
      photo: "assets/photos/you look so peaceful.jpeg",
    },
    {
      text: "I can be myself with you",
      photo: "assets/photos/i can be myself with you.jpeg",
    },
    {
      text: "You have good taste in food",
      photo: "assets/photos/you have good taste in food.jpeg",
    },
    {
      text: "I don't have to worry about you because you're busy day dreaming",
      photo: "assets/photos/I dont have to worry about you because you're busy day dreaming.jpeg",
    },
    {
      text: "I like that you feel comfortable enough to nap around me",
      photo: "assets/photos/i like that you feel comfortable enough to nap around me.jpeg",
    },
    {
      text: "But damn you look good",
      photo: "assets/photos/but damn you look good.jpeg",
    },
    {
      text: "Look good pt 2",
      photo: "assets/photos/look good pt 2.jpeg",
    },
    {
      text: "Look good pt 3",
      photo: "assets/photos/look good pt 3.jpeg",
    },
    {
      text: "We are such a good looking couple",
      photo: "assets/photos/we are such a good looking couple.jpeg",
    },
    {
      text: "Stylish couple pt 2",
      photo: "assets/photos/stylish couple pt 2.jpeg",
    },
    {
      text: "Stylish couple pt 3",
      photo: "assets/photos/stylish couple pt 3.jpeg",
    },
    {
      text: "Stylish couple pt 4",
      photo: "assets/photos/stylish couple pt 4.jpeg",
    },
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
