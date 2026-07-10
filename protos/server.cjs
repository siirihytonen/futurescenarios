// Static preview server for the lowfi prototypes. Serves ../lowfi.
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "lowfi");
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/future-a.html";
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "text/plain" });
    res.end(data);
  });
}).listen(8123, () => console.log("serving lowfi on 8123"));
