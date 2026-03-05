(function () {
  "use strict";

  let wordSets = [];
  let dailyWords = [];
  /** Category-based daily: L1=animals, L2=fruitsAndFood, L3=other. When a pool is exhausted, that level uses the next pool. */
  let dailyWordsLevel1Order = [];
  let dailyWordsLevel2Order = [];
  let dailyWordsLevel3Order = [];
  let currentSet = null;
  let currentLevel = 1;
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedCount = 0;
  let uiLang = "en";
  let roundScore = 0;
  let sessionScore = 0;
  let roundStartTime = 0;
  let timerInterval = null;
  let currentLevelCompleted = false;
  let highestLevelPassed = 0;
  let matchStreak = 0;

  const gameArea = document.getElementById("game-area");
  const gameBoardWrap = document.querySelector(".game-board-wrap");
  const setSelect = document.getElementById("set-select");
  const levelSelect = document.getElementById("level-select");
  const levelLabel = document.getElementById("level-label");
  const levelSelectRow = document.getElementById("level-select-row");
  const practiceLevelStrip = document.getElementById("practice-level-strip");
  const dailyLevelWrap = document.getElementById("daily-level-wrap");
  const dailyLevelDisplay = document.getElementById("daily-level-display");
  const nextBtn = document.getElementById("next-btn");
  const winMessage = document.getElementById("win-message");
  const winNextBtn = document.getElementById("win-next-btn");
  const winReplayBtn = document.getElementById("win-replay-btn");
  const winBackBtn = document.getElementById("win-back-btn");
  const winText = document.getElementById("win-text");
  const timerText = document.getElementById("timer-text");
  const scoreValue = document.getElementById("score-value");
  const progressText = document.getElementById("progress-text");
  const scoreLabel = document.getElementById("score-label");

  const UI = {
    en: {
      title: "Chinese & English Matching Game",
      heading: "Match the Words!",
      instruction: "Click two cards to find matching pairs — Chinese and English.",
      options: "OPTIONS",
      chooseSet: "Choose a set:",
      level: "Level:",
      next: "Next",
      replay: "Replay",
      backToStart: "Back to start",
      score: "SCORE:",
      time: "TIME:",
      youDidIt: "You did it! Great job!",
      progress: "Level {level}/{maxLevel} · {pairs} pairs",
      loading: "Loading...",
      memorize: "Remember the cards!",
      go: "Go!",
      modeDaily: "Daily (2/day)",
      dailyProgress: "Daily {n}/2",
      doneForTodayTitle: "You're all done for today! 🎉",
      doneForToday: "You've completed both daily levels. Come back tomorrow for a new set of challenges — see you then!",
      doneForTodayShort: "Today's challenge complete!",
      backToStart: "Back to start",
      partners: "Check Out Our Game Sponsors",
      sponsors: "Check Out Our Game Sponsors",
      supportTheGame: "Check Out Our Game Sponsors",
      redirectHint: "Opens in a new tab.",
      thankYouSponsor: "Thanks for visiting.",
      blockerHint: "If nothing opened, try allowing this site in your blocker.",
      yourStreak: "Your streak",
      darkMode: "Dark mode",
      pageContentRulesTitle: "Game Rules",
      pageContentRulesIntro: "Match the Words! is one of the simplest ways to practice Chinese and English vocabulary. The rules have been kept clear so you can start playing right away. What follows are the basic rules; scroll down for setup, aim of the game, and how to make a move.",
      pageContentSetupTitle: "Setup",
      pageContentSetupText: "The game is played with 12 cards per level, arranged in a grid. Each of the 6 pairs has one card showing a word in Chinese and one card showing the same meaning in English, with an emoji hint on each card. At the start of a level you get a short preview to memorize positions; then the cards turn face-down and the timer starts.",
      pageContentAim: "The Aim of the Game",
      pageContentAimText: "Match all 6 Chinese–English pairs before time runs out. You have two levels per day. The game ends in a win when you match every pair in a level; if time runs out before that, you can retry the level. Build a daily streak by playing each day. Once you complete both levels, you're done for the day — come back tomorrow for a new set of words.",
      pageContentMoveTitle: "Making a Move",
      pageContentMoveText: "Click two cards to flip them face-up. If they form a matching pair (same word in Chinese and English), they stay revealed and you can pick another pair. If they don't match, they flip back after a short moment. Use the preview at the start of each level to remember where each pair is, then find all 6 pairs to finish the level.",
      pageContentDaily: "Daily Challenge",
      pageContentDailyText: "Level 1 focuses on animals, Level 2 on fruits and food. Each day you get a fresh set of 12 word pairs (6 per level). Complete both levels and return the next day for new vocabulary.",
      pageContentAboutTitle: "About Match the Words!",
      pageContentAbout1: "The main purpose of this game is to let you practice Chinese and English vocabulary in a simple, stress-free way. No accounts, no scoreboards, no sign-up — just open the page and play. Many language sites are powerful but busy; here we aim to be the simplest daily matching game for Chinese–English learners.",
      pageContentAbout2: "We built Match the Words! for anyone who wants to reinforce vocabulary a few minutes a day: students, casual learners, and anyone brushing up on Chinese or English. The daily limit of 2 levels keeps it short and encourages coming back tomorrow. We hope you enjoy it and that it helps you learn a few new words every day."
    },
    zh: {
      title: "中英词语配对游戏",
      heading: "配对词语！",
      instruction: "点击两张卡片找出配对 — 中文与英文。",
      options: "选项",
      chooseSet: "选择一组：",
      level: "级别：",
      next: "下一关",
      replay: "再玩一次",
      backToStart: "返回开始",
      score: "得分：",
      time: "时间：",
      youDidIt: "完成了！真棒！",
      progress: "第 {level}/{maxLevel} 关 · {pairs} 对",
      loading: "加载中...",
      memorize: "记住卡片位置！",
      go: "开始！",
      modeDaily: "每日（2次/天）",
      dailyProgress: "今日 {n}/2",
      doneForTodayTitle: "今日任务已完成！🎉",
      doneForToday: "您已完成今日全部 2 关。明天再来，会有新的挑战等着你哦！",
      doneForTodayShort: "今日挑战完成！",
      backToStart: "返回开始",
      partners: "我们的合作伙伴",
      sponsors: "查看我们的游戏赞助商",
      supportTheGame: "查看我们的游戏赞助商",
      redirectHint: "在新标签页中打开。",
      thankYouSponsor: "感谢访问。",
      blockerHint: "若未打开新页面，请尝试在拦截器中允许此网站。",
      yourStreak: "连续天数",
      darkMode: "深色模式",
      pageContentRulesTitle: "游戏规则",
      pageContentRulesIntro: "「配对词语！」是练习中英词汇最简单的方式之一，规则清晰，打开即可开玩。以下为基本规则；向下滚动可查看准备、游戏目标与如何翻牌。",
      pageContentSetupTitle: "准备",
      pageContentSetupText: "每关有 12 张卡片，排成网格。6 对中每对有一张中文、一张对应英文，并配有表情提示。每关开始会有短暂预览供你记忆位置，之后卡片翻面，计时开始。",
      pageContentAim: "游戏目标",
      pageContentAimText: "在时间结束前配对全部 6 对中英词语。每天共有 2 关。当某一关的 6 对全部配对完成即过关；若时间到仍未完成，可重试该关。每天游玩可累积连续天数。完成 2 关后今日即告一段落，明天再来会有新词。",
      pageContentMoveTitle: "如何翻牌",
      pageContentMoveText: "点击两张卡片翻开。若为同一词的中英配对，则保持翻开并继续选下一对；若不配对，短暂显示后会翻回。利用每关开始的预览记住位置，找出全部 6 对即可过关。",
      pageContentDaily: "每日挑战",
      pageContentDailyText: "第 1 关以动物为主，第 2 关是水果与食物。每天会有一组新的 12 对词（每关 6 对）。完成两关后，次日再来即可获得新词汇。",
      pageContentAboutTitle: "关于「配对词语！」",
      pageContentAbout1: "本游戏旨在让你用最简单、无压力的方式练习中英词汇。无需注册、无需记分、打开即玩。许多语言学习站功能多但界面繁杂；我们则希望成为最简洁的中英每日配对游戏。",
      pageContentAbout2: "我们为所有想每天花几分钟巩固词汇的人打造「配对词语！」：学生、休闲学习者、复习中英文的任何人。每日 2 关的设计简短好坚持，并鼓励你明天再来。希望你喜欢，并每天多学几个词。"
    }
  };

  const PARTNERS_URL = "https://omg10.com/4/10629150";

  const setNames = {
    en: { animals: "Animals", colors: "Colors", numbers: "Numbers", family: "Family", verbs: "Verbs", daily: "Today's challenge" },
    zh: { animals: "动物", colors: "颜色", numbers: "数字", family: "家庭", verbs: "动词", daily: "今日挑战" }
  };

  const PAIRS_PER_LEVEL = 6;
  const POINTS_PER_MATCH = 10;
  const STREAK_BONUS_PER_MATCH = 5;
  const ROUND_TIME_SECONDS = 180;
  const PREVIEW_SECONDS = 6;
  const TIME_BONUS_MAX = 50;
  const TIME_BONUS_UNDER_SECONDS = 30;
  let previewTimeoutId = null;
  let previewCountdownInterval = null;
  const STARS_REQUIRED_TO_UNLOCK = 2;
  const DAILY_CHALLENGE_LEVELS = 2;
  /* Unique prefix so this site does not share localStorage with other similar games */
  const STORAGE_PREFIX = "ceMatchWords_omg_";
  const STORAGE_KEY_MODE = STORAGE_PREFIX + "Mode";
  const STORAGE_KEY_DAILY_PREFIX = STORAGE_PREFIX + "Daily_";
  const STORAGE_KEY_LANG = STORAGE_PREFIX + "Lang";
  const STORAGE_KEY_SPONSOR_DATE = STORAGE_PREFIX + "SponsorClickDate";
  const STORAGE_KEY_LAST_DAILY_DATE = STORAGE_PREFIX + "LastDailyDate";
  const STORAGE_KEY_STREAK = STORAGE_PREFIX + "Streak";
  const STORAGE_KEY_CELEBRATION_MILESTONES = STORAGE_PREFIX + "CelebrationMilestones";
  const STORAGE_KEY_THEME = STORAGE_PREFIX + "Theme";
  const CELEBRATION_MILESTONES = [1, 7, 30, 100, 200, 365, 500, 1000];
  const STREAK_EMOJI = "🔥";
  const TITLE_TIERS = [
    { min: 0, en: "Learner", zh: "学习者", badges: "" },
    { min: 100, en: "Bronze Learner", zh: "铜牌学习者", badges: "🥉" },
    { min: 500, en: "Silver Scholar", zh: "银牌学者", badges: "🥉🥈" },
    { min: 1000, en: "Gold Master", zh: "金牌大师", badges: "🥉🥈🥇" },
    { min: 2000, en: "Language Major", zh: "语言专家", badges: "🥉🥈🥇🎖️" },
    { min: 5000, en: "Grandmaster General", zh: "全能大师", badges: "🥉🥈🥇🎖️⚔️" }
  ];

  const BG_MUSIC_SOURCES = ["bg1.mp3", "bg2.mp3", "bg3.mp3"];
  let bgMusicIndex = 0;
  let bgAudio = null;
  let bgMusicStarted = false;

  function playNextBgTrack() {
    if (!bgAudio || !BG_MUSIC_SOURCES.length) return;
    const src = BG_MUSIC_SOURCES[bgMusicIndex];
    bgAudio.src = src;
    bgAudio.volume = 0.35;
    bgAudio.loop = false;
    bgAudio.onended = function () {
      bgMusicIndex = (bgMusicIndex + 1) % BG_MUSIC_SOURCES.length;
      playNextBgTrack();
    };
    bgAudio.onerror = function () {
      bgMusicIndex = (bgMusicIndex + 1) % BG_MUSIC_SOURCES.length;
      playNextBgTrack();
    };
    bgAudio.play().catch(function () {});
  }

  function startBgMusic() {
    if (bgMusicStarted) return;
    bgMusicStarted = true;
    try {
      bgAudio = new Audio();
      playNextBgTrack();
    } catch (_) {}
  }

  function onPageVisibilityChange() {
    if (!bgAudio) return;
    if (document.hidden) {
      bgAudio.pause();
    } else if (bgMusicStarted) {
      bgAudio.play().catch(function () {});
    }
  }

  if (typeof document.hidden !== "undefined") {
    document.addEventListener("visibilitychange", onPageVisibilityChange);
  }

  function playSound(type) {
    try {
      const ctx = window.audioCtx || (window.audioCtx = new (window.AudioContext || window.webkitAudioContext)());
      if (ctx.state === "suspended") {
        ctx.resume().then(function () { playSound(type); }).catch(function () {});
        return;
      }
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      if (type === "flip") {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "match") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "win") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.24);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (_) {}
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    roundStartTime = Date.now();
    timerText.textContent = formatTime(ROUND_TIME_SECONDS);
    timerInterval = setInterval(function () {
      const elapsed = Math.floor((Date.now() - roundStartTime) / 1000);
      const remaining = Math.max(0, ROUND_TIME_SECONDS - elapsed);
      timerText.textContent = formatTime(remaining);
      if (remaining <= 0) {
        stopTimer();
        if (matchedCount < PAIRS_PER_LEVEL) handleTimeUp();
      }
    }, 500);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function getElapsedSeconds() {
    return roundStartTime ? Math.floor((Date.now() - roundStartTime) / 1000) : 0;
  }

  function clearPreview() {
    if (previewTimeoutId) { clearTimeout(previewTimeoutId); previewTimeoutId = null; }
    if (previewCountdownInterval) { clearInterval(previewCountdownInterval); previewCountdownInterval = null; }
    const overlay = gameBoardWrap && gameBoardWrap.querySelector(".preview-overlay");
    if (overlay) overlay.remove();
    const optionsPanel = document.querySelector(".options-panel");
    if (optionsPanel) optionsPanel.classList.remove("preview-active");
  }

  function startPlay() {
    cards.forEach(function (card) { card.classList.remove("flipped"); });
    lockBoard = false;
    startTimer();
  }

  function computeTimeBonus(seconds) {
    if (seconds <= TIME_BONUS_UNDER_SECONDS) {
      return Math.max(0, TIME_BONUS_MAX - Math.floor((seconds / TIME_BONUS_UNDER_SECONDS) * TIME_BONUS_MAX));
    }
    return 0;
  }

  function getTitleForScore(score) {
    let tier = TITLE_TIERS[0];
    for (let i = TITLE_TIERS.length - 1; i >= 0; i--) {
      if (score >= TITLE_TIERS[i].min) {
        tier = TITLE_TIERS[i];
        break;
      }
    }
    return tier;
  }

  function updateTitleDisplay() {
    const el = document.getElementById("title-display");
    if (!el) return;
    const tier = getTitleForScore(sessionScore);
    const name = uiLang === "zh" ? tier.zh : tier.en;
    const badgeStr = tier.badges ? " " + tier.badges : "";
    el.textContent = name + badgeStr;
    el.setAttribute("aria-label", name);
  }

  function updateProgress() {
    if (!progressText) return;
    const level = currentLevel || 1;
    const maxLevel = currentSet ? getMaxLevel(currentSet) : 10;
    progressText.textContent = (UI[uiLang].progress || UI.en.progress)
      .replace("{level}", level)
      .replace("{maxLevel}", maxLevel)
      .replace("{pairs}", matchedCount + "/" + PAIRS_PER_LEVEL);
    const levelFill = document.getElementById("level-progress-fill");
    const levelBar = document.querySelector(".level-progress-bar");
    if (levelFill && levelBar) {
      const levelPct = maxLevel ? (level / maxLevel) * 100 : 0;
      levelFill.style.width = levelPct + "%";
      levelBar.setAttribute("aria-valuenow", level);
      levelBar.setAttribute("aria-valuemax", maxLevel);
    }
    const pairsFill = document.getElementById("progress-bar-fill");
    const pairsBar = document.getElementById("pairs-progress-bar");
    if (pairsFill && pairsBar) {
      const pct = PAIRS_PER_LEVEL ? (matchedCount / PAIRS_PER_LEVEL) * 100 : 0;
      pairsFill.style.width = pct + "%";
      pairsBar.setAttribute("aria-valuenow", matchedCount);
      pairsBar.setAttribute("aria-valuemax", PAIRS_PER_LEVEL);
    }
  }

  function updateScoreDisplay() {
    if (scoreValue) scoreValue.textContent = sessionScore;
    updateTitleDisplay();
    try {
      sessionStorage.setItem(STORAGE_PREFIX + "Score", String(sessionScore));
    } catch (_) {}
  }

  function loadSessionScore() {
    try {
      const saved = sessionStorage.getItem(STORAGE_PREFIX + "Score");
      if (saved !== null) sessionScore = parseInt(saved, 10) || 0;
    } catch (_) {}
  }

  function getHighestLevelPassed(setId) {
    try {
      const key = STORAGE_PREFIX + "Level_" + setId;
      const s = localStorage.getItem(key);
      return s !== null ? Math.max(0, Math.min(10, parseInt(s, 10) || 0)) : 0;
    } catch (_) { return 0; }
  }

  function setHighestLevelPassed(setId, level) {
    try {
      const key = STORAGE_PREFIX + "Level_" + setId;
      const prev = getHighestLevelPassed(setId);
      localStorage.setItem(key, String(Math.max(prev, level)));
    } catch (_) {}
  }

  function getLevelStars(setId, level) {
    try {
      const key = STORAGE_PREFIX + "Stars_" + setId + "_" + level;
      const s = localStorage.getItem(key);
      return s !== null ? Math.min(3, Math.max(0, parseInt(s, 10) || 0)) : 0;
    } catch (_) { return 0; }
  }

  function setLevelStars(setId, level, stars) {
    try {
      const key = STORAGE_PREFIX + "Stars_" + setId + "_" + level;
      const val = Math.min(3, Math.max(0, stars));
      localStorage.setItem(key, String(val));
    } catch (_) {}
  }

  function getSavedSetAndLevel() {
    try {
      const setId = localStorage.getItem(STORAGE_PREFIX + "CurrentSet");
      const level = parseInt(localStorage.getItem(STORAGE_PREFIX + "CurrentLevel"), 10);
      return { setId: setId || null, level: (level >= 1 && level <= 10) ? level : 1 };
    } catch (_) { return { setId: null, level: 1 }; }
  }

  function saveSetAndLevel(setId, level) {
    try {
      localStorage.setItem(STORAGE_PREFIX + "CurrentSet", String(setId));
      localStorage.setItem(STORAGE_PREFIX + "CurrentLevel", String(level));
    } catch (_) {}
  }

  function getTodayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function getDailyCountToday() {
    try {
      const key = STORAGE_KEY_DAILY_PREFIX + getTodayKey();
      const s = localStorage.getItem(key);
      return s !== null ? Math.max(0, parseInt(s, 10) || 0) : 0;
    } catch (_) { return 0; }
  }

  function incrementDailyCount() {
    try {
      const key = STORAGE_KEY_DAILY_PREFIX + getTodayKey();
      const n = getDailyCountToday() + 1;
      localStorage.setItem(key, String(Math.min(DAILY_CHALLENGE_LEVELS, n)));
      updateStreakFromDailyPlay();
      return n;
    } catch (_) { return 0; }
  }

  function getYesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function updateStreakFromDailyPlay() {
    try {
      const today = getTodayKey();
      const yesterday = getYesterdayKey();
      const lastDate = localStorage.getItem(STORAGE_KEY_LAST_DAILY_DATE);
      const current = parseInt(localStorage.getItem(STORAGE_KEY_STREAK), 10) || 0;
      let next = 1;
      if (lastDate === today) next = current;
      else if (lastDate === yesterday) next = current + 1;
      localStorage.setItem(STORAGE_KEY_LAST_DAILY_DATE, today);
      localStorage.setItem(STORAGE_KEY_STREAK, String(next));
    } catch (_) {}
  }

  function getStreak() {
    try {
      const lastDate = localStorage.getItem(STORAGE_KEY_LAST_DAILY_DATE);
      const today = getTodayKey();
      const yesterday = getYesterdayKey();
      if (lastDate !== today && lastDate !== yesterday) return 0;
      return Math.max(0, parseInt(localStorage.getItem(STORAGE_KEY_STREAK), 10) || 0);
    } catch (_) { return 0; }
  }

  function getCelebrationShownMilestones() {
    try {
      const s = localStorage.getItem(STORAGE_KEY_CELEBRATION_MILESTONES);
      if (!s) return [];
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr : [];
    } catch (_) { return []; }
  }

  function setCelebrationShownForMilestone(streak) {
    try {
      const arr = getCelebrationShownMilestones();
      if (arr.indexOf(streak) >= 0) return;
      arr.push(streak);
      arr.sort(function (a, b) { return a - b; });
      localStorage.setItem(STORAGE_KEY_CELEBRATION_MILESTONES, JSON.stringify(arr));
    } catch (_) {}
  }

  function shouldShowCelebrationOverlay() {
    const streak = getStreak();
    if (CELEBRATION_MILESTONES.indexOf(streak) < 0) return false;
    return getCelebrationShownMilestones().indexOf(streak) < 0;
  }

  function getGameMode() {
    return "daily";
  }

  function setGameMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY_MODE, "daily");
    } catch (_) {}
  }

  function getSavedLang() {
    try {
      const s = localStorage.getItem(STORAGE_KEY_LANG);
      return s === "zh" ? "zh" : "en";
    } catch (_) { return "en"; }
  }

  function setSavedLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang === "zh" ? "zh" : "en");
    } catch (_) {}
  }

  function getSavedTheme() {
    try {
      const s = localStorage.getItem(STORAGE_KEY_THEME);
      return s === "light" ? "light" : "dark";
    } catch (_) { return "dark"; }
  }

  function setSavedTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme === "dark" ? "dark" : "light");
    } catch (_) {}
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (!root) return;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
    setSavedTheme(theme);
    const toggle = document.getElementById("dark-mode-toggle");
    if (toggle) {
      toggle.classList.toggle("active", theme === "dark");
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  function getSponsorClickedToday() {
    try {
      return localStorage.getItem(STORAGE_KEY_SPONSOR_DATE) === getTodayKey();
    } catch (_) { return false; }
  }

  function setSponsorClickedToday() {
    try {
      localStorage.setItem(STORAGE_KEY_SPONSOR_DATE, getTodayKey());
    } catch (_) {}
  }

  function updateSponsorButton() {
    const el = document.getElementById("ext-link");
    const hintEl = document.getElementById("redirect-hint");
    if (!el) return;
    const clicked = getSponsorClickedToday();
    const lang = uiLang || "en";
    if (clicked) {
      el.classList.add("clicked");
      el.textContent = (UI[lang] && UI[lang].thankYouSponsor) ? UI[lang].thankYouSponsor : "Thanks for visiting.";
      el.setAttribute("aria-label", el.textContent);
      if (hintEl) hintEl.classList.add("hidden");
    } else {
      el.classList.remove("clicked");
      el.textContent = (UI[lang] && UI[lang].supportTheGame) ? UI[lang].supportTheGame : "Check Out Our Game Sponsors";
      el.setAttribute("aria-label", el.textContent);
      if (hintEl) {
        hintEl.textContent = (UI[lang] && UI[lang].redirectHint) ? UI[lang].redirectHint : "Opens in a new tab.";
        hintEl.classList.remove("hidden");
      }
    }
  }

  function isPracticeMode() {
    return false;
  }

  function getLevelsLeftToday() {
    return Math.max(0, DAILY_CHALLENGE_LEVELS - getDailyCountToday());
  }

  function getDayOfYear() {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    return Math.floor(diff / (24 * 60 * 60 * 1000));
  }

  /** Day index: days since epoch, so same day = same set, advances by 1 each day. */
  function getDayIndex() {
    const key = getTodayKey();
    const d = new Date(key + "T12:00:00Z");
    return Math.floor(d.getTime() / (24 * 60 * 60 * 1000));
  }

  /** Real animal English words (lowercase) so Level 1 shows animals first. */
  const DAILY_ANIMAL_WORDS = new Set(["dog", "cat", "bird", "fish", "rabbit", "mouse", "cow", "sheep", "pig", "hen", "duck", "bee", "butterfly", "snail", "turtle", "snake", "lizard", "elephant", "lion", "tiger", "monkey", "bear", "wolf", "fox", "owl", "octopus", "crab", "panda", "giraffe", "zebra", "hippo", "rhino", "koala", "orangutan", "squirrel", "hedgehog", "bat", "raccoon", "badger", "camel", "deer", "peacock", "parrot", "flamingo", "penguin", "swan", "eagle", "crow", "dove", "dolphin", "whale", "shark", "seal", "otter", "crocodile", "frog", "dragonfly", "spider", "ladybug", "cricket", "scorpion", "centipede", "dragon", "unicorn", "mermaid", "fly", "mosquito", "cockroach", "earthworm", "jellyfish", "seahorse", "lobster", "shrimp", "clam", "squid", "goldfish", "goose", "chicken", "dinosaur", "mammoth", "sloth", "dodo", "skunk", "bison", "beaver", "oyster", "starfish", "catfish", "pangolin"]);

  function isRealAnimalPair(pair) {
    if (!pair || !pair[1]) return false;
    const en = String(pair[1]).toLowerCase().trim().split(/[\s(]/)[0];
    return DAILY_ANIMAL_WORDS.has(en);
  }

  /** Get exactly 6 pairs from a pool; dayIndex advances the "cursor". When pool is exhausted, wrap from start. */
  function get6FromPool(pool, dayIndex) {
    if (!pool || pool.length === 0) return [];
    const start = (dayIndex * 6) % pool.length;
    const slice = pool.slice(start, start + 6);
    if (slice.length >= 6) return slice;
    return slice.concat(pool.slice(0, 6 - slice.length));
  }

  const DAILY_PAIRS_TOTAL = DAILY_CHALLENGE_LEVELS * 6;

  function getTodayDailyStartIndex() {
    if (!dailyWords || dailyWords.length < DAILY_PAIRS_TOTAL) return 0;
    const numBlocks = Math.floor(dailyWords.length / DAILY_PAIRS_TOTAL);
    const todayKey = getTodayKey();
    let seed = 0;
    for (let i = 0; i < todayKey.length; i++) {
      seed = ((seed << 5) - seed + todayKey.charCodeAt(i)) | 0;
    }
    const blockIndex = Math.abs(seed) % Math.max(1, numBlocks);
    return blockIndex * DAILY_PAIRS_TOTAL;
  }

  function getTodayDailySet() {
    if (dailyWordsLevel1Order.length > 0 || dailyWordsLevel2Order.length > 0 || dailyWordsLevel3Order.length > 0) {
      const dayIndex = getDayIndex();
      /* Level 1: animals only; when animals exhausted use other (Level 3 pool) as fallback */
      const l1Pool = dailyWordsLevel1Order.length > 0 ? dailyWordsLevel1Order : dailyWordsLevel3Order;
      const l1 = get6FromPool(l1Pool, dayIndex);
      const l2 = get6FromPool(dailyWordsLevel2Order, dayIndex);
      const pairs = l1.concat(l2);
      if (pairs.length >= DAILY_PAIRS_TOTAL) {
        return { id: "daily", name: "Daily", pairs: pairs.slice(0, DAILY_PAIRS_TOTAL) };
      }
      return { id: "daily", name: "Daily", pairs: pairs.length ? pairs : (dailyWords || []).slice(0, DAILY_PAIRS_TOTAL) };
    }
    const start = getTodayDailyStartIndex();
    const pairs = (dailyWords || []).slice(start, start + DAILY_PAIRS_TOTAL);
    return { id: "daily", name: "Daily", pairs: pairs.length >= DAILY_PAIRS_TOTAL ? pairs : (dailyWords || []).slice(0, DAILY_PAIRS_TOTAL) };
  }

  function showDailyLimitMessage() {
    const el = document.getElementById("daily-limit-message");
    if (el) el.classList.remove("hidden");
    const gameAreaEl = document.getElementById("game-area");
    if (gameAreaEl) gameAreaEl.classList.add("hidden");
    const optionsPanel = document.querySelector(".options-panel");
    if (optionsPanel) optionsPanel.classList.add("daily-complete-view");
  }

  function hideDailyLimitMessage() {
    const el = document.getElementById("daily-limit-message");
    if (el) el.classList.add("hidden");
    const gameAreaEl = document.getElementById("game-area");
    if (gameAreaEl) gameAreaEl.classList.remove("hidden");
    const optionsPanel = document.querySelector(".options-panel");
    if (optionsPanel) optionsPanel.classList.remove("daily-complete-view");
  }

  function updateDailyProgressDisplay() {
    const wrap = document.getElementById("daily-progress-wrap");
    const text = document.getElementById("daily-progress-text");
    const streakEl = document.getElementById("streak-display");
    if (!wrap || !text) return;
    wrap.classList.remove("hidden");
    const n = getDailyCountToday();
    const tpl = (UI[uiLang] && UI[uiLang].dailyProgress) ? UI[uiLang].dailyProgress : "Daily {n}/2";
    text.textContent = tpl.replace("{n}", String(n));
    if (streakEl) {
      const streak = getStreak();
      const numEl = streakEl.querySelector(".streak-number");
      const emojiEl = streakEl.querySelector(".streak-emoji");
      if (numEl) numEl.textContent = streak;
      if (emojiEl) emojiEl.textContent = STREAK_EMOJI;
      streakEl.setAttribute("aria-label", (uiLang === "zh" ? "连续天数 " : "Streak ") + streak);
    }
  }

  function updateModeSwitcherUI() {
    document.querySelectorAll(".btn-mode[data-mode='daily']").forEach((btn) => {
      btn.classList.add("active");
      btn.textContent = UI[uiLang].modeDaily || "Daily (2/day)";
    });
  }

  function updateDailyLimitMessageText() {
    const titleEl = document.getElementById("daily-limit-title");
    const textEl = document.getElementById("daily-limit-text");
    const backBtn = document.getElementById("daily-limit-back-btn");
    if (titleEl && UI[uiLang].doneForTodayTitle) titleEl.textContent = UI[uiLang].doneForTodayTitle;
    if (textEl && UI[uiLang].doneForToday) textEl.textContent = UI[uiLang].doneForToday;
    if (backBtn && UI[uiLang].backToStart) backBtn.textContent = UI[uiLang].backToStart;
  }

  function updatePageContentText() {
    const u = UI[uiLang] || UI.en;
    const set = (id, key) => {
      const el = document.getElementById(id);
      if (el && u[key]) el.textContent = u[key];
    };
    set("page-content-rules-title", "pageContentRulesTitle");
    set("page-content-rules-intro", "pageContentRulesIntro");
    set("page-content-setup-title", "pageContentSetupTitle");
    set("page-content-setup-text", "pageContentSetupText");
    set("page-content-aim", "pageContentAim");
    set("page-content-aim-text", "pageContentAimText");
    set("page-content-move-title", "pageContentMoveTitle");
    set("page-content-move-text", "pageContentMoveText");
    set("page-content-daily", "pageContentDaily");
    set("page-content-daily-text", "pageContentDailyText");
    set("page-content-about-title", "pageContentAboutTitle");
    set("page-content-about-1", "pageContentAbout1");
    set("page-content-about-2", "pageContentAbout2");
  }

  function getMaxUnlockedLevel(setId) {
    if (setId === "daily") return Math.min(DAILY_CHALLENGE_LEVELS, Math.max(1, getDailyCountToday() + 1));
    const highestPassed = getHighestLevelPassed(setId);
    const maxUnlocked = Math.max(1, Math.min(10, highestPassed + 1));
    return maxUnlocked;
  }

  function computeStars(roundScoreVal, elapsedSeconds) {
    if (roundScoreVal >= 80 || elapsedSeconds <= 25) return 3;
    if (roundScoreVal >= 60 || elapsedSeconds <= 45) return 2;
    return 1;
  }

  function triggerConfetti() {
    const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#22c55e", "#fbbf24", "#0ea5e9"];
    const container = document.createElement("div");
    container.className = "confetti-container";
    container.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 55; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = (6 + Math.random() * 6) + "px";
      p.style.height = p.style.width;
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(function () { container.remove(); }, 2800);
  }

  function updateLevelDropdown() {
    const setId = currentSet ? currentSet.id : null;
    const maxUnlocked = setId ? getMaxUnlockedLevel(setId) : 1;
    const maxLevel = currentSet ? getMaxLevel(currentSet) : 10;
    const maxSelectable = Math.min(maxUnlocked, maxLevel);
    for (let i = 0; i < levelSelect.options.length; i++) {
      const opt = levelSelect.options[i];
      const val = parseInt(opt.value, 10);
      opt.disabled = val > maxSelectable;
    }
  }

  function updateLevelControlVisibility() {
    const isDaily = currentSet && currentSet.id === "daily";
    if (levelLabel) levelLabel.classList.toggle("hidden", isDaily);
    if (levelSelectRow) levelSelectRow.classList.toggle("hidden", isDaily);
    if (dailyLevelWrap) {
      dailyLevelWrap.classList.toggle("hidden", !isDaily);
      if (isDaily && dailyLevelDisplay) dailyLevelDisplay.textContent = (currentLevel || 1) + " / " + DAILY_CHALLENGE_LEVELS;
    }
  }

  function buildPracticeLevelStrip() {
    if (!practiceLevelStrip) return;
    practiceLevelStrip.innerHTML = "";
    const maxLevel = 10;
    for (let n = 1; n <= maxLevel; n++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "practice-level-btn";
      btn.setAttribute("aria-label", "Level " + n);
      btn.dataset.level = String(n);
      btn.textContent = n;
      btn.addEventListener("click", () => {
        const level = parseInt(btn.dataset.level, 10);
        const set = currentSet && currentSet.id !== "daily" ? currentSet : (wordSets[0] || null);
        if (!set) return;
        const maxUnlocked = getMaxUnlockedLevel(set.id);
        if (level > maxUnlocked) return;
        levelSelect.value = String(level);
        currentLevel = level;
        startSet(set.id);
      });
      practiceLevelStrip.appendChild(btn);
    }
  }

  function updatePracticeLevelStrip() {
    if (!practiceLevelStrip || !currentSet || currentSet.id === "daily") return;
    const maxUnlocked = getMaxUnlockedLevel(currentSet.id);
    const maxLevel = getMaxLevel(currentSet);
    const buttons = practiceLevelStrip.querySelectorAll(".practice-level-btn");
    buttons.forEach((btn) => {
      const level = parseInt(btn.dataset.level, 10);
      const unlocked = level <= maxUnlocked && level <= maxLevel;
      btn.disabled = !unlocked;
      btn.classList.toggle("current", level === currentLevel);
      btn.setAttribute("aria-current", level === currentLevel ? "true" : "false");
    });
  }

  function shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function createCard(pairId, text, isChinese, emoji) {
    const card = document.createElement("div");
    card.className = "card" + (isChinese ? " chinese" : "");
    card.dataset.pairId = String(pairId);
    card.dataset.text = text;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Card: " + text);

    const frontContent = escapeHtml(text) + (emoji ? '<span class="card-emoji">' + escapeHtml(emoji) + "</span>" : "");
    card.innerHTML =
      '<div class="card-inner">' +
      '<div class="card-face card-back"></div>' +
      '<div class="card-face card-front">' + frontContent + "</div>" +
      "</div>";

    card.addEventListener("click", () => handleCardClick(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick(card);
      }
    });

    return card;
  }

  function getMaxLevel(set) {
    if (!set || !set.pairs) return 1;
    return Math.min(10, Math.floor(set.pairs.length / PAIRS_PER_LEVEL));
  }

  function buildCardsFromSet(set, level) {
    // Each level uses a unique block of 6 pairs: L1 = 0-5, L2 = 6-11, ... L10 = 54-59. No overlap between levels.
    const levelNum = Math.max(1, parseInt(level, 10) || 1);
    const start = (levelNum - 1) * PAIRS_PER_LEVEL;
    const pairs = set.pairs || [];
    const pairList = pairs.slice(start, start + PAIRS_PER_LEVEL);
    const cardData = [];
    pairList.forEach((pair, index) => {
      const p = ensurePairHasEmoji(pair) || pair;
      const chinese = p[0];
      const english = p[1];
      const emoji = (p[2] != null && String(p[2]).trim() !== "") ? p[2] : "❓";
      cardData.push({ pairId: index, text: chinese, isChinese: true, emoji: emoji });
      cardData.push({ pairId: index, text: english, isChinese: false, emoji: null });
    });
    return shuffle(cardData).map((c) =>
      createCard(c.pairId, c.text, c.isChinese, c.emoji)
    );
  }

  function updateNextButtonState() {
    nextBtn.disabled = !currentLevelCompleted;
    nextBtn.setAttribute("aria-disabled", currentLevelCompleted ? "false" : "true");
  }

  function handleTimeUp() {
    lockBoard = true;
    const timeupMessage = document.getElementById("timeup-message");
    const timeupText = document.getElementById("timeup-text");
    const timeupRetry = document.getElementById("timeup-retry-btn");
    const timeupBack = document.getElementById("timeup-back-btn");
    const timeupHint = document.querySelector(".timeup-hint");
    if (timeupText) timeupText.textContent = uiLang === "zh" ? "时间到！" : "Time's up!";
    if (timeupHint) timeupHint.textContent = uiLang === "zh" ? "再试一次，在时间结束前配对全部卡片！" : "Try again and match all pairs before the timer runs out!";
    if (timeupRetry) timeupRetry.textContent = uiLang === "zh" ? "重试" : "Retry";
    if (timeupBack) timeupBack.textContent = UI[uiLang].backToStart || UI.en.backToStart;
    if (timeupMessage) timeupMessage.classList.remove("hidden");
  }

  function updateOptionsPanelPracticeView() {
    const optionsPanel = document.querySelector(".options-panel");
    if (!optionsPanel) return;
    if (isPracticeMode()) optionsPanel.classList.add("practice-mode-view");
    else optionsPanel.classList.remove("practice-mode-view");
  }

  function renderGame(set, level) {
    gameArea.innerHTML = "";
    clearSupportSpotlight();
    winMessage.classList.add("hidden");
    const timeupMessage = document.getElementById("timeup-message");
    if (timeupMessage) timeupMessage.classList.add("hidden");
    stopTimer();
    clearPreview();
    const optionsPanel = document.querySelector(".options-panel");
    if (optionsPanel) optionsPanel.classList.remove("round-complete");
    roundScore = 0;
    currentLevelCompleted = false;
    matchStreak = 0;
    updateNextButtonState();
    cards = buildCardsFromSet(set, level);
    cards.forEach(function (el) {
      el.classList.add("flipped");
      gameArea.appendChild(el);
    });
    firstCard = null;
    secondCard = null;
    lockBoard = true;
    matchedCount = 0;
    updateProgress();
    updateScoreDisplay();

    const memorizeText = UI[uiLang].memorize || UI.en.memorize;
    const goText = UI[uiLang].go || UI.en.go;
    if (optionsPanel) optionsPanel.classList.add("preview-active");
    const overlay = document.createElement("div");
    overlay.className = "preview-overlay";
    overlay.setAttribute("aria-live", "polite");
    const msg = document.createElement("p");
    msg.className = "preview-overlay-msg";
    msg.textContent = memorizeText;
    const countEl = document.createElement("p");
    countEl.className = "preview-overlay-count";
    countEl.textContent = String(PREVIEW_SECONDS);
    overlay.appendChild(msg);
    overlay.appendChild(countEl);
    if (gameBoardWrap) gameBoardWrap.appendChild(overlay);

    let remaining = PREVIEW_SECONDS;
    previewCountdownInterval = setInterval(function () {
      remaining -= 1;
      if (remaining > 0) countEl.textContent = String(remaining);
      else {
        if (previewCountdownInterval) { clearInterval(previewCountdownInterval); previewCountdownInterval = null; }
        countEl.textContent = goText;
      }
    }, 1000);

    previewTimeoutId = setTimeout(function () {
      previewTimeoutId = null;
      if (previewCountdownInterval) { clearInterval(previewCountdownInterval); previewCountdownInterval = null; }
      if (optionsPanel) optionsPanel.classList.remove("preview-active");
      overlay.remove();
      startPlay();
    }, PREVIEW_SECONDS * 1000);
  }

  function handleCardClick(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");
    startBgMusic();
    playSound("flip");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;

    const match = firstCard.dataset.pairId === secondCard.dataset.pairId;

    if (match) {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matchedCount += 1;
      matchStreak += 1;
      const matchPoints = POINTS_PER_MATCH + (matchStreak > 1 ? (matchStreak - 1) * STREAK_BONUS_PER_MATCH : 0);
      roundScore += matchPoints;
      sessionScore += matchPoints;
      updateProgress();
      updateScoreDisplay();
      playSound("match");
      lockBoard = false;
      firstCard = null;
      secondCard = null;

      if (matchedCount === PAIRS_PER_LEVEL) {
        currentLevelCompleted = true;
        setHighestLevelPassed(currentSet.id, currentLevel);
        if (!isPracticeMode()) incrementDailyCount();
        updateLevelDropdown();
        updateNextButtonState();
        updateDailyProgressDisplay();
        setTimeout(function () {
          stopTimer();
          const elapsed = getElapsedSeconds();
          const timeBonus = computeTimeBonus(elapsed);
          roundScore += timeBonus;
          sessionScore += timeBonus;
          updateScoreDisplay();
          const stars = computeStars(roundScore, elapsed);
          setLevelStars(currentSet.id, currentLevel, stars);
          updateLevelDropdown();
          playSound("win");
          const optionsPanel = document.querySelector(".options-panel");
          if (optionsPanel) optionsPanel.classList.add("round-complete");
          const dailyLimitReached = !isPracticeMode() && getDailyCountToday() >= DAILY_CHALLENGE_LEVELS;
          if (dailyLimitReached) {
            if (shouldShowCelebrationOverlay()) {
              setCelebrationShownForMilestone(getStreak());
              showDailyCompleteCelebration(function () { showWin(elapsed, stars, true); });
            } else {
              triggerConfetti();
              showWin(elapsed, stars, true);
            }
          } else {
            triggerConfetti();
            showWin(elapsed, stars, false);
          }
        }, 400);
      }
    } else {
      matchStreak = 0;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        lockBoard = false;
        firstCard = null;
        secondCard = null;
      }, 800);
    }
  }

  function showDailyCompleteCelebration(onDone) {
    const overlay = document.getElementById("daily-complete-celebration");
    const labelEl = document.getElementById("daily-complete-streak-label");
    const numEl = document.querySelector(".daily-complete-num");
    const emojiEl = document.querySelector(".daily-complete-emoji");
    if (!overlay) {
      if (onDone) onDone();
      return;
    }
    const streak = getStreak();
    const lang = uiLang || "en";
    if (labelEl) labelEl.textContent = (UI[lang] && UI[lang].yourStreak) ? UI[lang].yourStreak : "Your streak";
    if (numEl) numEl.textContent = streak;
    if (emojiEl) emojiEl.textContent = STREAK_EMOJI;
    overlay.classList.remove("hidden");
    overlay.classList.add("visible");
    const reveal = overlay.querySelector(".daily-complete-streak-reveal");
    if (reveal) reveal.classList.remove("revealed");
    triggerConfetti();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (reveal) reveal.classList.add("revealed");
      });
    });
    setTimeout(function () {
      overlay.classList.remove("visible");
      overlay.classList.add("hidden");
      if (reveal) reveal.classList.remove("revealed");
      if (onDone) onDone();
    }, 1400);
  }

  function clearSupportSpotlight() {
    if (window._supportSpotlightTimeout) {
      clearTimeout(window._supportSpotlightTimeout);
      window._supportSpotlightTimeout = null;
    }
    if (window._supportSpotlightEndTimeout) {
      clearTimeout(window._supportSpotlightEndTimeout);
      window._supportSpotlightEndTimeout = null;
    }
    const overlay = document.getElementById("overlay-modal");
    const extLink = document.getElementById("ext-link");
    if (overlay) {
      overlay.classList.add("hidden");
      overlay.setAttribute("aria-hidden", "true");
    }
    if (extLink) extLink.classList.remove("link-highlight");
  }

  function showWin(elapsedSeconds, stars, dailyLimitReached) {
    document.getElementById("win-score-value").textContent = roundScore;
    const remaining = Math.max(0, ROUND_TIME_SECONDS - (elapsedSeconds || 0));
    document.getElementById("win-time-value").textContent = formatTime(remaining);
    const starsEl = document.getElementById("win-stars");
    const earned = typeof stars === "number" ? Math.min(3, Math.max(0, stars)) : 1;
    if (starsEl) {
      starsEl.innerHTML = "";
      starsEl.setAttribute("aria-label", earned + " star" + (earned !== 1 ? "s" : ""));
      for (let i = 0; i < 3; i++) {
        const span = document.createElement("span");
        span.className = "win-star" + (i < earned ? " win-star-filled" : " win-star-empty");
        span.textContent = i < earned ? "★" : "☆";
        span.style.animationDelay = (i * 0.28) + "s";
        starsEl.appendChild(span);
      }
    }
    const winTextEl = document.getElementById("win-text");
    const winNextBtnEl = document.getElementById("win-next-btn");
    if (dailyLimitReached) {
      if (winTextEl) winTextEl.textContent = (UI[uiLang] && UI[uiLang].doneForTodayShort) ? UI[uiLang].doneForTodayShort : "Today's challenge complete!";
      if (winNextBtnEl) winNextBtnEl.classList.add("hidden");
    } else {
      if (winTextEl) winTextEl.textContent = UI[uiLang].youDidIt;
      if (winNextBtnEl) winNextBtnEl.classList.remove("hidden");
    }
    winMessage.classList.remove("hidden");
    if (dailyLimitReached) {
      const streak = getStreak();
      const showSpotlight = streak === 1 || (streak >= 7 && streak % 7 === 0);
      if (showSpotlight) {
        if (window._supportSpotlightTimeout) clearTimeout(window._supportSpotlightTimeout);
        if (window._supportSpotlightEndTimeout) clearTimeout(window._supportSpotlightEndTimeout);
        window._supportSpotlightTimeout = setTimeout(function () {
          const overlay = document.getElementById("overlay-modal");
          const extLink = document.getElementById("ext-link");
          if (overlay && extLink) {
            overlay.classList.remove("hidden");
            overlay.setAttribute("aria-hidden", "false");
            extLink.classList.add("link-highlight");
            window._supportSpotlightEndTimeout = setTimeout(function () {
              overlay.classList.add("hidden");
              overlay.setAttribute("aria-hidden", "true");
              extLink.classList.remove("link-highlight");
            }, 2000);
          }
        }, 500);
      }
    }
  }

  function startSet(setId) {
    const set = setId === "daily" ? getTodayDailySet() : wordSets.find((s) => s.id === setId);
    if (!set || !set.pairs || set.pairs.length < PAIRS_PER_LEVEL) return;
    currentSet = set;
    hideDailyLimitMessage();
    if (getLevelsLeftToday() === 0) {
      showDailyLimitMessage();
      updateDailyProgressDisplay();
      return;
    }
    updateLevelDropdown();
    const maxUnlocked = getMaxUnlockedLevel(set.id);
    const maxLevel = getMaxLevel(set);
    const maxSelectable = Math.min(maxUnlocked, maxLevel);
    let requested = parseInt(levelSelect.value, 10) || 1;
    currentLevel = requested > maxSelectable ? maxSelectable : Math.max(1, Math.min(10, requested));
    if (currentLevel !== requested) levelSelect.value = currentLevel;
    saveSetAndLevel(set.id, currentLevel);
    updateLevelControlVisibility();
    renderGame(set, currentLevel);
  }

  function applyLanguage(lang) {
    uiLang = lang;
    setSavedLang(lang);
    document.title = UI[lang].title;
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
    document.getElementById("page-title").textContent = UI[lang].heading;
    document.getElementById("instruction").textContent = UI[lang].instruction;
    document.getElementById("options-title").textContent = UI[lang].options;
    document.getElementById("set-label").textContent = UI[lang].chooseSet;
    if (levelLabel) levelLabel.textContent = UI[lang].level;
    nextBtn.textContent = UI[lang].next;
    winText.textContent = UI[lang].youDidIt;
    winNextBtn.textContent = UI[lang].next;
    winReplayBtn.textContent = UI[lang].replay;
    winBackBtn.textContent = UI[lang].backToStart;
    if (scoreLabel) scoreLabel.textContent = UI[lang].score + " ";
    const timeLabelEl = document.getElementById("time-label");
    if (timeLabelEl) timeLabelEl.textContent = UI[lang].time + " ";
    updateSponsorButton();
    updateModeSwitcherUI();
    updateDailyProgressDisplay();
    updateDailyLimitMessageText();
    updatePageContentText();
    updateOptionsPanelPracticeView();
    const savedSet = setSelect.value;
    refreshSetSelector();
    if (setSelect.querySelector('option[value="' + savedSet + '"]')) setSelect.value = savedSet;
    updateTitleDisplay();
    updateProgress();
    document.querySelectorAll(".btn-lang").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    const darkModeBtn = document.getElementById("dark-mode-toggle");
    if (darkModeBtn) darkModeBtn.textContent = UI[lang].darkMode;
  }

  function refreshSetSelector() {
    setSelect.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "daily";
    opt.textContent = setNames[uiLang].daily || "Today's challenge";
    setSelect.appendChild(opt);
  }

  function initSelector() {
    setGameMode("daily");
    updateModeSwitcherUI();
    updateOptionsPanelPracticeView();
    refreshSetSelector();
    updateLevelDropdown();
    setSelect.value = "daily";
    const level = Math.min(DAILY_CHALLENGE_LEVELS, Math.max(1, getDailyCountToday() + 1));
    levelSelect.value = String(level);
    currentLevel = level;
    startSet("daily");
    updateDailyProgressDisplay();
  }

  function goToNextLevel() {
    if (!currentSet || !currentLevelCompleted) return;
    clearSupportSpotlight();
    winMessage.classList.add("hidden");
    updateLevelDropdown();
    const maxLevelThisSet = getMaxLevel(currentSet);
    const nextLevel = currentLevel >= 10 ? 1 : currentLevel + 1;
    const idx = currentSet.id === "daily" ? -1 : wordSets.findIndex((s) => s.id === currentSet.id);
    const nextSet = idx >= 0 && idx < wordSets.length - 1 ? wordSets[idx + 1] : null;
    if (nextLevel > maxLevelThisSet && nextSet) {
      setSelect.value = nextSet.id;
      levelSelect.value = "1";
      currentLevel = 1;
      startSet(nextSet.id);
      return;
    }
    if (currentLevel >= 10 && nextSet) {
      setSelect.value = nextSet.id;
      levelSelect.value = "1";
      currentLevel = 1;
      startSet(nextSet.id);
      return;
    }
    currentLevel = Math.min(nextLevel, maxLevelThisSet);
    levelSelect.value = String(currentLevel);
    startSet(currentSet.id);
  }

  nextBtn.addEventListener("click", goToNextLevel);
  winNextBtn.addEventListener("click", goToNextLevel);

  winReplayBtn.addEventListener("click", () => {
    if (!currentSet) return;
    clearSupportSpotlight();
    winMessage.classList.add("hidden");
    renderGame(currentSet, currentLevel);
  });

  winBackBtn.addEventListener("click", () => {
    clearSupportSpotlight();
    winMessage.classList.add("hidden");
    levelSelect.value = "1";
    currentLevel = 1;
    if (currentSet) startSet(currentSet.id);
  });

  const timeupRetryBtn = document.getElementById("timeup-retry-btn");
  const timeupBackBtn = document.getElementById("timeup-back-btn");
  if (timeupRetryBtn) {
    timeupRetryBtn.addEventListener("click", () => {
      const timeupMessage = document.getElementById("timeup-message");
      if (timeupMessage) timeupMessage.classList.add("hidden");
      if (currentSet) renderGame(currentSet, currentLevel);
    });
  }
  if (timeupBackBtn) {
    timeupBackBtn.addEventListener("click", () => {
      const timeupMessage = document.getElementById("timeup-message");
      if (timeupMessage) timeupMessage.classList.add("hidden");
      levelSelect.value = "1";
      currentLevel = 1;
      if (currentSet) startSet(currentSet.id);
    });
  }

  setSelect.addEventListener("change", () => {
    startSet(setSelect.value);
  });

  levelSelect.addEventListener("change", () => {
    const requested = parseInt(levelSelect.value, 10) || 1;
    const maxUnlocked = currentSet ? getMaxUnlockedLevel(currentSet.id) : 1;
    const maxLevel = currentSet ? getMaxLevel(currentSet) : 10;
    const maxSelectable = Math.min(maxUnlocked, maxLevel);
    if (requested > maxSelectable) {
      levelSelect.value = currentLevel;
      return;
    }
    currentLevel = requested;
    if (currentSet) startSet(currentSet.id);
  });

  document.getElementById("mode-daily").addEventListener("click", () => {
    setGameMode("daily");
    updateModeSwitcherUI();
    updateOptionsPanelPracticeView();
    updateDailyProgressDisplay();
    refreshSetSelector();
    setSelect.value = "daily";
    levelSelect.value = "1";
    currentLevel = 1;
    startSet("daily");
  });

  const dailyLimitBackBtn = document.getElementById("daily-limit-back-btn");
  if (dailyLimitBackBtn) {
    dailyLimitBackBtn.addEventListener("click", () => {
      hideDailyLimitMessage();
      levelSelect.value = "1";
      currentLevel = 1;
      if (currentSet) startSet(currentSet.id);
    });
  }

  const extLinkEl = document.getElementById("ext-link");
  if (extLinkEl) {
    extLinkEl.addEventListener("click", function (e) {
      if (getSponsorClickedToday()) {
        e.preventDefault();
        return;
      }
      var w = window.open(PARTNERS_URL, "_blank", "noopener,noreferrer");
      setSponsorClickedToday();
      updateSponsorButton();
      setTimeout(function () {
        if (!w || w.closed) {
          var hintEl = document.getElementById("ext-link-hint");
          if (hintEl) {
            hintEl.classList.remove("hidden");
            hintEl.textContent = (UI[uiLang] && UI[uiLang].blockerHint) ? UI[uiLang].blockerHint : "If nothing opened, try allowing this site in your blocker.";
            window.clearTimeout(window._extLinkHintHide);
            window._extLinkHintHide = setTimeout(function () {
              hintEl.classList.add("hidden");
            }, 5000);
          }
        }
      }, 600);
      e.preventDefault();
    });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") updateSponsorButton();
  });

  document.getElementById("lang-en").addEventListener("click", () => { applyLanguage("en"); startBgMusic(); });
  document.getElementById("lang-zh").addEventListener("click", () => { applyLanguage("zh"); startBgMusic(); });
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
      applyTheme(getSavedTheme() === "dark" ? "light" : "dark");
    });
  }

  loadSessionScore();

  const builtinSets = { sets: (function () {
    try {
      return JSON.parse('{"sets":[{"id":"animals","name":"Animals","pairs":[["狗","dog","🐶"],["猫","cat","🐱"],["鸟","bird","🐦"],["鱼","fish","🐟"],["兔子","rabbit","🐰"],["马","horse","🐴"],["牛","cow","🐄"],["羊","sheep","🐑"],["猪","pig","🐷"],["鸡","chicken","🐔"],["鸭子","duck","🦆"],["老鼠","mouse","🐭"],["老虎","tiger","🐯"],["龙","dragon","🐉"],["蛇","snake","🐍"],["猴子","monkey","🐵"],["熊","bear","🐻"],["狼","wolf","🐺"],["大象","elephant","🐘"],["鹿","deer","🦌"],["狐狸","fox","🦊"],["熊猫","panda","🐼"],["狮子","lion","🦁"],["蜜蜂","bee","🐝"],["蝴蝶","butterfly","🦋"],["蚂蚁","ant","🐜"],["蜘蛛","spider","🕷️"],["螃蟹","crab","🦀"],["青蛙","frog","🐸"],["乌龟","turtle","🐢"],["鳄鱼","crocodile","🐊"],["企鹅","penguin","🐧"],["猫头鹰","owl","🦉"],["蝙蝠","bat","🦇"],["刺猬","hedgehog","🦔"],["袋鼠","kangaroo","🦘"],["考拉","koala","🐨"],["长颈鹿","giraffe","🦒"],["斑马","zebra","🦓"],["河马","hippo","🦛"],["犀牛","rhino","🦏"],["猩猩","orangutan","🦧"],["松鼠","squirrel","🐿️"],["海豚","dolphin","🐬"],["鲸鱼","whale","🐋"],["鲨鱼","shark","🦈"],["海星","starfish","⭐"],["章鱼","octopus","🐙"],["蜗牛","snail","🐌"],["蚯蚓","earthworm","🪱"],["瓢虫","ladybug","🐞"],["蜻蜓","dragonfly","🦋"],["蟋蟀","cricket","🦗"],["萤火虫","firefly","✨"]]},{"id":"colors","name":"Colors","pairs":[["红色","red","🔴"],["蓝色","blue","🔵"],["黄色","yellow","🟡"],["绿色","green","🟢"],["黑色","black","⚫"],["白色","white","⚪"],["橙色","orange","🟠"],["紫色","purple","🟣"],["粉色","pink","🌸"],["棕色","brown","🟤"],["灰色","grey","◻️"],["金色","gold","✨"],["银色","silver","⚪"],["青色","cyan","💎"],["米色","beige","🍚"],["深蓝","dark blue","🔵"],["浅绿","light green","🟢"],["深红","dark red","🔴"],["天蓝","sky blue","🔵"],["柠檬黄","lemon yellow","🟡"],["橄榄绿","olive green","🟢"],["玫瑰红","rose red","🔴"],["藏青","navy blue","🔵"],["薄荷绿","mint green","🟢"],["桃色","peach","🍑"],["薰衣草","lavender","🟣"],["珊瑚色","coral","🪸"],["靛蓝","indigo","🟣"],["茶色","tan","🟤"],["奶油色","cream","🥛"],["栗色","maroon","🔴"],["青柠","lime","🟢"],["琥珀色","amber","🟡"],["翡翠绿","emerald","💎"],["朱红","vermilion","🔴"],["海军蓝","navy","🔵"],["象牙白","ivory","⚪"],["炭灰","charcoal","◻️"],["赤褐","auburn","🟤"],["品红","magenta","🟣"],["青绿","teal","🟢"],["杏色","apricot","🟡"],["猩红","scarlet","🔴"],["钴蓝","cobalt blue","🔵"],["橄榄","olive","🟢"],["紫罗兰","violet","🟣"],["麦色","wheat","🟡"],["石板灰","slate grey","◻️"]]},{"id":"numbers","name":"Numbers","pairs":[["一","one","1️⃣"],["二","two","2️⃣"],["三","three","3️⃣"],["四","four","4️⃣"],["五","five","5️⃣"],["六","six","6️⃣"],["七","seven","7️⃣"],["八","eight","8️⃣"],["九","nine","9️⃣"],["十","ten","🔟"],["零","zero","0️⃣"],["百","hundred","💯"],["千","thousand","🔢"],["半","half","➗"],["两","two (counting)","2️⃣"],["第一","first","1️⃣"],["第二","second","2️⃣"],["第三","third","3️⃣"],["多少","how many","❓"],["很多","many","📦"],["少","few","📉"],["对","pair","2️⃣"],["打","dozen","1️⃣2️⃣"],["倍","times","✖️"],["加","plus","➕"],["减","minus","➖"],["乘","multiply","✖️"],["除","divide","➗"],["等于","equals","🟰"],["数字","number","🔢"],["奇数","odd number","1️⃣"],["偶数","even number","2️⃣"],["分数","fraction","½"],["小数","decimal","1.5"],["百分","percent","%"],["倍数","multiple","✖️"],["数量","quantity","📊"],["顺序","order","1️⃣2️⃣3️⃣"],["倒计时","countdown","⏱️"],["整数","whole number","🔢"],["双","double","2️⃣"],["单","single","1️⃣"],["十几","teens","1️⃣🔟"],["十位","tens","🔟"],["余数","odd","🔢"],["整体","whole","1️⃣"],["余数","remainder","➗"],["大约","approximately","≈"]]},{"id":"family","name":"Family","pairs":[["妈妈","mom","👩"],["爸爸","dad","👨"],["哥哥","older brother","👦"],["姐姐","older sister","👧"],["弟弟","younger brother","👦"],["妹妹","younger sister","👧"],["爷爷","grandpa","👴"],["奶奶","grandma","👵"],["宝宝","baby","👶"],["家庭","family","🏠"],["外公","grandpa (maternal)","👴"],["外婆","grandma (maternal)","👵"],["叔叔","uncle","👨"],["阿姨","aunt","👩"],["朋友","friend","👫"],["儿子","son","👦"],["女儿","daughter","👧"],["丈夫","husband","👨"],["妻子","wife","👩"],["父母","parents","👨👩"],["兄弟","brothers","👦👦"],["姐妹","sisters","👧👧"],["祖父母","grandparents","👴👵"],["孙子","grandson","👦"],["孙女","granddaughter","👧"],["堂兄弟","male cousin","👦"],["堂姐妹","female cousin","👧"],["侄子","nephew","👦"],["侄女","niece","👧"],["表兄弟","cousin (paternal)","👦"],["亲戚","relatives","👨👩"],["邻居","neighbor","🏠"],["同学","classmate","📚"],["老师","teacher","👩‍🏫"],["学生","student","📖"],["成人","adult","👨"],["孩子","child","👶"],["男人","man","👨"],["女人","woman","👩"],["男孩","boy","👦"],["女孩","girl","👧"],["双胞胎","twins","👫"],["新郎","groom","👨"],["新娘","bride","👩"],["继父","stepfather","👨"],["继母","stepmother","👩"],["养子","adopted son","👦"],["家人","family members","👨👩👧👦"]]},{"id":"verbs","name":"Verbs","pairs":[["跑","run","🏃"],["走","walk","🚶"],["吃","eat","🍽️"],["喝","drink","🥤"],["睡","sleep","😴"],["看","see","👀"],["听","listen","👂"],["说","say","🗣️"],["读","read","📖"],["写","write","✍️"],["唱","sing","🎤"],["玩","play","🎮"],["学习","study","📚"],["工作","work","💼"],["爱","love","❤️"],["喜欢","like","👍"],["想","think","🤔"],["来","come","👉"],["去","go","👋"],["买","buy","🛒"],["开","open","📂"],["关","close","❌"],["问","ask","❓"],["帮助","help","🆘"],["给","give","🎁"],["拿","take","✋"],["放","put","📍"],["坐","sit","🪑"],["站","stand","🧍"],["飞","fly","✈️"],["游泳","swim","🏊"],["爬","climb","🧗"],["跳","jump","⬆️"],["等","wait","⏳"],["教","teach","👩‍🏫"],["学","learn","📖"],["开始","start","▶️"],["完成","finish","🏁"],["忘记","forget","🤷"],["记得","remember","🧠"],["试","try","💪"],["需要","need","📌"],["要","want","🙏"],["做","do","✅"],["找","find","🔍"],["用","use","🔧"],["打电话","call","📞"],["回答","answer","💬"],["笑","laugh","😄"],["哭","cry","😢"],["画","draw","🖌️"],["跳舞","dance","💃"],["做饭","cook","👨‍🍳"],["洗","wash","🧼"]]}]}').sets;
    } catch (e) {
      return [
        { id: "animals", name: "Animals", pairs: [["狗", "dog", "🐶"], ["猫", "cat", "🐱"], ["鸟", "bird", "🐦"], ["鱼", "fish", "🐟"], ["兔子", "rabbit", "🐰"], ["马", "horse", "🐴"], ["牛", "cow", "🐄"], ["羊", "sheep", "🐑"], ["猪", "pig", "🐷"], ["鸡", "chicken", "🐔"], ["鸭子", "duck", "🦆"], ["老鼠", "mouse", "🐭"], ["老虎", "tiger", "🐯"], ["龙", "dragon", "🐉"], ["蛇", "snake", "🐍"]] },
        { id: "colors", name: "Colors", pairs: [["红色", "red", "🔴"], ["蓝色", "blue", "🔵"], ["黄色", "yellow", "🟡"], ["绿色", "green", "🟢"], ["黑色", "black", "⚫"], ["白色", "white", "⚪"], ["橙色", "orange", "🟠"], ["紫色", "purple", "🟣"], ["粉色", "pink", "🌸"], ["棕色", "brown", "🟤"], ["灰色", "grey", "◻️"], ["金色", "gold", "✨"], ["银色", "silver", "⚪"], ["青色", "cyan", "💎"], ["米色", "beige", "🍚"]] },
        { id: "numbers", name: "Numbers", pairs: [["一", "one", "1️⃣"], ["二", "two", "2️⃣"], ["三", "three", "3️⃣"], ["四", "four", "4️⃣"], ["五", "five", "5️⃣"], ["六", "six", "6️⃣"], ["七", "seven", "7️⃣"], ["八", "eight", "8️⃣"], ["九", "nine", "9️⃣"], ["十", "ten", "🔟"], ["零", "zero", "0️⃣"], ["百", "hundred", "💯"], ["千", "thousand", "🔢"], ["半", "half", "➗"], ["两", "two (counting)", "2️⃣"]] },
        { id: "family", name: "Family", pairs: [["妈妈", "mom", "👩"], ["爸爸", "dad", "👨"], ["哥哥", "older brother", "👦"], ["姐姐", "older sister", "👧"], ["弟弟", "younger brother", "👦"], ["妹妹", "younger sister", "👧"], ["爷爷", "grandpa", "👴"], ["奶奶", "grandma", "👵"], ["宝宝", "baby", "👶"], ["家庭", "family", "🏠"], ["外公", "grandpa (maternal)", "👴"], ["外婆", "grandma (maternal)", "👵"], ["叔叔", "uncle", "👨"], ["阿姨", "aunt", "👩"], ["朋友", "friend", "👫"]] },
        { id: "verbs", name: "Verbs", pairs: [["跑", "run", "🏃"], ["走", "walk", "🚶"], ["吃", "eat", "🍽️"], ["喝", "drink", "🥤"], ["睡", "sleep", "😴"], ["看", "see", "👀"], ["听", "listen", "👂"], ["说", "say", "🗣️"], ["读", "read", "📖"], ["写", "write", "✍️"], ["唱", "sing", "🎤"], ["玩", "play", "🎮"], ["学习", "study", "📚"], ["工作", "work", "💼"], ["爱", "love", "❤️"]] }
      ];
    }
  })() };

  const builtinDailyPairs = [
    ["桌子", "table", "🍽️"], ["椅子", "chair", "🪑"], ["床", "bed", "🛏️"], ["沙发", "sofa", "🛋️"], ["门", "door", "🚪"], ["窗户", "window", "🪟"],
    ["灯", "lamp", "💡"], ["书", "book", "📖"], ["笔", "pen", "🖊️"], ["电话", "phone", "📱"], ["电脑", "computer", "💻"], ["杯子", "cup", "🥤"],
    ["碗", "bowl", "🥣"], ["盘子", "plate", "🍴"], ["刀", "knife", "🔪"], ["叉子", "fork", "🍴"], ["勺子", "spoon", "🥄"], ["钥匙", "key", "🔑"]
  ];

  var builtinDailyCategories = {
    animals: [["狗", "dog", "🐕"], ["猫", "cat", "🐈"], ["鸟", "bird", "🐦"], ["鱼", "fish", "🐟"], ["兔子", "rabbit", "🐰"], ["牛", "cow", "🐄"], ["羊", "sheep", "🐑"], ["猪", "pig", "🐷"], ["鸡", "chicken", "🐔"], ["鸭子", "duck", "🦆"], ["大象", "elephant", "🐘"], ["狮子", "lion", "🦁"], ["老虎", "tiger", "🐯"], ["猴子", "monkey", "🐵"], ["熊", "bear", "🐻"], ["熊猫", "panda", "🐼"], ["兔子", "rabbit", "🐰"], ["狗", "dog", "🐕"]],
    fruitsAndFood: [["苹果", "apple", "🍎"], ["香蕉", "banana", "🍌"], ["米饭", "rice", "🍚"], ["面包", "bread", "🍞"], ["鸡蛋", "egg", "🥚"], ["牛奶", "milk", "🥛"], ["水", "water", "💧"], ["茶", "tea", "🍵"], ["咖啡", "coffee", "☕"], ["肉", "meat", "🥩"], ["苹果", "apple", "🍎"], ["香蕉", "banana", "🍌"]],
    other: [["桌子", "table", "🍽️"], ["椅子", "chair", "🪑"], ["床", "bed", "🛏️"], ["门", "door", "🚪"], ["书", "book", "📖"], ["车", "car", "🚗"], ["一", "one", "1️⃣"], ["二", "two", "2️⃣"], ["爸爸", "father", "👨"], ["妈妈", "mother", "👩"], ["走", "to walk", "🚶"], ["跑", "to run", "🏃"]]
  };

  function ensurePairHasEmoji(pair) {
    if (!Array.isArray(pair) || pair.length < 2) return null;
    const emoji = pair[2];
    if (emoji != null && String(emoji).trim() !== "") return pair;
    return [pair[0], pair[1], "❓"];
  }

  function loadDailyWords() {
    return fetch("daily-words.json")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.animals && Array.isArray(data.animals)) {
          var animals = (data.animals || []).map(ensurePairHasEmoji).filter(Boolean);
          var fruitsAndFood = (data.fruitsAndFood || []).map(ensurePairHasEmoji).filter(Boolean);
          var other = (data.other || []).map(ensurePairHasEmoji).filter(Boolean);
          animals.sort(function (a, b) { return (isRealAnimalPair(b) ? 1 : 0) - (isRealAnimalPair(a) ? 1 : 0); });
          /* Level 1 = animals only until exhausted; then fallback uses other in getTodayDailySet */
          dailyWordsLevel1Order = animals.slice();
          dailyWordsLevel2Order = fruitsAndFood.concat(other, animals);
          dailyWordsLevel3Order = other.concat(animals, fruitsAndFood);
          dailyWords = dailyWordsLevel1Order.concat(dailyWordsLevel2Order, dailyWordsLevel3Order);
        } else if (data && data.pairs && data.pairs.length >= DAILY_PAIRS_TOTAL) {
          dailyWords = (data.pairs || []).map(ensurePairHasEmoji).filter(Boolean);
        } else {
          dailyWords = builtinDailyPairs.map(ensurePairHasEmoji).filter(Boolean);
        }
      })
      .catch(function () {
        /* Level 1 = animals only until exhausted */
        dailyWordsLevel1Order = builtinDailyCategories.animals.slice();
        dailyWordsLevel2Order = builtinDailyCategories.fruitsAndFood.slice();
        dailyWordsLevel3Order = builtinDailyCategories.other.slice();
        dailyWords = dailyWordsLevel1Order.concat(dailyWordsLevel2Order, dailyWordsLevel3Order);
      });
  }

  Promise.all([
    fetch("words.json").then((r) => r.json()).then((data) => {
      wordSets = (data && data.sets && data.sets.length) ? data.sets : builtinSets.sets;
    }).catch(() => { wordSets = builtinSets.sets; }),
    loadDailyWords()
  ]).then(() => {
    uiLang = getSavedLang();
    initSelector();
    applyLanguage(uiLang);
    applyTheme(getSavedTheme());
    updateSponsorButton();
  });
})();
