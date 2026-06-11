// Tiny static file server for local preview only (not part of the prototypes).
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = "/Users/johnappleseed/Documents/GitHub/PROTOTYPE-CREATING/protos";
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "text/plain" });
    res.end(data);
  });
}).listen(8123, () => console.log("serving on 8123"));
