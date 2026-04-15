const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require("../controllers/userController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// All routes here are Admin only
router.use(authMiddleware, roleMiddleware(["admin"]));

router.get("/", getAllUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
