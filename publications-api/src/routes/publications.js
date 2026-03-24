const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// ── GET /api/publications ──────────────────────────────────────────
// Query params: field, year, search, page (default 1), limit (default 20)
router.get("/", async (req, res) => {
  try {
    const { field, year, search, page = 1, limit = 20 } = req.query;

    const where = {};

    if (field) {
      where.field = field;
    }

    if (year) {
      where.year = parseInt(year);
    }

    if (search) {
      where.OR = [
        { title:   { contains: search, mode: "insensitive" } },
        { authors: { contains: search, mode: "insensitive" } },
        { field:   { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [publications, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        skip,
        take: parseInt(limit),
      }),
      prisma.publication.count({ where }),
    ]);

    res.json({
      data: publications,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch publications" });
  }
});

// ── GET /api/publications/:id ──────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const publication = await prisma.publication.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    res.json(publication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch publication" });
  }
});

// ── POST /api/publications ─────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { title, authors, venue, year, field, abstract, link } = req.body;

    if (!title || !authors || !venue || !year) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["title", "authors", "venue", "year"],
      });
    }

    const publication = await prisma.publication.create({
      data: {
        title,
        authors,
        venue,
        year: parseInt(year),
        field:    field    || null,
        abstract: abstract || null,
        link:     link     || null,
      },
    });

    res.status(201).json(publication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create publication" });
  }
});

// ── PUT /api/publications/:id ──────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { title, authors, venue, year, field, abstract, link } = req.body;

    const existing = await prisma.publication.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Publication not found" });
    }

    const publication = await prisma.publication.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(title    !== undefined && { title }),
        ...(authors  !== undefined && { authors }),
        ...(venue    !== undefined && { venue }),
        ...(year     !== undefined && { year: parseInt(year) }),
        ...(field    !== undefined && { field }),
        ...(abstract !== undefined && { abstract }),
        ...(link     !== undefined && { link }),
      },
    });

    res.json(publication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update publication" });
  }
});

// ── DELETE /api/publications/:id ───────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.publication.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Publication not found" });
    }

    await prisma.publication.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete publication" });
  }
});

module.exports = router;
