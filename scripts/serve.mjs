import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "4173", 10);
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".ttf", "font/ttf"]
]);

function respond(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(body);
}

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
  } catch (error) {
    respond(response, 400, "Bad request");
    return;
  }

  const requested = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const target = path.resolve(root, `.${requested}`);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    respond(response, 403, "Forbidden");
    return;
  }

  fs.stat(target, (statError, stats) => {
    if (statError || !stats.isFile()) {
      respond(response, 404, "Not found");
      return;
    }
    fs.readFile(target, (readError, body) => {
      if (readError) {
        respond(response, 500, "Read error");
        return;
      }
      respond(response, 200, body, mime.get(path.extname(target).toLowerCase()) || "application/octet-stream");
    });
  });
});

server.listen(port, host, () => {
  console.log(`问津 / WENJIN local preview: http://${host}:${port}/`);
});
