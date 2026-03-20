const CARD_COUNT = 10;

const MODE_CONFIG = {
  existing: {
    name: "现成素材",
    titleLabel: "原标题",
    noteText: "随机抽 10 条已有素材，优先高/中置信，适合直接回看噱头。",
    noteSubText: "复制后是四段式纯文本，可以直接贴到文档里继续拆。",
    resultTitle: "现成素材 · 10 张灵感卡",
    resultSubline: "每次尽量避开重复，方便你连续刷新找感觉。",
  },
  remix: {
    name: "混搭灵感",
    titleLabel: "灵感标题",
    noteText: "按黑岩标题套路，把 2 到 3 条素材重新混搭成新灵感，不直接照搬原表整行。",
    noteSubText: "更适合找方向、挑噱头、继续往下延展，不承诺每条都能直接发布。",
    resultTitle: "混搭灵感 · 10 张新灵感卡",
    resultSubline: "同一轮会尽量拉开骨架，不让 10 条看起来像同一标题换皮。",
  },
};

const RELATION_TERMS = [
  "公公婆婆",
  "丧妻兄弟",
  "老公的养妹",
  "老公",
  "老婆",
  "前夫",
  "前妻",
  "赘婿",
  "渣男",
  "新欢",
  "养妹",
  "婆婆",
  "小姑子",
  "闺蜜",
  "嫂子",
  "弟媳",
  "儿媳",
  "儿子",
  "女儿",
  "哥哥",
  "弟弟",
  "婆家",
  "娘家",
  "全家",
  "兄弟",
];

const IDENTITY_TERMS = [
  "天界女战神",
  "人形貔貅",
  "受气包嫡女",
  "真千金",
  "假千金",
  "神女",
  "战神",
  "嫡女",
  "锦鲤",
  "王妃",
  "郡主",
  "圣女",
  "天师",
  "女帝",
  "侯府主母",
  "豪门真千金",
];

const POWER_TERMS = [
  "天界",
  "地府",
  "女战神",
  "疯皇",
  "神女",
  "死鬼老爹",
  "阴杯",
  "冥币",
  "侯府",
  "皇城",
  "续命",
  "献祭",
  "灭世",
  "命格",
  "气运",
];

const SCENE_TERMS = [
  "受气包嫡女",
  "落魄真千金",
  "豪门",
  "侯府",
  "剧组",
  "病房",
  "灵堂",
  "婚礼",
  "家门",
  "副驾",
  "皇城",
  "天界",
  "地府",
  "别墅",
  "学校",
  "公司",
];

const OUTCOME_HINTS = [
  "悔疯了",
  "火葬场",
  "睡大街",
  "负债破产",
  "跪着求我",
  "清算",
  "杀穿",
  "翻盘",
  "反杀",
  "称帝",
  "回来了",
  "怒了",
];

const CORE_HOOK_TERMS = [
  "全家睡大街",
  "救命骨髓",
  "人形貔貅",
  "受气包嫡女",
  "丧妻兄弟",
  "房贷车贷",
  "草纸当冥币",
  "八个阴杯",
  "真千金",
  "假千金",
  "白月光",
  "替身",
  "替嫁",
  "冲喜",
  "换命",
  "血包",
  "命格",
  "气运",
  "续命",
  "绿卡",
  "骨髓",
  "冥币",
  "阴杯",
  "神女",
  "战神",
  "侯府",
  "豪门",
  "嫡女",
  "庶女",
  "养妹",
  "渣男",
  "新欢",
  "竹马",
  "彩礼",
  "断亲",
  "副驾",
  "火葬场",
  "清算",
  "称帝",
];

const FALLBACKS = {
  relationSubjects: ["老公", "老婆", "前夫", "赘婿", "养妹", "渣男", "新欢", "婆婆"],
  relationActions: [
    "为新欢逼走我",
    "合伙赶我出门",
    "踩着我上位",
    "逼我净身出户",
    "背着我算计家产",
    "把我当垫脚石",
  ],
  relationOutcomes: [
    "我让他全家睡大街",
    "他负债破产悔疯了",
    "我停了他们的房贷车贷",
    "身份曝光后他们全家火葬场",
    "我转身让他们净身出户",
  ],
  identitySetups: ["天界女战神", "人形貔貅", "神女", "豪门真千金", "侯府主母", "锦鲤王妃"],
  identityScenes: ["受气包嫡女", "豪门弃妻", "落魄真千金", "侯府庶女", "祭品新娘", "病房陪护"],
  identityOutcomes: [
    "反手杀穿侯府",
    "让渣家原地清算",
    "夺回气运彻底翻盘",
    "把仇人送进火葬场",
    "让所有人跪着求我回头",
  ],
  powerSetups: ["疯皇", "神女", "死鬼老爹", "天界女战神", "地府判官", "阴杯剧组"],
  powerHarms: ["被夺气运", "被抢命格", "被献祭续命", "被拿来镇宅", "被逼开棺", "被当替死鬼"],
  powerOutcomes: [
    "我反手清算幕后黑手",
    "她带着未婚夫回来反制全场",
    "我当场称帝",
    "全侯府连夜陪葬",
    "他们悔疯了也来不及",
  ],
};

const state = {
  items: [],
  cards: [],
  lexicon: null,
  mode: "existing",
  pools: null,
  sourceTitleKeys: new Set(),
};

const refs = {};

document.addEventListener("DOMContentLoaded", () => {
  bindRefs();
  bindEvents();
  renderLoadingState();
  initializeApp();
});

