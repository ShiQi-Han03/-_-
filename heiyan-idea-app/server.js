const fs = require("fs");
const http = require("http");
const path = require("path");
const { exec } = require("child_process");

const HOST = "127.0.0.1";
const PORT = 3210;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function openBrowser() {
  exec(`start "" "http://${HOST}:${PORT}"`);
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end(message);
}

function resolveFilePath(requestUrl) {
  const pathname = decodeURIComponent((requestUrl || "/").split("?")[0]);
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const absolutePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return absolutePath;
}

function serveFile(filePath, response) {
  fs.readFile(filePath, (error, fileBuffer) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendText(response, 404, "未找到对应页面。");
        return;
      }

      sendText(response, 500, "页面读取失败，请稍后重试。");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
    });
    response.end(fileBuffer);
  });
}

const server = http.createServer((request, response) => {
  const resolvedPath = resolveFilePath(request.url);

  if (!resolvedPath) {
    sendText(response, 403, "无法访问该路径。");
    return;
  }

  fs.stat(resolvedPath, (error, stats) => {
    if (error) {
      sendText(response, 404, "未找到对应页面。");
      return;
    }

    if (stats.isDirectory()) {
      serveFile(path.join(resolvedPath, "index.html"), response);
      return;
    }

    serveFile(resolvedPath, response);
  });
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.log(
      `端口 ${PORT} 已被占用，应该是灵感生成器已经在运行，我这边直接帮你打开现有页面。`
    );
    openBrowser();
    setTimeout(() => process.exit(0), 600);
    return;
  }

  console.error(error);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`黑岩灵感生成器已启动：http://${HOST}:${PORT}`);
  console.log("这个窗口保持开着，网页就能一直使用。");
  openBrowser();
});
