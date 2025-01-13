const express = require("express");
const{ getMessages, sendMessage } = require("../controllers/message");
const { isAuthenticatedUser, authorizeRoles } = require('../controllers/user');

const router = express.Router();

router.get("/:id", isAuthenticatedUser, getMessages);
router.post("/send/:id", isAuthenticatedUser, sendMessage);

module.exports = router;