function bindRefs() {
  refs.cardTemplate = document.getElementById("cardTemplate");
  refs.cardsGrid = document.getElementById("cardsGrid");
  refs.copyAllBtn = document.getElementById("copyAllBtn");
  refs.dataCountPill = document.getElementById("dataCountPill");
  refs.generateBtn = document.getElementById("generateBtn");
  refs.lastUpdated = document.getElementById("lastUpdated");
  refs.modeButtons = Array.from(document.querySelectorAll(".mode-btn"));
  refs.modeDescription = document.getElementById("modeDescription");
  refs.modeHintPill = document.getElementById("modeHintPill");
  refs.modeSubDescription = document.getElementById("modeSubDescription");
  refs.resultSubline = document.getElementById("resultSubline");
  refs.resultTitle = document.getElementById("resultTitle");
  refs.rerollBtn = document.getElementById("rerollBtn");
  refs.toast = document.getElementById("toast");
}

function bindEvents() {
  refs.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode || "existing");
    });
  });

  refs.generateBtn.addEventListener("click", () => {
    generateCards({ showToast: true, actionLabel: "生成好了，已经换成新的一组。" });
  });

  refs.rerollBtn.addEventListener("click", () => {
    generateCards({ showToast: true, actionLabel: "再来 10 条已经准备好。" });
  });

  refs.copyAllBtn.addEventListener("click", async () => {
    if (!state.cards.length) {
      showToastMessage("当前还没有内容可复制。");
      return;
    }

    const text = state.cards
      .map((card, index) => `${index + 1}. ${formatCardCopy(card)}`)
      .join("\n\n");

    const copied = await copyText(text);
    showToastMessage(copied ? "这一组 10 条已经复制好了。" : "复制失败，请稍后重试。");
  });
}

async function initializeApp() {
  try {
    const response = await fetch("./data/ideas.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("ideas.json 加载失败。");
    }

    const payload = await response.json();
    state.items = Array.isArray(payload.items) ? payload.items.map(normalizeIdea) : [];
    state.sourceTitleKeys = new Set(state.items.map((item) => titleKey(item.sourceTitle)));
    state.pools = buildPools(state.items);
    state.lexicon = buildLexicon(state.pools);

    refs.dataCountPill.textContent = `素材池 ${state.items.length} 条`;
    refreshModeView();
    generateCards({ showToast: false });
  } catch (error) {
    console.error(error);
    refs.dataCountPill.textContent = "素材池加载失败";
    renderErrorState(error instanceof Error ? error.message : "页面初始化失败。");
  }
}

function normalizeIdea(item) {
  return {
    id: String(item.id || ""),
    sourceTitle: String(item.sourceTitle || "").trim(),
    mainHook: String(item.mainHook || "").trim(),
    phraseHooks: uniqueList(item.phraseHooks || []),
    wordHooks: uniqueList(item.wordHooks || []),
    tags: uniqueList(item.tags || []),
    score: Number(item.score) || 0,
    confidence: ["高", "中", "低"].includes(item.confidence) ? item.confidence : "低",
  };
}

function buildPools(items) {
  const preferred = items.filter(
    (item) => item.confidence === "高" || item.confidence === "中"
  );
  const low = items.filter((item) => item.confidence === "低");

  const relation = items.filter((item) => matchesTemplate(item, "relation"));
  const identity = items.filter((item) => matchesTemplate(item, "identity"));
  const power = items.filter((item) => matchesTemplate(item, "power"));

  return {
    all: items,
    preferred,
    low,
    relation: relation.length ? relation : items,
    identity: identity.length ? identity : items,
    power: power.length ? power : items,
  };
}

function buildLexicon(pools) {
  const relationItems = pools.relation;
  const identityItems = pools.identity;
  const powerItems = pools.power;

  return {
    relationSubjects: fillPool(
      relationItems.map((item) => validRelationSubject(extractRelationSubject(item))),
      FALLBACKS.relationSubjects
    ),
    relationActions: fillPool(
      relationItems.map((item) => validRelationAction(extractActionFragment(item))),
      FALLBACKS.relationActions
    ),
    relationOutcomes: fillPool(
      relationItems.map((item) => validOutcome(extractOutcome(item), "relation")),
      FALLBACKS.relationOutcomes
    ),
    identitySetups: fillPool(
      identityItems.map((item) => validIdentitySetup(extractIdentitySetup(item))),
      FALLBACKS.identitySetups
    ),
    identityScenes: fillPool(
      identityItems.map((item) => validIdentityScene(extractIdentityScene(item))),
      FALLBACKS.identityScenes
    ),
    identityOutcomes: fillPool(
      identityItems.map((item) => validOutcome(extractIdentityOutcome(item), "identity")),
      FALLBACKS.identityOutcomes
    ),
    powerSetups: fillPool(
      powerItems.map((item) => validPowerSetup(extractPowerSetup(item))),
      FALLBACKS.powerSetups
    ),
    powerHarms: fillPool(
      powerItems.flatMap((item) =>
        extractPowerHarmCandidates(item).map((value) => validPowerHarm(value))
      ),
      FALLBACKS.powerHarms
    ),
    powerOutcomes: fillPool(
      powerItems.map((item) => validOutcome(extractPowerOutcome(item), "power")),
      FALLBACKS.powerOutcomes
    ),
  };
}

function fillPool(candidates, fallback) {
  return uniqueList([...(candidates || []), ...(fallback || [])]);
}

function setMode(mode) {
  if (!MODE_CONFIG[mode] || mode === state.mode) {
    return;
  }

  state.mode = mode;
  refreshModeView();
  generateCards({ showToast: false });
}

function refreshModeView() {
  const config = MODE_CONFIG[state.mode];
  refs.modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
  refs.modeDescription.textContent = config.noteText;
  refs.modeHintPill.textContent = `当前模式：${config.name}`;
  refs.modeSubDescription.textContent = config.noteSubText;
  refs.resultSubline.textContent = config.resultSubline;
  refs.resultTitle.textContent = config.resultTitle;
}

function generateCards({ showToast = false, actionLabel = "" } = {}) {
  if (!state.items.length) {
    return;
  }

  state.cards =
    state.mode === "existing"
      ? buildExistingCards(CARD_COUNT)
      : buildRemixCards(CARD_COUNT);

  renderCards(state.cards);
  refs.lastUpdated.textContent = `最近生成：${formatNow()}`;

  if (showToast && actionLabel) {
    showToastMessage(actionLabel);
  }
}

