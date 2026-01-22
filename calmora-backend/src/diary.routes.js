const express = require("express");
const { authRequired } = require("./middleware/auth");
const {
  listDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
} = require("./diary.controller");

const router = express.Router();

router.get("/", authRequired, listDiaryEntries);
router.post("/", authRequired, createDiaryEntry);
router.put("/:id", authRequired, updateDiaryEntry);
router.delete("/:id", authRequired, deleteDiaryEntry);

module.exports = router;
