const express = require("express");
const router = express.Router();
const { joinClub, leaveClub,createClub } = require("../controllers/clubs");

router.post("/join", joinClub);
router.post("/leave", leaveClub);
router.post("/create", createClub);

module.exports = router;
