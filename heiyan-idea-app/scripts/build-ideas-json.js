const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const APP_DIR = path.resolve(__dirname, "..");
const OUTPUT_JSON = path.join(APP_DIR, "public", "data", "ideas.json");
const LOCAL_PACKAGED_SOURCE = path.join(
  ROOT_DIR,
  "素材数据",
  "heiyan_hooks_non_empty.xlsx"
);
const DIRECT_SOURCE = path.join(
  ROOT_DIR,
  "黑岩噱头提取输出",
  "heiyan_hooks_non_empty.xlsx"
);

function uniqueList(list) {
  const seen = new Set();
  const result = [];

  for (const item of list) {
    const value = String(item || "").trim();
    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    result.push(value);
  }

  return result;
}

function splitPipeList(value) {
  return uniqueList(String(value || "").split("|"));
}

function scoreValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : 0;
}

function confidenceValue(value) {
  const text = String(value || "").trim();
  if (text === "高" || text === "中" || text === "低") {
    return text;
  }

  return "低";
}

function wordsFromHook(mainHook) {
  const cleaned = String(mainHook || "")
    .replace(/[，。、“”‘’！？,.!?/\\]/g, " ")
    .trim();
  const pieces = cleaned.split(/\s+/).filter(Boolean);
  return uniqueList(pieces.length ? pieces : [cleaned]);
}

function ensureList(value, fallbackList) {
  const list = uniqueList(Array.isArray(value) ? value : []);
  if (list.length) {
    return list;
  }

  return uniqueList(Array.isArray(fallbackList) ? fallbackList : []);
}

function findWorkbookPath() {
  if (fs.existsSync(LOCAL_PACKAGED_SOURCE)) {
    return LOCAL_PACKAGED_SOURCE;
  }

  if (fs.existsSync(DIRECT_SOURCE)) {
    return DIRECT_SOURCE;
  }

  const siblingDir = fs
    .readdirSync(ROOT_DIR, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.includes("提取输出"));

  if (siblingDir) {
    const fallbackPath = path.join(
      ROOT_DIR,
      siblingDir.name,
      "heiyan_hooks_non_empty.xlsx"
    );

    if (fs.existsSync(fallbackPath)) {
      return fallbackPath;
    }
  }

  throw new Error(
    [
      "找不到素材文件 heiyan_hooks_non_empty.xlsx。",
      `已检查路径：${DIRECT_SOURCE}`,
    ].join("\n")
  );
}

function normalizeRow(row, index) {
  const sourceTitle = String(row["原标题"] || "").trim();
  const mainHook = String(row["主噱头短语"] || "").trim();

  if (!sourceTitle || !mainHook) {
    return null;
  }

  const batchNo = Number(row["批次号"]) || 0;
  const sourceRowNo = Number(row["原表行号"]) || index + 2;

  const phraseHooks = ensureList(splitPipeList(row["短语噱头列表"]), [mainHook]);
  const wordHooks = ensureList(splitPipeList(row["拆分噱头词"]), wordsFromHook(mainHook));
  const tags = splitPipeList(row["噱头标签"]);

  return {
    id: `b${batchNo || 0}-r${sourceRowNo}`,
    batchNo,
    sourceRowNo,
    sourceTitle,
    mainHook,
    phraseHooks: uniqueList([mainHook, ...phraseHooks]).slice(0, 8),
    wordHooks: uniqueList([...wordHooks, ...wordsFromHook(mainHook)]).slice(0, 8),
    tags,
    score: scoreValue(row["得分"]),
    confidence: confidenceValue(row["置信度"]),
  };
}

function buildIdeasJson() {
  const workbookPath = findWorkbookPath();
  const workbook = xlsx.readFile(workbookPath);
  const sheet = workbook.Sheets["filtered_rows"];

  if (!sheet) {
    throw new Error("工作表 filtered_rows 不存在，无法生成 ideas.json。");
  }

  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
  const items = [];
  let removedEmptyRows = 0;

  rows.forEach((row, index) => {
    const normalized = normalizeRow(row, index);
    if (!normalized) {
      removedEmptyRows += 1;
      return;
    }

    items.push(normalized);
  });

  const confidenceStats = items.reduce(
    (accumulator, item) => {
      accumulator[item.confidence] += 1;
      return accumulator;
    },
    { 高: 0, 中: 0, 低: 0 }
  );

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceWorkbook: workbookPath,
    sheetName: "filtered_rows",
    total: items.length,
    removedEmptyRows,
    stats: {
      confidence: confidenceStats,
    },
    items,
  };

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(payload, null, 2), "utf8");

  console.log(
    [
      "ideas.json 已生成",
      `素材源：${workbookPath}`,
      `输出文件：${OUTPUT_JSON}`,
      `可用素材：${items.length} 条`,
      `剔除空行：${removedEmptyRows} 条`,
      `置信度分布：高 ${confidenceStats.高} / 中 ${confidenceStats.中} / 低 ${confidenceStats.低}`,
    ].join("\n")
  );
}

try {
  buildIdeasJson();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
