import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("videos.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT,
    source TEXT DEFAULT 'other',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add source column if it doesn't exist
try {
  db.prepare("SELECT source FROM videos LIMIT 1").get();
} catch (e) {
  db.exec("ALTER TABLE videos ADD COLUMN source TEXT DEFAULT 'other'");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/videos", (req, res) => {
    const videos = db.prepare("SELECT * FROM videos ORDER BY created_at DESC").all();
    res.json(videos);
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // User requested credentials: sadat / sadia2299@#
    if (username === "sadat" && password === "sadia2299@#") {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Auth Middleware for mutations
  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers['x-admin-password'];
    if (authHeader === "sadia2299@#") {
      next();
    } else {
      res.status(403).json({ success: false, message: "Unauthorized: Admin password required" });
    }
  };

  app.post("/api/videos", authMiddleware, (req, res) => {
    const { title, url, thumbnail } = req.body;
    
    let source = 'other';
    if (url.includes('youtube.com') || url.includes('youtu.be')) source = 'youtube';
    else if (url.includes('facebook.com')) source = 'facebook';
    else if (url.includes('tiktok.com')) source = 'tiktok';
    else if (url.includes('instagram.com')) source = 'instagram';

    const stmt = db.prepare("INSERT INTO videos (title, url, thumbnail, source) VALUES (?, ?, ?, ?)");
    const info = stmt.run(title, url, thumbnail, source);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/videos/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { title, url, thumbnail } = req.body;
    
    let source = 'other';
    if (url.includes('youtube.com') || url.includes('youtu.be')) source = 'youtube';
    else if (url.includes('facebook.com')) source = 'facebook';
    else if (url.includes('tiktok.com')) source = 'tiktok';
    else if (url.includes('instagram.com')) source = 'instagram';

    db.prepare("UPDATE videos SET title = ?, url = ?, thumbnail = ?, source = ? WHERE id = ?")
      .run(title, url, thumbnail, source, id);
    res.json({ success: true });
  });

  app.delete("/api/videos/category/:source", authMiddleware, (req, res) => {
    const { source } = req.params;
    try {
      db.prepare("DELETE FROM videos WHERE source = ?").run(source);
      res.json({ success: true });
    } catch (err) {
      console.error("Delete category error:", err);
      res.status(500).json({ success: false });
    }
  });

  app.delete("/api/videos/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    console.log(`DELETE request for video ID: ${id}`);
    try {
      const videoId = parseInt(id);
      if (isNaN(videoId)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }
      const result = db.prepare("DELETE FROM videos WHERE id = ?").run(videoId);
      console.log(`Deleted ${result.changes} rows`);
      res.json({ success: true });
    } catch (err) {
      console.error("Delete video error:", err);
      res.status(500).json({ success: false });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