function buildExistingCards(count) {
  const result = [];
  const preferred = shuffle(state.pools.preferred);
  const low = shuffle(state.pools.low);

  const selected = preferred.slice(0, count);
  if (selected.length < count) {
    selected.push(...low.slice(0, count - selected.length));
  }

  selected.forEach((item, index) => {
    result.push({
      mode: "existing",
      titleLabel: MODE_CONFIG.existing.titleLabel,
      displayTitle: item.sourceTitle,
      mainHook: item.mainHook,
      phraseHooks: item.phraseHooks.slice(0, 5),
      wordHooks: item.wordHooks.slice(0, 6),
      sourceRefs: [],
      badgeText: `${item.confidence}置信`,
      cardTitle: `素材卡 ${String(index + 1).padStart(2, "0")}`,
      metaPattern: `existing-${item.id}`,
    });
  });

  return result;
}

function buildRemixCards(count) {
  const cards = [];
  const usedPatternKeys = new Set();
  const usedSourceIds = new Set();
  const usedTitleKeys = new Set();
  const templateOrder = shuffle([
    "relation",
    "identity",
    "power",
    "relation",
    "identity",
    "power",
    "relation",
    "power",
    "identity",
    "relation",
  ]);

  for (let index = 0; index < count; index += 1) {
    const preferredType = templateOrder[index % templateOrder.length];
    const candidateTypes = uniqueList([
      preferredType,
      "relation",
      "identity",
      "power",
    ]);

    let card = null;
    for (const type of candidateTypes) {
      card = tryBuildRemixCard({
        type,
        index,
        usedPatternKeys,
        usedSourceIds,
        usedTitleKeys,
      });
      if (card) {
        break;
      }
    }

    if (!card) {
      const fallback = buildExistingCards(1)[0];
      cards.push({
        ...fallback,
        mode: "remix",
        titleLabel: MODE_CONFIG.remix.titleLabel,
        displayTitle: `灵感兜底款：${fallback.displayTitle}`,
        badgeText: "灵感兜底",
        sourceRefs: [fallback.displayTitle],
        cardTitle: `灵感卡 ${String(index + 1).padStart(2, "0")}`,
      });
      continue;
    }

    card._sourceIds.forEach((id) => usedSourceIds.add(id));
    usedPatternKeys.add(card.metaPattern);
    usedTitleKeys.add(titleKey(card.displayTitle));
    cards.push(card);
  }

  return cards;
}

function tryBuildRemixCard({
  type,
  index,
  usedPatternKeys,
  usedSourceIds,
  usedTitleKeys,
}) {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const sources = pickSourcesForTemplate(type, usedSourceIds);
    if (sources.length < 2) {
      continue;
    }

    const candidate = buildRemixCandidate(type, sources, index, attempt);
    if (!candidate) {
      continue;
    }

    const titleHash = titleKey(candidate.displayTitle);
    if (!titleHash || usedTitleKeys.has(titleHash) || state.sourceTitleKeys.has(titleHash)) {
      continue;
    }

    if (usedPatternKeys.has(candidate.metaPattern)) {
      continue;
    }

    return candidate;
  }

  return null;
}

function buildRemixCandidate(type, sources, index, attempt) {
  const templateLabelMap = {
    relation: "关系伦理型",
    identity: "身份反差型",
    power: "权势玄幻型",
  };

  const title =
    type === "relation"
      ? buildRelationTitle(sources, attempt)
      : type === "identity"
        ? buildIdentityTitle(sources, attempt)
        : buildPowerTitle(sources, attempt);

  if (!title) {
    return null;
  }

  const titleHooks = deriveHooksFromGeneratedTitle(title, type);
  const boosterHook = extractCoreHook(selectBoosterHook(sources, type));
  let phraseHooks = uniqueList(
    titleHooks.concat(collectPhraseHooks(sources).map((hook) => extractCoreHook(hook)))
  )
    .filter(Boolean)
    .slice(0, 5);
  if (!phraseHooks.length) {
    const fallbackHook =
      titleHooks[0] ||
      boosterHook ||
      sources.map((item) => extractCoreHook(item.mainHook)).find(Boolean) ||
      extractCoreHook(sources[0].sourceTitle);
    phraseHooks = fallbackHook ? [fallbackHook] : [];
  }
  const mainHook = titleHooks[0] || boosterHook || chooseMainHook(type, phraseHooks);
  let wordHooks = uniqueList(
    titleHooks.concat(
      collectWordHooks(sources, mainHook).map((hook) => extractCoreHook(hook))
    )
      .filter(Boolean)
      .concat(phraseHooks)
  )
    .filter(Boolean)
    .slice(0, 6);
  if (!wordHooks.length) {
    wordHooks = mainHook ? [mainHook] : [];
  }
  const sourceRefs = sources.map((item) => item.sourceTitle);

  if (!mainHook || !phraseHooks.length || !wordHooks.length) {
    return null;
  }

  return {
    _sourceIds: sources.map((item) => item.id),
    badgeText: templateLabelMap[type],
    cardTitle: `灵感卡 ${String(index + 1).padStart(2, "0")}`,
    displayTitle: title,
    mainHook,
    metaPattern: buildPatternKey(type, title, sources),
    mode: "remix",
    phraseHooks,
    sourceRefs,
    titleLabel: MODE_CONFIG.remix.titleLabel,
    wordHooks,
  };
}

function buildRelationTitle(sources, attempt) {
  const hook =
    selectBoosterHook(sources, "relation") ||
    chooseMainHook("relation", collectPhraseHooks(sources));
  const subject =
    relationSubjectFromHook(hook) ||
    sampleOne(FALLBACKS.relationSubjects);
  const outcome =
    relationOutcomeFromHook(hook) ||
    sampleOne(FALLBACKS.relationOutcomes);
  const action =
    relationActionFromHook(hook, attempt) ||
    sampleOne(FALLBACKS.relationActions);

  const variants = [
    `${subject}${action}后，${outcome}`,
    `${subject}${action}后，${polishOutcome(outcome)}`,
    `${subject}${action}后，${appendBoosterToOutcome(outcome, hook)}`,
  ];

  return smoothTitle(variants[attempt % variants.length]);
}

