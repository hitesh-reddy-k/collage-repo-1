const express = require("express");
const router = express.Router();
const { joinClub, leaveClub } = require("../controllers/clubs");

router.post("/join", joinClub);
router.post("/leave", leaveClub);

module.exports = router;
