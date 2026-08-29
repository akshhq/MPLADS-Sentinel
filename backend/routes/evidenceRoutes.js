const express = require("express");
const router = express.Router();
const { getEvidence, getEvidenceById } = require("../controllers/evidenceController");

router.get("/", getEvidence);
router.get("/:id", getEvidenceById);

module.exports = router;
