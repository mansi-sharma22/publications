const express = require("express");
const cors = require("cors");
const publicationRoutes = require("./routes/publications");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/publications", publicationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