function buildIdentityTitle(sources, attempt) {
  const hook =
    selectBoosterHook(sources, "identity") ||
    chooseMainHook("identity", collectPhraseHooks(sources));
  const setup =
    identitySetupFromHook(hook) ||
    sampleOne(FALLBACKS.identitySetups);
  const scene =
    identitySceneFromHook(hook) ||
    sampleOne(FALLBACKS.identityScenes);
  const outcome =
    identityOutcomeFromHook(hook) ||
    sampleOne(FALLBACKS.identityOutcomes);
  const normalizedScene = normalizeIdentityScene(setup, scene);
  const verb = chooseIdentityVerb(normalizedScene, attempt);

  const variants = [
    `${setup}${verb}${normalizedScene}后，${outcome}`,
    `${setup}${verb}${normalizedScene}后，${appendBoosterToOutcome(outcome, hook)}`,
    `${setup}${verb}${normalizedScene}后，${polishOutcome(outcome)}`,
  ];

  return smoothTitle(variants[attempt % variants.length]);
}

function buildPowerTitle(sources, attempt) {
  const hook =
    selectBoosterHook(sources, "power") ||
    chooseMainHook("power", collectPhraseHooks(sources));
  const setup =
    powerSetupFromHook(hook) ||
    sampleOne(FALLBACKS.powerSetups);
  const harm =
    powerHarmFromHook(hook) ||
    sampleOne(FALLBACKS.powerHarms);
  const outcome =
    powerOutcomeFromHook(hook) ||
    sampleOne(FALLBACKS.powerOutcomes);
  const normalizedHarm = ensurePowerHarm(harm);
  const variants = [
    `${setup}${normalizedHarm}后，${outcome}`,
    `${setup}${normalizedHarm}后，${appendBoosterToOutcome(outcome, hook)}`,
    `${setup}${normalizedHarm}后，${polishOutcome(outcome)}`,
  ];

  return smoothTitle(variants[attempt % variants.length]);
}

function chooseIdentityVerb(scene, attempt) {
  const value = String(scene || "");
  const looksLikeRole = /嫡女|庶女|真千金|假千金|弃妻|新娘|陪护/.test(value);
  if (looksLikeRole) {
    return "穿成";
  }

  const looksLikePlace = /府|门|城|界|宫|豪门|剧组|病房|灵堂|婚礼|地府|天界/.test(value);
  return looksLikePlace ? "进入" : "穿成";
}

function pickSourcesForTemplate(type, usedSourceIds) {
  const templatePool = state.pools[type] || state.pools.all;
  const picked = [];
  const localUsed = new Set(usedSourceIds);
  const targetCount = Math.random() < 0.55 ? 2 : 3;

  const primary = pickOneFromPool(templatePool, localUsed, picked);
  if (!primary) {
    return picked;
  }

  picked.push(primary);
  localUsed.add(primary.id);

  const supportPools =
    type === "relation"
      ? [state.pools.relation, state.pools.all]
      : type === "identity"
        ? [state.pools.identity, state.pools.power, state.pools.all]
        : [state.pools.power, state.pools.all];

  while (picked.length < targetCount) {
    let next = null;
    for (const pool of supportPools) {
      next = pickOneFromPool(pool, localUsed, picked);
      if (next) {
        break;
      }
    }

    if (!next) {
      break;
    }

    picked.push(next);
    localUsed.add(next.id);
  }

  if (picked.length < 2) {
    const backup = pickOneFromPool(state.pools.all, localUsed, picked);
    if (backup) {
      picked.push(backup);
    }
  }

  return picked;
}

function pickOneFromPool(pool, excludedIds, picked) {
  const candidate = shuffle(pool || []).find((item) => {
    if (!item || excludedIds.has(item.id)) {
      return false;
    }

    return !picked.some((existing) => isTooSimilar(existing, item));
  });

  return candidate || null;
}

function isTooSimilar(a, b) {
  if (!a || !b) {
    return false;
  }

  if (a.mainHook && b.mainHook && a.mainHook === b.mainHook) {
    return true;
  }

  const overlap = a.phraseHooks.filter((hook) => b.phraseHooks.includes(hook));
  return overlap.length >= 2;
}

function renderLoadingState() {
  refs.cardsGrid.innerHTML = "";
  for (let index = 0; index < 6; index += 1) {
    const card = document.createElement("div");
    card.className = "loading-card";
    card.innerHTML = [
      '<div class="loading-pill"></div>',
      '<div class="loading-line long"></div>',
      '<div class="loading-line medium"></div>',
      '<div class="loading-line long"></div>',
      '<div class="loading-line short"></div>',
    ].join("");
    refs.cardsGrid.appendChild(card);
  }
}

function renderErrorState(message) {
  refs.cardsGrid.innerHTML = `
    <article class="error-card">
      <div>
        <p class="result-label">页面没能正常加载</p>
        <p class="result-subline">${escapeHtml(message || "请稍后重试。")}</p>
      </div>
    </article>
  `;
}

