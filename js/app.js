(() => {
  const config = window.YEJI_CONFIG;
  if (!config) {
    console.error("Missing YEJI_CONFIG from js/config.js");
    return;
  }

  const stage = document.getElementById("stage");
  const nav = document.getElementById("nav");
  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");

  const steps = buildSteps(config);
  let stepIndex = 0;
  /** @type {Record<number, { chosen: number, correct: boolean }>} */
  const quizState = {};

  function buildSteps(cfg) {
    const list = [
      { type: "hero" },
      { type: "hero-korean" },
      { type: "instructions" },
      { type: "tease" },
      { type: "card-closed" },
      { type: "card-after-open" },
      { type: "card-content" },
    ];

    (cfg.afterLetter || []).forEach((_, i) => list.push({ type: "after-letter", index: i }));
    list.push({ type: "reasons-intro" });

    (cfg.reasons || []).forEach((_, i) => list.push({ type: "reason", index: i }));
    list.push({ type: "twist" });
    (cfg.moreReasons || []).forEach((_, i) => list.push({ type: "more-reason", index: i }));
    list.push({ type: "quiz-intro" });
    (cfg.quiz || []).forEach((_, i) => list.push({ type: "quiz", index: i }));
    list.push({ type: "finale" });
    return list;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function withBreaks(str) {
    return escapeHtml(str).replaceAll("\n", "<br />");
  }

  function photoSlot(path, aspectClass, labelPath) {
    return `
      <div class="photo-slot ${aspectClass} w-full rounded-2xl border border-dashed border-base-content/25" data-photo-path="${escapeHtml(path || "")}">
        <span class="photo-slot__label absolute inset-0 grid place-content-center p-4 text-center text-sm text-base-content/60">
          Add photo<br /><code class="text-xs break-all">${escapeHtml(labelPath || path || "")}</code>
        </span>
        <img alt="" hidden />
      </div>
    `;
  }

  function loadPhotos(root) {
    root.querySelectorAll("[data-photo-path]").forEach((slot) => {
      const path = slot.getAttribute("data-photo-path");
      const img = slot.querySelector("img");
      if (!path || !img) return;

      const probe = new Image();
      probe.onload = () => {
        img.src = path;
        img.hidden = false;
        slot.classList.add("has-photo");
        slot.classList.remove("border-dashed");
      };
      probe.onerror = () => {
        img.hidden = true;
        slot.classList.remove("has-photo");
      };
      probe.src = path;
    });
  }

  function renderHero() {
    return `
      <div class="mx-auto w-full max-w-xl text-center">
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-base-content/65 sm:text-base">
          ${escapeHtml(config.hero.line)}
        </p>
        <h1 class="font-display mb-10 text-[clamp(4.25rem,18vw,8.5rem)] font-extrabold leading-[0.9] tracking-tight">
          ${escapeHtml(config.name)}
        </h1>
        <button type="button" class="btn btn-neutral rounded-2xl px-10" data-action="next">
          ${escapeHtml(config.hero.cta)}
        </button>
      </div>
    `;
  }

  function renderHeroKorean() {
    return `
      <div class="mx-auto w-full max-w-xl text-center">
        <p class="mb-4 text-lg italic text-base-content/70 sm:text-xl">
          ${escapeHtml(config.hero.orShouldISay)}
        </p>
        <p class="font-display mb-10 text-3xl font-bold leading-snug tracking-tight sm:text-4xl md:text-5xl">
          ${escapeHtml(config.hero.korean)}
        </p>
        <button type="button" class="btn btn-neutral rounded-2xl px-10" data-action="next">
          ${escapeHtml(config.hero.cta)}
        </button>
      </div>
    `;
  }

  function renderInstructions() {
    return `
      <div class="card mx-auto w-full max-w-xl rounded-[2rem] border border-base-content/10 bg-base-100/90 shadow-lg backdrop-blur-sm">
        <div class="card-body gap-5 px-8 py-10 sm:px-12 sm:py-12">
          <h2 class="font-display text-center text-3xl font-bold tracking-tight sm:text-4xl">
            ${escapeHtml(config.instructions.title)}
          </h2>
          <p class="text-center text-lg leading-relaxed text-base-content/75 sm:text-xl">
            ${withBreaks(config.instructions.body)}
          </p>
        </div>
      </div>
    `;
  }

  function renderTease() {
    return `
      <p class="font-display mx-auto max-w-lg text-center text-3xl font-semibold italic leading-snug sm:text-4xl">
        ${escapeHtml(config.tease)}
      </p>
    `;
  }

  function renderCardClosed() {
    return `
      <div class="mx-auto flex w-full max-w-sm flex-col items-center gap-6">
        <div class="card w-full rounded-[1.75rem] border border-base-content/10 bg-gradient-to-br from-accent/30 via-base-100 to-secondary/20 shadow-xl">
          <div class="card-body min-h-64 items-center justify-center gap-4 py-14 text-center">
            <p class="font-display text-lg italic text-base-content/70">${escapeHtml(config.card.label)}</p>
            <p class="font-display text-3xl font-bold tracking-tight">${escapeHtml(config.name)}</p>
            <button type="button" class="btn btn-neutral mt-2 rounded-2xl px-8" data-action="open-card">
              ${escapeHtml(config.card.openCta)}
            </button>
          </div>
        </div>
        <p class="text-sm text-base-content/55"></p>
      </div>
    `;
  }

  function renderCardAfterOpen() {
    return `
      <p class="font-display mx-auto max-w-lg text-center text-3xl font-semibold leading-snug sm:text-4xl">
        ${escapeHtml(config.card.afterOpenMessage)}
      </p>
    `;
  }

  function renderCardContent() {
    return `
      <div class="card mx-auto w-full max-w-md rounded-[1.75rem] border border-base-content/10 bg-base-100/95 shadow-xl">
        <div class="card-body gap-4 p-5 sm:p-7">
          ${photoSlot(config.card.photo, "aspect-[4/3]", "assets/photos/letter.jpg")}
          <p class="text-base leading-relaxed text-base-content/80 sm:text-lg">
            ${escapeHtml(config.card.message)}
          </p>
        </div>
      </div>
    `;
  }

  function renderAfterLetter(index) {
    const text = (config.afterLetter || [])[index];
    if (!text) return "";
    return `
      <p class="font-display mx-auto max-w-lg text-center text-3xl font-semibold leading-snug sm:text-4xl">
        ${escapeHtml(text)}
      </p>
    `;
  }

  function renderReasonsIntro() {
    return `
      <h2 class="font-display mx-auto max-w-xl text-center text-3xl font-bold leading-snug sm:text-4xl">
        ${escapeHtml(config.reasonsIntro)}
      </h2>
    `;
  }

  function renderReason(index, list, offset = 1) {
    const n = offset + index;
    const item = list[index];
    const text = typeof item === "string" ? item : item?.text || "";
    const photo = typeof item === "object" ? item?.photo || "" : "";
    return `
      <div class="mx-auto flex w-full max-w-md flex-col items-center gap-5 text-center">
        ${photo ? photoSlot(photo, "aspect-[4/5] max-w-sm", photo) : ""}
        <div class="flex w-full flex-col gap-2">
          <p class="font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Reason ${n}
          </p>
          <p class="font-display text-2xl font-semibold leading-snug sm:text-3xl">
            ${escapeHtml(text)}
          </p>
        </div>
      </div>
    `;
  }

  function renderTwist() {
    return `
      <p class="font-display mx-auto max-w-2xl text-center text-2xl font-semibold leading-snug sm:text-3xl md:text-4xl">
        ${escapeHtml(config.twist)}
      </p>
    `;
  }

  function renderQuizIntro() {
    return `
      <p class="font-display mx-auto max-w-lg text-center text-3xl font-bold leading-snug sm:text-4xl">
        ${escapeHtml(config.quizIntro)}
      </p>
    `;
  }

  function renderQuiz(index) {
    const q = config.quiz[index];
    if (!q) return "";

    const answered = quizState[index];
    const options = q.options
      .map((label, i) => {
        let extra = "btn-outline";
        if (answered != null) {
          if (i === q.correctIndex) extra = "btn-secondary";
          else if (i === answered.chosen && !answered.correct) extra = "btn-error";
          else extra = "btn-ghost opacity-60";
        }
        return `
          <button
            type="button"
            class="btn ${extra} h-auto min-h-12 justify-start whitespace-normal rounded-2xl px-4 py-3 text-left font-medium"
            data-action="quiz-answer"
            data-option="${i}"
            ${answered != null ? "disabled" : ""}
          >${escapeHtml(label)}</button>
        `;
      })
      .join("");

    const reply =
      answered != null
        ? `<p class="font-display mt-2 text-lg italic text-base-content/70">${escapeHtml(
            answered.correct ? q.correctReply : q.wrongReply
          )}</p>`
        : "";

    return `
      <div class="mx-auto w-full max-w-lg text-center">
        <p class="mb-2 text-sm uppercase tracking-[0.12em] text-base-content/55">
          ${index + 1} / ${config.quiz.length}
        </p>
        <h2 class="font-display mb-6 text-2xl font-bold leading-snug sm:text-3xl">
          ${escapeHtml(q.question)}
        </h2>
        <div class="flex flex-col gap-2">${options}</div>
        ${reply}
      </div>
    `;
  }

  function renderFinale() {
    return `
      <div class="mx-auto flex w-full max-w-md flex-col items-center text-center">
        ${photoSlot(config.finale.photo, "aspect-[3/4] max-w-xs", "assets/photos/finale.jpg")}
        <p class="font-display mt-6 text-2xl font-semibold leading-snug sm:text-3xl">
          ${escapeHtml(config.finale.message)}
        </p>
        <p class="mt-4 text-sm uppercase tracking-[0.14em] text-base-content/55">— with love</p>
      </div>
    `;
  }

  function renderStep(step) {
    switch (step.type) {
      case "hero":
        return renderHero();
      case "hero-korean":
        return renderHeroKorean();
      case "instructions":
        return renderInstructions();
      case "tease":
        return renderTease();
      case "card-closed":
        return renderCardClosed();
      case "card-after-open":
        return renderCardAfterOpen();
      case "card-content":
        return renderCardContent();
      case "after-letter":
        return renderAfterLetter(step.index);
      case "reasons-intro":
        return renderReasonsIntro();
      case "reason":
        return renderReason(step.index, config.reasons, 1);
      case "twist":
        return renderTwist();
      case "more-reason":
        return renderReason(step.index, config.moreReasons, 11);
      case "quiz-intro":
        return renderQuizIntro();
      case "quiz":
        return renderQuiz(step.index);
      case "finale":
        return renderFinale();
      default:
        return "";
    }
  }

  function canGoNext() {
    const step = steps[stepIndex];
    if (!step) return false;
    if (stepIndex >= steps.length - 1) return false;
    if (step.type === "card-closed") return false;
    if (step.type === "quiz") return quizState[step.index] != null;
    return true;
  }

  function updateNav() {
    const step = steps[stepIndex];
    const showNav = step.type !== "hero" && step.type !== "hero-korean";
    nav.hidden = !showNav;

    btnBack.textContent = config.nav.back;
    btnNext.textContent = config.nav.next;

    btnBack.disabled = stepIndex <= 0;
    btnNext.disabled = !canGoNext();
    btnBack.classList.toggle("btn-disabled", btnBack.disabled);
    btnNext.classList.toggle("btn-disabled", btnNext.disabled);

    if (step.type === "card-closed") {
      btnNext.title = "Open the card first";
    } else if (step.type === "quiz" && quizState[step.index] == null) {
      btnNext.title = "Pick an answer first";
    } else {
      btnNext.removeAttribute("title");
    }
  }

  function showStep(index) {
    stepIndex = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[stepIndex];
    stage.innerHTML = renderStep(step);
    loadPhotos(stage);
    updateNav();
    document.title = `For ${config.name}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    if (!canGoNext()) return;
    showStep(stepIndex + 1);
  }

  function goBack() {
    if (stepIndex > 0) showStep(stepIndex - 1);
  }

  function onOpenCard() {
    if (steps[stepIndex]?.type !== "card-closed") return;
    showStep(stepIndex + 1);
  }

  function onQuizAnswer(optionIndex) {
    const step = steps[stepIndex];
    if (step?.type !== "quiz" || quizState[step.index] != null) return;

    const q = config.quiz[step.index];
    quizState[step.index] = {
      chosen: optionIndex,
      correct: optionIndex === q.correctIndex,
    };
    showStep(stepIndex);
  }

  stage.addEventListener("click", (event) => {
    if (event.target.closest("[data-action='next']")) {
      goNext();
      return;
    }
    if (event.target.closest("[data-action='open-card']")) {
      onOpenCard();
      return;
    }
    const answerBtn = event.target.closest("[data-action='quiz-answer']");
    if (answerBtn) onQuizAnswer(Number(answerBtn.dataset.option));
  });

  btnBack.addEventListener("click", goBack);
  btnNext.addEventListener("click", goNext);

  setupBalloons();
  showStep(0);

  function setupBalloons() {
    document.querySelectorAll(".balloon").forEach((balloon) => {
      balloon.addEventListener("click", () => popBalloon(balloon));
    });
  }

  function popBalloon(balloon) {
    if (balloon.classList.contains("is-popped")) return;

    const rect = balloon.getBoundingClientRect();
    balloon.style.animation = "none";
    balloon.style.transform = "none";
    balloon.style.top = `${rect.top}px`;
    balloon.style.left = `${rect.left}px`;
    balloon.classList.add("is-popped");

    playPopSound();
    window.setTimeout(() => respawnBalloon(balloon), 2600);
  }

  function respawnBalloon(balloon) {
    balloon.classList.remove("is-popped");
    balloon.style.top = "0";
    balloon.style.left = `${8 + Math.random() * 76}%`;
    balloon.style.transform = "";
    balloon.style.animation = "none";
    void balloon.offsetWidth;
    balloon.style.animation = "";
  }

  function playPopSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = playPopSound.ctx || new AudioCtx();
    playPopSound.ctx = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.14);
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }
})();
