const express = require("express");
const router = express.Router();

const authController = require("../controllers/user");

const { newPost, getPosts,getDistinctLevels, addLike,getLikesAndComments,addComment, addReply,getPostById} = require("../controllers/question");

router.route("/create-post").post(authController.isAuthenticatedUser,authController.authorizeRoles("ADMIN"),newPost);
router.route("/posts").get(authController.isAuthenticatedUser,getPosts);
router.route("/post/:postId/like").post(authController.isAuthenticatedUser,addLike);
router.route("/posts/:postId/comment").post(authController.isAuthenticatedUser,addComment);
router.route("/post/:postId/likes-comments").post(authController.isAuthenticatedUser,getLikesAndComments);
router.post('/post/:postId/comment/:commentId/reply',authController.isAuthenticatedUser,addReply);
router.get('/posts/:id',authController.isAuthenticatedUser,getPostById);
router.get('/levels',authController.isAuthenticatedUser, getDistinctLevels);



module.exports = router;