function renderCards(cards) {
  refs.cardsGrid.innerHTML = "";

  cards.forEach((card) => {
    const fragment = refs.cardTemplate.content.cloneNode(true);
    const article = fragment.querySelector(".idea-card");
    const badge = fragment.querySelector(".card-badge");
    const cardTitle = fragment.querySelector(".card-title");
    const titleLabel = fragment.querySelector(".title-label");
    const displayTitle = fragment.querySelector(".display-title");
    const mainHook = fragment.querySelector(".main-hook");
    const phraseHooks = fragment.querySelector(".phrase-hooks");
    const wordHooks = fragment.querySelector(".word-hooks");
    const copyButton = fragment.querySelector(".copy-one-btn");
    const sourceBlock = fragment.querySelector(".source-block");
    const sourceRefs = fragment.querySelector(".source-refs");

    badge.textContent = card.badgeText;
    cardTitle.textContent = card.cardTitle;
    titleLabel.textContent = card.titleLabel;
    displayTitle.textContent = card.displayTitle;
    mainHook.textContent = card.mainHook;
    phraseHooks.textContent = card.phraseHooks.join(" | ");
    wordHooks.textContent = card.wordHooks.join(" | ");

    if (card.mode === "remix" && card.sourceRefs.length) {
      sourceBlock.hidden = false;
      sourceRefs.textContent = card.sourceRefs.join("；");
    }

    copyButton.addEventListener("click", async () => {
      const copied = await copyText(formatCardCopy(card));
      showToastMessage(copied ? "这一条已经复制好了。" : "复制失败，请稍后重试。");
    });

    article.dataset.pattern = card.metaPattern || "";
    refs.cardsGrid.appendChild(fragment);
  });
}

function formatCardCopy(card) {
  const lines = [
    `${card.titleLabel}：${card.displayTitle}`,
    `主噱头短语：${card.mainHook}`,
    `短语噱头列表：${card.phraseHooks.join(" | ")}`,
    `拆分噱头词：${card.wordHooks.join(" | ")}`,
  ];

  if (card.mode === "remix" && card.sourceRefs.length) {
    lines.push(`灵感来源：${card.sourceRefs.join("；")}`);
  }

  return lines.join("\n");
}

async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn("Clipboard API unavailable, fallback will be used.", error);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

function showToastMessage(text) {
  refs.toast.hidden = false;
  refs.toast.textContent = text;
  clearTimeout(showToastMessage.timer);
  showToastMessage.timer = setTimeout(() => {
    refs.toast.hidden = true;
  }, 2200);
}

function matchesTemplate(item, type) {
  const title = item.sourceTitle;
  const tags = new Set(item.tags);

  if (type === "relation") {
    return (
      tags.has("关系伦理") ||
      tags.has("金钱利益") ||
      RELATION_TERMS.some((term) => title.includes(term))
    );
  }

  if (type === "identity") {
    return (
      tags.has("身份反差") ||
      IDENTITY_TERMS.some(
        (term) => title.includes(term) || item.mainHook.includes(term)
      )
    );
  }

  return (
    tags.has("权势豪门") ||
    tags.has("灵异玄幻") ||
    POWER_TERMS.some(
      (term) =>
        title.includes(term) ||
        item.mainHook.includes(term) ||
        item.phraseHooks.some((hook) => hook.includes(term))
    )
  );
}

function splitTitleParts(title) {
  const normalized = cleanText(title).replace(/[。！？!?]/g, "");
  const afterMatch = normalized.match(/(.+?)(后|之后|以后)[，,]?(.+)/);
  if (afterMatch) {
    return {
      before: cleanText(afterMatch[1]),
      after: cleanText(afterMatch[3]),
    };
  }

  const commaIndex = normalized.search(/[，,]/);
  if (commaIndex > -1) {
    return {
      before: cleanText(normalized.slice(0, commaIndex)),
      after: cleanText(normalized.slice(commaIndex + 1)),
    };
  }

  return {
    before: normalized,
    after: "",
  };
}

function extractLeadSegment(title) {
  const before = splitTitleParts(title).before;
  const actionCues = [
    "穿成",
    "觉醒成",
    "觉醒",
    "进入",
    "闯进",
    "成了",
    "变成",
    "带着",
    "回到",
    "开机",
    "坐",
    "错把",
    "把",
    "为",
    "逼",
    "赶",
    "卖",
    "偷",
    "跟",
    "给",
    "拿",
    "抢",
    "夺",
    "拆",
    "骂",
    "害",
    "献祭",
    "续命",
    "别",
  ];

  let earliestIndex = Number.POSITIVE_INFINITY;
  for (const cue of actionCues) {
    const foundIndex = before.indexOf(cue);
    if (foundIndex > 0 && foundIndex < earliestIndex) {
      earliestIndex = foundIndex;
    }
  }

  let lead = before;
  if (Number.isFinite(earliestIndex)) {
    lead = before.slice(0, earliestIndex);
  }

  return cleanText(lead.replace(/(偷偷|悄悄|偏要|非要|最爱|还想)$/g, ""));
}

function extractActionFragment(item) {
  const before = splitTitleParts(item.sourceTitle).before;
  const lead = extractLeadSegment(item.sourceTitle);
  let action = before;

  if (lead && action.startsWith(lead)) {
    action = action.slice(lead.length);
  }

  action = cleanText(action.replace(/^(偷偷|悄悄|居然|竟然|偏要|非要|最爱|还想)/, ""));

  if (!action) {
    action = item.phraseHooks.find((hook) => hook !== item.mainHook) || item.mainHook;
  }

  return cleanText(action.replace(/后$/g, ""));
}

function extractOutcome(item) {
  if (!item) {
    return "";
  }

  const after = splitTitleParts(item.sourceTitle).after;
  if (after) {
    return cleanText(after);
  }

  const fallback =
    item.phraseHooks.find((hook) => OUTCOME_HINTS.some((term) => hook.includes(term))) ||
    item.mainHook;

  return cleanText(fallback);
}

function extractRelationSubject(item) {
  if (!item) {
    return "";
  }

  const title = item.sourceTitle;
  const matchedTerm = RELATION_TERMS.find((term) => title.includes(term));
  if (matchedTerm) {
    if (matchedTerm === "养妹" && title.includes("老公的养妹")) {
      return "老公的养妹";
    }
    return matchedTerm;
  }

  const lead = extractLeadSegment(title);
  if (lead && lead !== "我" && lead.length <= 10) {
    return lead;
  }

  return "";
}

