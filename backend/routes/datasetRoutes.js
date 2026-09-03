const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getDatasets,
  getDatasetById,
  getNationalDatasetSummary,
  ingestESakshiFile,
} = require("../controllers/datasetController");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

router.get("/summary/national", getNationalDatasetSummary);
router.get("/", getDatasets);
router.post("/ingest-esakshi", upload.single("file"), ingestESakshiFile);
router.get("/:id", getDatasetById);

module.exports = router;
