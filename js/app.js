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

  /** Splits a reason's photos into the two columns that flank the text. */
  function reasonPhotoSides(item) {
    const columns = [[], []];
    if (item && typeof item !== "string") {
      const paths = Array.isArray(item.photos)
        ? item.photos.filter(Boolean)
        : item.photo
          ? [item.photo]
          : [];
      const tilts = [-4, 3, -2, 4, -3, 2];
      paths.forEach((path, i) => {
        const slot = photoSlot(
          path,
          "reason-photos__item",
          path,
          `--rot:${tilts[i % tilts.length]}deg`
        );
        columns[i % 2].push(slot);
      });
    }

    return {
      left: reasonSide("left", columns[0]),
      right: reasonSide("right", columns[1]),
    };
  }

  function reasonSide(side, slots) {
    // One or two photos get to be big; past that they pair up two per row.
    const width =
      slots.length === 1
        ? "min(100%, 13rem)"
        : slots.length === 2
          ? "min(100%, 11rem)"
          : "calc(50% - 0.5rem)";
    return `
      <div class="reason-side reason-side--${side}" style="--tile-w:${width}">
        ${slots.join("")}
      </div>
    `;
  }

  function photoSlot(path, aspectClass, labelPath, style = "") {
    const styleAttr = style ? ` style="${style}"` : "";
    return `
      <div class="photo-slot ${aspectClass}" data-photo-path="${escapeHtml(path || "")}"${styleAttr}>
        <span class="photo-slot__label">
          Add photo<br /><code>${escapeHtml(labelPath || path || "")}</code>
        </span>
        <img alt="" draggable="false" hidden />
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
      <div class="hero-screen mx-auto w-full max-w-xl text-center">
        <div class="hero-flowers" aria-hidden="true">
          <svg class="hero-flower hero-flower--l1" viewBox="0 0 64 72">
            <path class="flower-stem" d="M32 72 V38" />
            <ellipse class="flower-leaf" cx="24" cy="54" rx="8" ry="4" transform="rotate(-28 24 54)" />
            <ellipse class="flower-leaf" cx="40" cy="58" rx="7" ry="3.5" transform="rotate(30 40 58)" />
            <circle class="flower-petal flower-petal--rose" cx="32" cy="18" r="10" />
            <circle class="flower-petal flower-petal--rose" cx="18" cy="28" r="9" />
            <circle class="flower-petal flower-petal--rose" cx="46" cy="28" r="9" />
            <circle class="flower-petal flower-petal--rose" cx="22" cy="14" r="8" />
            <circle class="flower-petal flower-petal--rose" cx="42" cy="14" r="8" />
            <circle class="flower-center" cx="32" cy="22" r="6" />
          </svg>
          <svg class="hero-flower hero-flower--l2" viewBox="0 0 56 64">
            <path class="flower-stem" d="M28 64 V34" />
            <ellipse class="flower-leaf" cx="20" cy="48" rx="7" ry="3.5" transform="rotate(-25 20 48)" />
            <circle class="flower-petal flower-petal--gold" cx="28" cy="16" r="8" />
            <circle class="flower-petal flower-petal--gold" cx="16" cy="24" r="7" />
            <circle class="flower-petal flower-petal--gold" cx="40" cy="24" r="7" />
            <circle class="flower-petal flower-petal--gold" cx="20" cy="12" r="6.5" />
            <circle class="flower-petal flower-petal--gold" cx="36" cy="12" r="6.5" />
            <circle class="flower-center" cx="28" cy="20" r="5" />
          </svg>
          <svg class="hero-flower hero-flower--r1" viewBox="0 0 64 72">
            <path class="flower-stem" d="M32 72 V38" />
            <ellipse class="flower-leaf" cx="40" cy="54" rx="8" ry="4" transform="rotate(28 40 54)" />
            <ellipse class="flower-leaf" cx="24" cy="58" rx="7" ry="3.5" transform="rotate(-30 24 58)" />
            <circle class="flower-petal flower-petal--mint" cx="32" cy="18" r="10" />
            <circle class="flower-petal flower-petal--mint" cx="18" cy="28" r="9" />
            <circle class="flower-petal flower-petal--mint" cx="46" cy="28" r="9" />
            <circle class="flower-petal flower-petal--mint" cx="22" cy="14" r="8" />
            <circle class="flower-petal flower-petal--mint" cx="42" cy="14" r="8" />
            <circle class="flower-center" cx="32" cy="22" r="6" />
          </svg>
          <svg class="hero-flower hero-flower--r2" viewBox="0 0 56 64">
            <path class="flower-stem" d="M28 64 V34" />
            <ellipse class="flower-leaf" cx="36" cy="48" rx="7" ry="3.5" transform="rotate(25 36 48)" />
            <circle class="flower-petal flower-petal--rose" cx="28" cy="16" r="8" />
            <circle class="flower-petal flower-petal--rose" cx="16" cy="24" r="7" />
            <circle class="flower-petal flower-petal--rose" cx="40" cy="24" r="7" />
            <circle class="flower-petal flower-petal--rose" cx="20" cy="12" r="6.5" />
            <circle class="flower-petal flower-petal--rose" cx="36" cy="12" r="6.5" />
            <circle class="flower-center" cx="28" cy="20" r="5" />
          </svg>
        </div>
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
      <div class="mx-auto flex w-full max-w-sm flex-col items-center gap-5">
        <button type="button" class="letter-envelope" data-action="open-card" aria-label="${escapeHtml(config.card.openCta)}">
          <span class="letter-envelope__shadow" aria-hidden="true"></span>
          <span class="letter-envelope__flap"></span>
          <span class="letter-envelope__body">
            <span class="letter-envelope__lace" aria-hidden="true"></span>
            <span class="letter-envelope__stamp" aria-hidden="true">
              <svg viewBox="0 0 52 60">
                <rect class="stamp-border" x="4" y="4" width="44" height="52" rx="2" />
                <circle class="flower-petal flower-petal--rose" cx="26" cy="22" r="7" />
                <circle class="flower-petal flower-petal--rose" cx="18" cy="28" r="6" />
                <circle class="flower-petal flower-petal--rose" cx="34" cy="28" r="6" />
                <circle class="flower-center" cx="26" cy="26" r="4" />
                <text class="stamp-text" x="26" y="48" text-anchor="middle">26</text>
              </svg>
            </span>
            <span class="letter-envelope__address">
              <span class="letter-envelope__name">${escapeHtml(config.card.label)}</span>
              <span class="letter-envelope__rule" aria-hidden="true"></span>
            </span>
            <span class="letter-envelope__seal" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <circle class="seal-wax" cx="32" cy="32" r="24" />
                <circle class="seal-ring" cx="32" cy="32" r="18" />
                <path class="seal-heart" d="M32 42 C 22 34 18 28 22 23 C 25 19 30 20 32 24 C 34 20 39 19 42 23 C 46 28 42 34 32 42 Z" />
              </svg>
            </span>
          </span>
        </button>
        <p class="letter-hint">Tap the envelope to open</p>
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
      <div class="letter-paper mx-auto w-full max-w-md">
        <div class="letter-paper__inner">
          <div class="letter-paper__corner letter-paper__corner--tl" aria-hidden="true"></div>
          <div class="letter-paper__corner letter-paper__corner--tr" aria-hidden="true"></div>
          <div class="letter-paper__corner letter-paper__corner--bl" aria-hidden="true"></div>
          <div class="letter-paper__corner letter-paper__corner--br" aria-hidden="true"></div>
          <div class="letter-paper__flourish" aria-hidden="true">
            <svg viewBox="0 0 120 16">
              <path d="M8 8 C 28 2, 40 14, 60 8 C 80 2, 92 14, 112 8" />
              <circle cx="60" cy="8" r="2.5" />
            </svg>
          </div>
          <div class="letter-paper__polaroid">
            ${photoSlot(config.card.photo, "letter-paper__photo", "assets/photos/letter.jpg")}
          </div>
          <p class="letter-paper__message">
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
        ${withBreaks(config.reasonsIntro)}
      </h2>
    `;
  }

  function renderReason(index, list, offset = 1) {
    const n = offset + index;
    const item = list[index];
    const text = typeof item === "string" ? item : item?.text || "";
    const sides = reasonPhotoSides(item);
    return `
      <div class="reason-page mx-auto w-full max-w-6xl text-center">
        ${sides.left}
        <div class="reason-copy">
          <span class="reason-copy__badge">Reason ${n}</span>
          <p class="reason-copy__text">${escapeHtml(text)}</p>
        </div>
        ${sides.right}
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
        ${photoSlot(config.finale.photo, "finale-photo", "assets/photos/finale.jpg")}
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
        return renderReason(step.index, config.moreReasons, (config.reasons || []).length + 1);
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
    setupDraggablePhotos(stage);
    setupPhotoClicks(stage);
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
  setupLightbox();
  showStep(0);

  function setupLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  function openLightbox(src) {
    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightbox-image");
    if (!lightbox || !image || !src) return;
    image.src = src;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightbox-image");
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (image) image.removeAttribute("src");
  }

  function setupPhotoClicks(root) {
    root.querySelectorAll(".photo-slot:not(.reason-photos__item)").forEach((el) => {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", () => {
        const src = el.querySelector("img")?.src || el.getAttribute("data-photo-path");
        if (el.classList.contains("has-photo") && src) openLightbox(src);
      });
    });
  }

  function setupDraggablePhotos(root) {
    // Stay under the sticky nav (z-20) so a dragged photo never covers the buttons.
    let dragZ = 6;
    root.querySelectorAll(".reason-photos__item").forEach((el) => {
      el.addEventListener("pointerdown", (event) => {
        if (event.button != null && event.button !== 0) return;
        event.preventDefault();

        const startX = event.clientX;
        const startY = event.clientY;
        const originX = Number.parseFloat(el.style.getPropertyValue("--drag-x")) || 0;
        const originY = Number.parseFloat(el.style.getPropertyValue("--drag-y")) || 0;
        let moved = false;
        dragZ = dragZ >= 18 ? 7 : dragZ + 1;
        el.style.zIndex = String(dragZ);
        el.classList.add("is-dragging");
        el.setPointerCapture(event.pointerId);

        function onMove(moveEvent) {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
          el.style.setProperty("--drag-x", `${originX + dx}px`);
          el.style.setProperty("--drag-y", `${originY + dy}px`);
        }

        function onUp(upEvent) {
          el.classList.remove("is-dragging");
          el.releasePointerCapture(upEvent.pointerId);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);

          if (!moved && el.classList.contains("has-photo")) {
            const src = el.querySelector("img")?.src || el.getAttribute("data-photo-path");
            if (src) openLightbox(src);
          }
        }

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
      });
    });
  }

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
