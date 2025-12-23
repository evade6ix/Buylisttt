import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------------------- Banana Games ----------------------
// Example: GET /api/banana/search?name=charizard&product_line=Pokemon
app.get("/api/banana/search", async (req, res) => {
  try {
    const { name = "", product_line = "Pokemon" } = req.query;

    const url = "https://buylist.bananagames.ca/saas/search";

    const { data } = await axios.get(url, {
      params: {
        store_id: "eALAyQJ706", // Banana Games store ID
        product_line,
        mongo: true,
        sort: "Relevance",
        name,
        buylist_products: true,
        ignore_is_hot_order: true,
        set_name: "",
        rarity: "",
        import_list_text: "",
        is_hot: "",
        type_line: "",
        color: "",
        finish: "",
        players: "",
        playtime: "",
        min_year: "",
        max_year: "",
        publisher: "",
        vendor: "",
        designer: "",
        mechanic: "",
        category: "",
        tags: "",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("Banana search error:", err.message);
    res.status(500).json({ error: "Banana search failed" });
  }
});

// ---------------------- Game3 ----------------------
// Example: GET /api/game3/search?name=charizard&product_line=Pokemon
app.get("/api/game3/search", async (req, res) => {
  try {
    const { name = "", product_line = "Pokemon" } = req.query;

    const url = "https://buylist.game3.ca/saas/search";

    const { data } = await axios.get(url, {
      params: {
        store_id: "8pay5REPhG", // ✅ Correct Game3 Storepass store_id
        product_line,
        mongo: true,
        sort: "Relevance",
        name,
        buylist_products: true,
        ignore_is_hot_order: true,
        set_name: "",
        rarity: "",
        import_list_text: "",
        is_hot: "",
        type_line: "",
        color: "",
        finish: "",
        players: "",
        playtime: "",
        min_year: "",
        max_year: "",
        publisher: "",
        vendor: "",
        designer: "",
        mechanic: "",
        category: "",
        tags: "",
      },
    });

    res.json(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Game3 search error status:", err.response?.status);
      console.error("Game3 search error data:", err.response?.data);
      console.error("Game3 search error message:", err.message);

      return res.status(500).json({
        error: "Game3 search failed",
        details: err.response?.data || err.message,
      });
    }

    console.error("Game3 search unexpected error:", err);
    res
      .status(500)
      .json({ error: "Game3 search failed", details: "Unknown error" });
  }
});

// ---------------------- 401 Games ----------------------
// Example: GET /api/401games/search?name=charizard&product_line=Pokemon
app.get("/api/401games/search", async (req, res) => {
  try {
    const { name = "", product_line = "Pokemon" } = req.query;

    const url = "https://buylist.401games.ca/saas/search";

    const { data } = await axios.get(url, {
      params: {
        store_id: "USYSFNJ9bg",
        product_line,
        mongo: true,
        sort: "Relevance",
        name,
        buylist_products: true,
        // extra flags from their URL
        set_name: "",
        rarity: "",
        import_list_text: "",
        is_hot: "",
        type_line: "",
        color: "",
        finish: "",
        players: "",
        playtime: "",
        min_year: "",
        max_year: "",
        publisher: "",
        vendor: "",
        designer: "",
        mechanic: "",
        category: "",
        tags: "",
        with_count: true,
        no_track: true,
      },
    });

    res.json(data);
  } catch (err) {
    console.error("401Games search error:", err.message);
    res.status(500).json({ error: "401Games search failed" });
  }
});

// ---------------------- Enter The Battlefield ----------------------
// Example: GET /api/etb/search?name=charizard&product_line=Pokemon
app.get("/api/etb/search", async (req, res) => {
  try {
    const { name = "", product_line = "Pokemon" } = req.query;

    const url = "https://buylist.enterthebattlefield.ca/saas/search";

    const { data } = await axios.get(url, {
      params: {
        store_id: "TAWdyDsyt9",
        product_line,
        mongo: true,
        sort: "Relevance",
        name,
        buylist_products: true,
        ignore_is_hot_order: true,
        set_name: "",
        rarity: "",
        import_list_text: "",
        is_hot: "",
        type_line: "",
        color: "",
        finish: "",
        players: "",
        playtime: "",
        min_year: "",
        max_year: "",
        publisher: "",
        vendor: "",
        designer: "",
        mechanic: "",
        category: "",
        tags: "",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("ETB search error:", err.message);
    res.status(500).json({ error: "EnterTheBattlefield search failed" });
  }
});

// ---------------------- Duel Kingdom ----------------------
// Example: GET /api/duelkingdom/search?name=charizard&product_line=Pokemon
app.get("/api/duelkingdom/search", async (req, res) => {
  try {
    const { name = "", product_line = "Pokemon" } = req.query;

    const url = "https://buylist.duelkingdom.ca/saas/search";

    const { data } = await axios.get(url, {
      params: {
        store_id: "SbOvaVOsxW",
        product_line,
        mongo: true,
        sort: "Buy Price: High-Low",
        name,
        buylist_products: true,
        ignore_is_hot_order: true,
        set_name: "",
        rarity: "",
        import_list_text: "",
        is_hot: "",
        type_line: "",
        color: "",
        finish: "",
        players: "",
        playtime: "",
        min_year: "",
        max_year: "",
        publisher: "",
        vendor: "",
        designer: "",
        mechanic: "",
        category: "",
        tags: "",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("DuelKingdom search error:", err.message);
    res.status(500).json({ error: "DuelKingdom search failed" });
  }
});

// ---------------------- Taps Games ----------------------
// Example: GET /api/taps/search?name=charizard&product_line=Pokemon
app.get("/api/taps/search", async (req, res) => {
  try {
    const { name = "", product_line = "Pokemon" } = req.query;

    const url = "https://buylist.tapsgames.com/saas/search";

    const { data } = await axios.get(url, {
      params: {
        store_id: "afbPeXJ2EK",
        product_line,
        mongo: true,
        sort: "Relevance",
        name,
        buylist_products: true,
        ignore_is_hot_order: true,
        set_name: "",
        rarity: "",
        import_list_text: "",
        is_hot: "",
        type_line: "",
        color: "",
        finish: "",
        players: "",
        playtime: "",
        min_year: "",
        max_year: "",
        publisher: "",
        vendor: "",
        designer: "",
        mechanic: "",
        category: "",
        tags: "",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("TapsGames search error:", err.message);
    res.status(500).json({ error: "TapsGames search failed" });
  }
});

// ---------------------- Emmett's Toy Stop ----------------------
// Example: GET /api/emmetts/search?name=charizard&product_line=Pokemon
app.get("/api/emmetts/search", async (req, res) => {
  try {
    const { name = "", product_line = "Pokemon" } = req.query;

    const url = "https://buylist.emmettstoystop.com/saas/search";

    const { data } = await axios.get(url, {
      params: {
        store_id: "Gs1Rp5LNP1",
        product_line,
        mongo: true,
        sort: "Relevance",
        name,
        buylist_products: true,
        ignore_is_hot_order: true,
        set_name: "",
        rarity: "",
        import_list_text: "",
        is_hot: "",
        type_line: "",
        color: "",
        finish: "",
        players: "",
        playtime: "",
        min_year: "",
        max_year: "",
        publisher: "",
        vendor: "",
        designer: "",
        mechanic: "",
        category: "",
        tags: "",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("Emmetts search error:", err.message);
    res.status(500).json({ error: "Emmetts search failed" });
  }
});

// (Optional) old test route - you can keep or delete
app.get("/api/test", async (req, res) => {
  try {
    const url = "https://buylist.bananagames.ca/retailer/buylist";
    await axios.get(url);
    res.send("Fetched Banana Games homepage OK");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ---------------------- Serve React build ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Vite build output
const clientDistPath = path.join(__dirname, "..", "client", "dist");

// Serve static files from the React app
app.use(express.static(clientDistPath));

// Fallback: for any non-API route, send index.html (let React Router handle it)
app.get("/*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }

  res.sendFile(path.join(clientDistPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on port " + PORT));
