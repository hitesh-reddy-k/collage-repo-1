const express = require("express");
const router = express.Router();
const { uploadmarks, getmarks, getrollnumber } = require("../controllers/marks");
const { isAuthenticatedUser, authorizeRoles } = require('../controllers/user');

router.post("/uploadmarks", isAuthenticatedUser, authorizeRoles('ADMIN'), uploadmarks);
router.get("/marks", isAuthenticatedUser, getmarks);
router.get("/rollnumbers", getrollnumber);

module.exports = router;
