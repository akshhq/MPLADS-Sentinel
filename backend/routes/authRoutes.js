const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

router.get("/me", optionalAuth, authController.getCurrentUser);
router.get("/roles", authController.getRoles);
router.get("/personas", authController.getDemoPersonas);
router.patch("/profile", requireAuth, authController.updateProfile);

module.exports = router;
