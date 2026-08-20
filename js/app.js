(() => {
  const config = window.YEJI_CONFIG;
  if (!config) {
    console.error("Missing YEJI_CONFIG from js/config.js");
    return;
  }

  const SCENES = ["hero", "instructions", "letter", "reasons", "more", "quiz", "finale"];

  const app = document.getElementById("app");
  const scenes = Object.fromEntries(
    SCENES.map((id) => [id, app.querySelector(`[data-scene="${id}"]`)])
  );

  let sceneIndex = 0;
  let quizIndex = 0;
  let quizAnswered = false;

  function getByPath(path) {
    return path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), config);
  }

  function bindText() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const value = getByPath(el.dataset.bind);
      if (value != null) el.textContent = String(value);
    });

    document.querySelectorAll("[data-bind-text]").forEach((el) => {
      const value = getByPath(el.dataset.bindText);
      if (value != null) el.textContent = String(value);
    });

    document.title = `For ${config.name}`;
  }

  function loadPhotoSlots() {
    document.querySelectorAll("[data-photo]").forEach((slot) => {
      const path = getByPath(slot.dataset.photo);
      const img = slot.querySelector("img");
      if (!path || !img) return;

      const probe = new Image();
      probe.onload = () => {
        img.src = path;
        img.alt = "";
        img.hidden = false;
        slot.classList.add("has-photo");
      };
      probe.onerror = () => {
        img.hidden = true;
        slot.classList.remove("has-photo");
      };
      probe.src = path;
    });
  }

  function renderReasons(listEl, items) {
    if (!listEl) return;
    listEl.innerHTML = items
      .map((text) => `<li>${escapeHtml(text)}</li>`)
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function showScene(index) {
    sceneIndex = index;
    const id = SCENES[index];

    SCENES.forEach((sceneId) => {
      const el = scenes[sceneId];
      const active = sceneId === id;
      el.classList.toggle("is-active", active);
      el.hidden = !active;
    });

    if (id === "letter") startLetterSequence();
    if (id === "reasons") revealList(scenes.reasons.querySelector("[data-reasons-list]"));
    if (id === "more") revealList(scenes.more.querySelector("[data-more-reasons-list]"));
    if (id === "quiz") renderQuizQuestion();
  }

  function nextScene() {
    if (sceneIndex < SCENES.length - 1) showScene(sceneIndex + 1);
  }

  function startLetterSequence() {
    const stage = scenes.letter.querySelector(".letter-stage");
    const envelope = scenes.letter.querySelector("[data-envelope]");
    const continueBtn = scenes.letter.querySelector("[data-action='next']");
    const tease = scenes.letter.querySelector(".tease");

    stage.classList.remove("is-revealed");
    envelope.classList.remove("is-visible", "is-open");
    continueBtn.hidden = true;
    tease.classList.remove("is-dimmed");

    const delay = Number(config.envelopeDelayMs) || 2200;

    window.setTimeout(() => {
      envelope.classList.add("is-visible");
    }, Math.min(600, delay / 2));

    window.setTimeout(() => {
      tease.classList.add("is-dimmed");
      envelope.classList.add("is-open");
    }, delay);

    window.setTimeout(() => {
      stage.classList.add("is-revealed");
      continueBtn.hidden = false;
    }, delay + 1600);
  }

  function revealList(listEl) {
    if (!listEl) return;
    const items = [...listEl.querySelectorAll("li")];
    items.forEach((li) => li.classList.remove("is-shown"));
    items.forEach((li, i) => {
      window.setTimeout(() => li.classList.add("is-shown"), 120 + i * 90);
    });
  }

  function renderQuizQuestion() {
    const quiz = config.quiz || [];
    const q = quiz[quizIndex];
    if (!q) {
      nextScene();
      return;
    }

    quizAnswered = false;

    const progress = scenes.quiz.querySelector("[data-quiz-progress]");
    const question = scenes.quiz.querySelector("[data-quiz-question]");
    const options = scenes.quiz.querySelector("[data-quiz-options]");
    const reply = scenes.quiz.querySelector("[data-quiz-reply]");
    const nextBtn = scenes.quiz.querySelector("[data-quiz-next]");

    progress.textContent = `${quizIndex + 1} / ${quiz.length}`;
    question.textContent = q.question;
    reply.hidden = true;
    reply.textContent = "";
    nextBtn.hidden = true;

    options.innerHTML = "";
    q.options.forEach((label, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz__option";
      btn.textContent = label;
      btn.addEventListener("click", () => onQuizAnswer(i, q, btn, options, reply, nextBtn));
      options.appendChild(btn);
    });
  }

  function onQuizAnswer(index, question, chosenBtn, optionsEl, replyEl, nextBtn) {
    if (quizAnswered) return;
    quizAnswered = true;

    const correct = index === question.correctIndex;
    [...optionsEl.querySelectorAll(".quiz__option")].forEach((btn, i) => {
      btn.disabled = true;
      if (i === question.correctIndex) btn.classList.add("is-correct");
      if (i === index && !correct) btn.classList.add("is-wrong");
    });

    replyEl.textContent = correct ? question.correctReply : question.wrongReply;
    replyEl.hidden = false;
    nextBtn.hidden = false;
    nextBtn.textContent = quizIndex >= (config.quiz.length - 1) ? "See the ending" : "Next";
  }

  function advanceQuiz() {
    if (quizIndex >= config.quiz.length - 1) {
      nextScene();
      return;
    }
    quizIndex += 1;
    renderQuizQuestion();
  }

  function wireActions() {
    app.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action='next']");
      if (target && app.contains(target)) {
        nextScene();
        return;
      }

      const quizNext = event.target.closest("[data-quiz-next]");
      if (quizNext && app.contains(quizNext)) {
        advanceQuiz();
      }
    });
  }

  function init() {
    bindText();
    loadPhotoSlots();
    renderReasons(scenes.reasons.querySelector("[data-reasons-list]"), config.reasons || []);
    renderReasons(
      scenes.more.querySelector("[data-more-reasons-list]"),
      config.moreReasons || []
    );
    wireActions();
    showScene(0);
  }

  init();
})();
