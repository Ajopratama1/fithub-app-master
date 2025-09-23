const express = require("express");
const router = express.Router();
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");
const {
    createMember,
    listMembers,
    getMember,
    updateMember,
    deleteMember,
    getProfile,
    getAttendance,
    getDashboardData,
    uploadMiddleware,
    handleUploadProfileImage
} = require("../controllers/memberController");

router.use(authMiddleware);

// Rute yang lebih spesifik harus di atas
router.get("/dashboard", adminOnly, getDashboardData); // ✅ Pindahkan ke sini
router.get("/profile", getProfile);
router.get("/attendance", getAttendance);

// Rute yang lebih umum (dengan :id) harus di bawah
router.get("/:id", getMember);
router.put("/:id", updateMember);
router.post("/profile-image", uploadMiddleware, handleUploadProfileImage);

// Rute tanpa parameter
router.get("/", adminOnly, listMembers);
router.post("/", adminOnly, createMember);
router.delete("/:id", adminOnly, deleteMember);

module.exports = router;