const express = require("express");
const router = express.Router();
const { getDatasets, getDatasetById, getNationalDatasetSummary } = require("../controllers/datasetController");

router.get("/summary/national", getNationalDatasetSummary);
router.get("/", getDatasets);
router.get("/:id", getDatasetById);

module.exports = router;