function extractIdentitySetup(item) {
  if (!item) {
    return "";
  }

  const lead = extractLeadSegment(item.sourceTitle);
  if (lead && IDENTITY_TERMS.some((term) => lead.includes(term))) {
    return lead;
  }

  if (IDENTITY_TERMS.some((term) => item.mainHook.includes(term))) {
    return item.mainHook;
  }

  const phrase = item.phraseHooks.find((hook) =>
    IDENTITY_TERMS.some((term) => hook.includes(term))
  );
  if (phrase) {
    return phrase;
  }

  if (lead && lead !== "我" && lead.length <= 12) {
    return lead;
  }

  return "";
}

function extractIdentityScene(item) {
  if (!item) {
    return "";
  }

  const title = item.sourceTitle;
  const wearMatch = title.match(/穿成([^，,后]+)/);
  if (wearMatch) {
    return cleanText(wearMatch[1]);
  }

  const sceneMatch = SCENE_TERMS.find(
    (term) =>
      title.includes(term) ||
      item.phraseHooks.some((hook) => hook.includes(term)) ||
      item.mainHook.includes(term)
  );

  if (sceneMatch) {
    return sceneMatch;
  }

  return item.phraseHooks.find((hook) => hook !== item.mainHook) || item.mainHook;
}

function extractIdentityOutcome(item) {
  if (!item) {
    return "";
  }

  const direct = extractOutcome(item);
  if (/杀穿|反杀|翻盘|清算|跪|火葬场|称帝/.test(direct)) {
    return direct;
  }

  return direct || "";
}

function extractPowerSetup(item) {
  if (!item) {
    return "";
  }

  const lead = extractLeadSegment(item.sourceTitle);
  if (lead && POWER_TERMS.some((term) => lead.includes(term))) {
    return lead;
  }

  if (POWER_TERMS.some((term) => item.mainHook.includes(term))) {
    return item.mainHook;
  }

  const phrase = item.phraseHooks.find((hook) =>
    POWER_TERMS.some((term) => hook.includes(term))
  );
  if (phrase) {
    return phrase.length <= 8 ? phrase : phrase.slice(0, 8);
  }

  if (lead && lead !== "我" && lead.length <= 10) {
    return lead;
  }

  return "";
}

function extractPowerHarmCandidates(item) {
  if (!item) {
    return [];
  }

  const candidates = [];
  const title = item.sourceTitle;
  const harmedMatch = title.match(/(被[^，,后]+)/);
  if (harmedMatch) {
    candidates.push(cleanText(harmedMatch[1]));
  }

  const action = extractActionFragment(item);
  if (
    /被|献祭|续命|夺|抢|镇宅|开棺|灭世|拿来/.test(action) &&
    !/悔疯了|回来了/.test(action)
  ) {
    candidates.push(action);
  }

  item.phraseHooks.forEach((hook) => {
    if (/被|献祭|续命|夺|抢|命格|气运|镇宅|开棺/.test(hook)) {
      candidates.push(hook);
    }
  });

  return uniqueList(candidates);
}

function extractPowerOutcome(item) {
  if (!item) {
    return "";
  }

  const direct = extractOutcome(item);
  if (/清算|称帝|回来了|悔疯了|怒了|反制|杀穿|陪葬/.test(direct)) {
    return direct;
  }

  return direct || "";
}

function selectBoosterHook(sources, type) {
  const hooks = collectPhraseHooks(sources).filter((hook) => !hasNoisyBits(hook));
  const filtered = hooks.filter((hook) => {
    if (type === "relation") {
      return /绿卡|骨髓|房贷|车贷|遗产|拆刹车|睡大街|冥币/.test(hook);
    }

    if (type === "identity") {
      return /貔貅|嫡女|真千金|侯府|神女|女战神|锦鲤/.test(hook);
    }

    return /阴杯|冥币|续命|献祭|灭世|命格|气运|疯皇/.test(hook);
  });

  return filtered[0] || "";
}

function chooseMainHook(type, hooks) {
  const ranked = shuffle(hooks.slice()).sort((left, right) => {
    return hookScore(right, type) - hookScore(left, type);
  });
  return ranked[0] || hooks[0] || "";
}

function hookScore(hook, type) {
  const text = String(hook || "");
  let score = text.length;

  if (/绿卡|骨髓|刹车|冥币|阴杯|睡大街|献祭|续命|貔貅|侯府/.test(text)) {
    score += 8;
  }

  if (type === "power" && /命格|气运|疯皇|神女|女战神/.test(text)) {
    score += 6;
  }

  if (type === "identity" && /嫡女|真千金|貔貅|神女/.test(text)) {
    score += 5;
  }

  return score;
}

function collectPhraseHooks(sources) {
  return uniqueList(
    sources.flatMap((item) => [item.mainHook, ...(item.phraseHooks || [])]).filter(Boolean)
  );
}

function collectWordHooks(sources, mainHook) {
  const words = uniqueList(
    sources.flatMap((item) => item.wordHooks || []).filter(Boolean)
  );
  if (words.length) {
    return words;
  }

  return uniqueList([mainHook]);
}

function hasNoisyBits(text) {
  return /系统|任务|那日|这天|今天|明天|昨天|意难平|小太阳|黄月光|直播|保姆车|小将军|霸总|\d/.test(
    String(text || "")
  );
}

function isDisplayHookCandidate(text) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 10) || hasNoisyBits(value)) {
    return false;
  }

  if (value.length > 4 && /为|给|让|把|被|在|着|送我|逼我|后|前|离婚|结婚|领证/.test(value)) {
    return false;
  }

  if (/^(重生|豪门|功德|竹马|千金|初恋)$/.test(value)) {
    return false;
  }

  return /(绿卡|骨髓|房贷|车贷|睡大街|冥币|阴杯|续命|命格|气运|侯府|豪门|真千金|假千金|嫡女|庶女|神女|战神|貔貅|养妹|渣男|新欢|前夫|副驾|火葬场|清算|称帝|竹马|彩礼|替嫁|冲喜|换命|血包|断亲|白月光|替身)/.test(
    value
  );
}

