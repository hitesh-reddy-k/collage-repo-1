const mongoose = require("mongoose")
const questions = require("../databasemodels/questionmdel");
const multer = require("multer");
const fs = require('fs');

const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

exports.getPosts = async (req, res) => {
    try {
        const level = req.query.level;
        let query = {};

        if (level && level !== 'all') {
            query.level = level;
        }

        const posts = await questions.find(query)
            .populate({
                path: 'likesAndComments.user',
                select: 'Username RollNumber',
            })
            .populate({
                path: 'likesAndComments.replies.user',
                select: 'Username RollNumber',
            });

        if (posts.length > 0) {
            res.status(200).json({
                success: true,
                data: posts,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No posts found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};


exports.getPostById = async (req, res) => {
    try {
        const post = await questions.findById(req.params.id)
            .populate({
                path: 'likesAndComments.user',
                select: 'Username RollNumber',
            })
            .populate({
                path: 'likesAndComments.replies.user',
                select: 'Username RollNumber',
            });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


// Fetch distinct levels from the posts
exports.getDistinctLevels = async (req, res) => {
    try {
        const levels = await questions.distinct('level');
        if (levels.length > 0) {
            res.status(200).json({
                success: true,
                levels: levels,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No levels found',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};



exports.newPost = async (req, res, next) => {
    upload.single('img')(req, res, async function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'Failed to upload image'
            });
        }

        try {
            const newPostData = req.body;

            if (req.file) {
                const imgData = fs.readFileSync(req.file.path);
                newPostData.img = {
                    data: imgData,
                    contentType: req.file.mimetype
                };
                fs.unlinkSync(req.file.path);
            }

            const requiredFields = ['question', 'level', 'solution'];
            for (const field of requiredFields) {
                if (!newPostData[field]) {
                    return res.status(400).json({
                        success: false,
                        error: `${field} is required`
                    });
                }
            }

            const newPost = await questions.create(newPostData);

            res.status(201).json({
                success: true,
                post: newPost
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    });
};


exports.addLike = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;

    try {
        const post = await questions.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.likedBy.includes(userId)) {
            post.likedBy.pull(userId);
        } else {
            post.likedBy.push(userId);
        }

        await post.save();
        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.addComment = async (req, res) => {
    const { comment } = req.body;
    const postId = req.params.postId;

    try {
        const userId = req.user.id;
        const username = req.user.username;

        const post = await questions.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            user: new mongoose.Types.ObjectId(userId),
            username: username,
            comment: comment,
            likes: 0 
        };

        post.likesAndComments.push(newComment);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getLikesAndComments = async (req, res) => {
    try {
        const posts = await questions.find()
            .populate("user", "Username Year")
            .populate("likesAndComments.user", "Username RollNumber");

        if (!posts) {
            return res.status(404).json({ message: "Posts not found" });
        }

        res.status(200).json({ data: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addReply = async (req, res) => {
    const { reply } = req.body;
    const { postId, commentId } = req.params;
    const userId = req.user._id;
    const username = req.user.Username;

    try {
        const post = await questions.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.likesAndComments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const newReply = {
            user: new mongoose.Types.ObjectId(userId),
            Username: username,
            comment: reply,
        };

        comment.replies.push(newReply);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
