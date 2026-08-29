const express = require("express");
const router = express.Router();
const { getDatasets, getDatasetById } = require("../controllers/datasetController");

router.get("/", getDatasets);
router.get("/:id", getDatasetById);

module.exports = router;