function extractCoreHook(text) {
  const value = cleanText(text);
  if (!value) {
    return "";
  }

  const matched = CORE_HOOK_TERMS.find((term) => value.includes(term));
  if (matched) {
    return matched;
  }

  return isDisplayHookCandidate(value) ? value : "";
}

function deriveHooksFromGeneratedTitle(title, type) {
  const hooks = [];
  const value = cleanText(title);

  CORE_HOOK_TERMS.forEach((term) => {
    if (value.includes(term)) {
      hooks.push(term);
    }
  });

  if (type === "relation") {
    const subjectMatch = value.match(/^(.+?)(为|合伙|逼|踩|背|偏|偷)/);
    if (subjectMatch) {
      hooks.push(cleanText(subjectMatch[1]));
    }
  }

  if (type === "identity") {
    const setupMatch = value.match(/^(.+?)(穿成|进入)/);
    const sceneMatch = value.match(/(?:穿成|进入)(.+?)后/);
    if (setupMatch) hooks.push(cleanText(setupMatch[1]));
    if (sceneMatch) hooks.push(cleanText(sceneMatch[1]));
  }

  if (type === "power") {
    const setupMatch = value.match(/^(.+?)(被|开机|掷出)/);
    if (setupMatch) hooks.push(cleanText(setupMatch[1]));
  }

  return uniqueList(hooks.map((hook) => extractCoreHook(hook) || hook))
    .filter((hook) => hook && hook.length <= 8)
    .slice(0, 5);
}

function fitsLength(text, min = 2, max = 14) {
  const value = cleanText(text);
  return value.length >= min && value.length <= max;
}

function validRelationSubject(text) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 8) || hasNoisyBits(value)) {
    return "";
  }

  return RELATION_TERMS.some((term) => value.includes(term)) ? value : "";
}

function validRelationAction(text) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 16) || hasNoisyBits(value)) {
    return "";
  }

  if (/重生|觉醒|系统|任务|真千金|假千金/.test(value)) {
    return "";
  }

  if (!/为|逼|赶|卖|偷|跟|拿|抢|夺|绑|算计|领证|离婚|出轨|骗|骂|嫁|逼走|净身/.test(value)) {
    return "";
  }

  return value;
}

function validIdentitySetup(text) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 8) || hasNoisyBits(value)) {
    return "";
  }

  return /(战神|神女|貔貅|千金|嫡女|王妃|郡主|主母|圣女|天师|女帝|锦鲤)/.test(
    value
  )
    ? value
    : "";
}

function validIdentityScene(text) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 8) || hasNoisyBits(value)) {
    return "";
  }

  return /(嫡女|庶女|弃妻|真千金|假千金|豪门|侯府|病房|灵堂|婚礼|剧组|家门|副驾|新娘)/.test(
    value
  )
    ? value
    : "";
}

function validPowerSetup(text) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 8) || hasNoisyBits(value)) {
    return "";
  }

  return /(皇|神|地府|天界|战神|判官|老爹|阴杯|冥币|侯府)/.test(value)
    ? value
    : "";
}

function validPowerHarm(text) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 10) || hasNoisyBits(value)) {
    return "";
  }

  return /(被|献祭|续命|夺|抢|镇宅|开棺|命格|气运)/.test(value) ? value : "";
}

function validOutcome(text, type) {
  const value = cleanText(text);
  if (!fitsLength(value, 2, 14) || hasNoisyBits(value)) {
    return "";
  }

  const pattern =
    type === "relation"
      ? /(悔疯了|睡大街|火葬场|净身出户|破产|求饶|跪|后悔)/
      : type === "identity"
        ? /(杀穿|清算|翻盘|火葬场|跪|反杀|悔疯了)/
        : /(清算|称帝|回来了|悔疯了|怒了|反制|陪葬|灭世)/;

  return pattern.test(value) ? value : "";
}

function relationSubjectFromHook(hook) {
  const value = cleanText(hook);
  if (/养妹/.test(value)) return "老公";
  if (/丧妻兄弟/.test(value)) return "老婆";
  if (/骨髓|房贷|车贷|绿卡/.test(value)) return sampleOne(["老公", "前夫", "赘婿"]);
  if (/刹车|冥币/.test(value)) return sampleOne(["邻居", "婆婆", "全家"]);
  return "";
}

function relationActionFromHook(hook, attempt) {
  const value = cleanText(hook);
  if (/绿卡/.test(value)) {
    return sampleOne(["瞒着我和人领证拿绿卡", "背着我替别人办绿卡"]);
  }
  if (/骨髓/.test(value)) {
    return sampleOne(["偷卖我的救命骨髓", "拿我的救命骨髓去做人情"]);
  }
  if (/房贷|车贷/.test(value)) {
    return sampleOne(["踩着我贷房贷车贷", "拿着我的名义背房贷车贷"]);
  }
  if (/刹车/.test(value)) {
    return sampleOne(["纵容熊孩子拆我刹车", "放任别人动我的刹车"]);
  }
  if (/冥币/.test(value)) {
    return sampleOne(["把草纸当冥币糊弄我", "拿错纸钱还想骗我"]);
  }
  if (/养妹/.test(value)) {
    return sampleOne(["偏听养妹的话赶我出门", "为了养妹逼我净身出户"]);
  }
  if (/丧妻兄弟/.test(value)) {
    return sampleOne(["背着我和丧妻兄弟领证", "偷偷和丧妻兄弟结婚"]);
  }

  return attempt % 2 === 0
    ? sampleOne(FALLBACKS.relationActions)
    : sampleOne(["合伙算计我", "逼我净身出户", "踩着我上位"]);
}

