const express = require("express");
const router = express.Router();

const{

    searchUsersBySubject,
    searchUsersByAvailability,
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

//All routes are protected(require authentication)
router.get("/search", authMiddleware, searchUsersBySubject);
router.post("/search/availability", authMiddleware, searchUsersByAvailability);

module.exports = router;