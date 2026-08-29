const express = require("express");
const router = express.Router();
const {
  evaluateProposal,
  checkDuplicates,
  verifyImage,
  analyzeProgressDivergence,
  getNetworkGraph,
  predictRisk,
  simulateAttack,
} = require("../controllers/aiEngineController");

router.post("/proposal-check", evaluateProposal);
router.post("/duplicate-check", checkDuplicates);
router.post("/vision-verify", verifyImage);
router.post("/financial-physical-divergence", analyzeProgressDivergence);
router.get("/graph-network", getNetworkGraph);
router.post("/predictive-risk", predictRisk);
router.post("/attack-simulator", simulateAttack);

module.exports = router;
