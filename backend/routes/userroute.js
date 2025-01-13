const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getmeUser,
  isAuthenticatedUser,
  getallUser,
  authorizeRoles,
  updatepassword,
  updateusername,
  updatePhoneNumber,
  updatedescription,
  updateGithub,
  updateinstagram,
  updatelinkedIn,
  getUserProfile,
  makeAdmin

} = require("../controllers/user");



// Define routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
// router.get("/user/:userId/profile",isAuthenticatedUser, getUserProfile);
router.post("/forgotpassword", forgotPassword);
router.get("/password/reset/:id/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getmeUser);
router.put("/update/Password", isAuthenticatedUser,updatepassword );
router.put("/update/UserName", isAuthenticatedUser,updateusername );
router.put("/update/PhoneNumber", isAuthenticatedUser,updatePhoneNumber );
router.put("/update/description", isAuthenticatedUser,updatedescription );
router.put("/update/Github", isAuthenticatedUser,updateGithub );
router.put("/update/Instagram", isAuthenticatedUser,updateinstagram );
router.put("/update/LinkedIn", isAuthenticatedUser,updatelinkedIn );
router.put("/make-admin/:id", isAuthenticatedUser,authorizeRoles('ADMIN'),makeAdmin );


router.get("/allusers", isAuthenticatedUser, authorizeRoles("ADMIN"), getallUser);

module.exports = router;
