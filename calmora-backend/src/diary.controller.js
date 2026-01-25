const prisma = require("./prisma");

function toISODateOnly(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

async function listDiaryEntries(req, res) {
  const currentUser = req.user;
  const date = req.query.date ? String(req.query.date) : null;

  const where = {
    userId: currentUser.id,
    deletedAt: null,
  };

  if (date) {
    const iso = toISODateOnly(date);
    if (!iso) return res.status(400).json({ error: "Invalid date" });
    where.entryDate = new Date(iso);
  }

  const items = await prisma.diaryEntry.findMany({
    where,
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
  });

  return res.json({ items });
}

async function createDiaryEntry(req, res) {
  const currentUser = req.user;
  const { entryDate, mood, title, content } = req.body;

  const trimmed = typeof content === "string" ? content.trim() : "";
  if (!trimmed) return res.status(400).json({ error: "content is required" });

  const dateIso = toISODateOnly(entryDate || new Date());
  if (!dateIso) return res.status(400).json({ error: "Invalid entryDate" });

  const created = await prisma.diaryEntry.create({
    data: {
      userId: currentUser.id,
      entryDate: new Date(dateIso),
      mood: typeof mood === "string" ? mood : null,
      title: typeof title === "string" ? title.trim().slice(0, 120) : null,
      content: trimmed,
    },
  });

  return res.status(201).json({ item: created });
}

async function updateDiaryEntry(req, res) {
  const currentUser = req.user;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  const existing = await prisma.diaryEntry.findFirst({
    where: { id, userId: currentUser.id, deletedAt: null },
  });
  if (!existing) return res.status(404).json({ error: "Not found" });

  const { entryDate, mood, title, content } = req.body;

  const data = {};

  if (entryDate !== undefined) {
    const dateIso = toISODateOnly(entryDate);
    if (!dateIso) return res.status(400).json({ error: "Invalid entryDate" });
    data.entryDate = new Date(dateIso);
  }

  if (mood !== undefined) data.mood = typeof mood === "string" ? mood : null;
  if (title !== undefined) data.title = typeof title === "string" ? title.trim().slice(0, 120) : null;

  if (content !== undefined) {
    const trimmed = typeof content === "string" ? content.trim() : "";
    if (!trimmed) return res.status(400).json({ error: "content is required" });
    data.content = trimmed;
  }

  const updated = await prisma.diaryEntry.update({
    where: { id },
    data,
  });

  return res.json({ item: updated });
}

async function deleteDiaryEntry(req, res) {
  const currentUser = req.user;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  const existing = await prisma.diaryEntry.findFirst({
    where: { id, userId: currentUser.id, deletedAt: null },
  });
  if (!existing) return res.status(404).json({ error: "Not found" });

  await prisma.diaryEntry.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return res.json({ ok: true });
}

module.exports = {
  listDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
};
