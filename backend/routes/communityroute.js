const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communitypage");
const { isAuthenticatedUser, authorizeRoles } = require('../controllers/user');

router.get("/posts",isAuthenticatedUser, communityController.getPosts);
router.post("/create-post",isAuthenticatedUser, communityController.newPost);
router.post("/post/:postId/like",isAuthenticatedUser, communityController.addLike);
router.post('/posts/:postId/comment',isAuthenticatedUser, communityController.addComment);
router.get("/post/:postId/likes-comments",isAuthenticatedUser, communityController.getLikesAndComments);
router.get("/student/:userId",isAuthenticatedUser, communityController.getUserProfile);


module.exports = router;