function relationOutcomeFromHook(hook) {
  const value = cleanText(hook);
  if (/绿卡|骨髓|房贷|车贷/.test(value)) {
    return sampleOne(["身份曝光后他们全家火葬场", "他负债破产悔疯了", "我停了他们的房贷车贷"]);
  }
  if (/刹车|冥币/.test(value)) {
    return sampleOne(["幕后黑手当场悔疯了", "我转身让他们跪着求饶"]);
  }
  return "";
}

function identitySetupFromHook(hook) {
  const value = cleanText(hook);
  if (/貔貅/.test(value)) return "人形貔貅";
  if (/神女/.test(value)) return "神女";
  if (/女战神|战神/.test(value)) return "天界女战神";
  if (/真千金|假千金/.test(value)) return sampleOne(["豪门真千金", "疯批真千金"]);
  if (/嫡女/.test(value)) return sampleOne(["天界女战神", "神女"]);
  return "";
}

function identitySceneFromHook(hook) {
  const value = cleanText(hook);
  if (/嫡女/.test(value)) return "受气包嫡女";
  if (/真千金|假千金/.test(value)) return sampleOne(["豪门假千金", "落魄真千金"]);
  if (/侯府/.test(value)) return "侯府庶女";
  if (/豪门/.test(value)) return "豪门弃妻";
  if (/病房/.test(value)) return "病房陪护";
  return "";
}

function normalizeIdentityScene(setup, scene) {
  const setupText = cleanText(setup);
  const sceneText = cleanText(scene);

  if (/千金/.test(setupText) && /千金/.test(sceneText)) {
    return sampleOne(["豪门弃妻", "侯府庶女", "祭品新娘"]);
  }

  if (/(战神|神女)/.test(setupText) && /(战神|神女)/.test(sceneText)) {
    return "受气包嫡女";
  }

  return sceneText;
}

function identityOutcomeFromHook(hook) {
  const value = cleanText(hook);
  if (/侯府|嫡女/.test(value)) return "反手杀穿侯府";
  if (/貔貅/.test(value)) return "让渣家破产清算";
  if (/真千金|假千金|豪门/.test(value)) return "让豪门全家跪着求我回头";
  return "";
}

function powerSetupFromHook(hook) {
  const value = cleanText(hook);
  if (/疯皇/.test(value)) return "疯皇";
  if (/神女/.test(value)) return "神女";
  if (/女战神|战神/.test(value)) return "天界女战神";
  if (/阴杯/.test(value)) return "阴杯剧组";
  if (/冥币/.test(value)) return "死鬼老爹";
  if (/地府/.test(value)) return "地府判官";
  return "";
}

function powerHarmFromHook(hook) {
  const value = cleanText(hook);
  if (/阴杯/.test(value)) return "开机掷出八个阴杯";
  if (/冥币/.test(value)) return "被拿错纸钱镇宅";
  if (/续命/.test(value)) return "被献祭续命";
  if (/命格|气运/.test(value)) return "被夺命格气运";
  if (/灭世/.test(value)) return "被逼疯皇灭世";
  return "";
}

function powerOutcomeFromHook(hook) {
  const value = cleanText(hook);
  if (/阴杯|冥币/.test(value)) return "我反手清算幕后黑手";
  if (/续命|命格|气运/.test(value)) return "我当场清算全场";
  if (/疯皇|神女/.test(value)) return "她带着未婚夫回来反制全场";
  return "";
}

function ensurePowerHarm(harm) {
  const text = cleanText(harm);
  if (/^被|^献祭|^续命|^开机|^掷出/.test(text)) {
    return text;
  }

  if (!text) {
    return sampleOne(state.lexicon.powerHarms);
  }

  return `被${text}`;
}

function appendBoosterToOutcome(outcome, booster) {
  const cleanOutcome = polishOutcome(outcome);
  if (!booster || containsText(cleanOutcome, booster)) {
    return cleanOutcome;
  }

  if (/我|她|他|全家|幕后|所有人/.test(cleanOutcome)) {
    return cleanOutcome;
  }

  return cleanText(`${cleanOutcome}，连${booster}都成了催命符`);
}

function polishOutcome(outcome) {
  const text = cleanText(outcome);
  if (!text) {
    return "";
  }

  return text;
}

function buildPatternKey(type, title, sources) {
  const fragments = sources.map((item) => item.mainHook).slice(0, 2).join("-");
  return `${type}-${titleKey(title).slice(0, 10)}-${titleKey(fragments).slice(0, 8)}`;
}

function titleKey(text) {
  return String(text || "")
    .replace(/[，,。！？!?；;：“”"'\s]/g, "")
    .trim();
}

function cleanText(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .replace(/^[，,、；;：:]+/, "")
    .replace(/[，,、；;：:]+$/g, "")
    .trim();
}

function containsText(text, fragment) {
  return cleanText(text).includes(cleanText(fragment));
}

function smoothTitle(text) {
  let value = cleanText(text)
    .replace(/后后/g, "后")
    .replace(/，，+/g, "，")
    .replace(/，后/g, "后")
    .replace(/后，后/g, "后，")
    .replace(/、、+/g, "、");

  value = value.replace(/(悔疯了){2,}/g, "悔疯了");
  value = value.replace(/(火葬场){2,}/g, "火葬场");
  value = value.replace(/(睡大街){2,}/g, "睡大街");
  value = value.replace(/(清算){2,}/g, "清算");

  if (!/[，,]/.test(value) && value.includes("后")) {
    value = value.replace(/后/, "后，");
  }

  return value;
}

function uniqueList(list) {
  const seen = new Set();
  const result = [];

  list.forEach((item) => {
    const value = String(item || "").trim();
    if (!value || seen.has(value)) {
      return;
    }

    seen.add(value);
    result.push(value);
  });

  return result;
}

function shuffle(list) {
  const result = list.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function sampleOne(list) {
  if (!Array.isArray(list) || !list.length) {
    return "";
  }

  return list[Math.floor(Math.random() * list.length)];
}

function formatNow() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
