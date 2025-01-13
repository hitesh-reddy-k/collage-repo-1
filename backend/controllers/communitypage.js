const Post = require("../databasemodels/community-page-model");
const multer = require("multer");
const fs = require("fs");
const User= require("../databasemodels/usermodel")
const mongoose = require("mongoose")

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
        const posts = await Post.find()
            .populate('user', 'Username Year')
            .populate('likesAndComments.user', 'Username RollNumber');
        
        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to retrieve information"
        });
    }
};

exports.getUserProfile = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).select("-password").select("-conformpassword").select("-Email").select("-PhoneNumber").select("-role")
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};


exports.newPost = async (req, res, next) => {
    // Using Multer middleware to handle file upload
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: 'Failed to upload image'
            });
        }

        try {
            const newPostData = req.body;

            // If there's an uploaded file, read it and attach to newPostData
            if (req.file) {
                console.log('Uploaded File:', req.file);
                const imgData = fs.readFileSync(req.file.path);
                newPostData.img = {
                    data: imgData,
                    contentType: req.file.mimetype
                };

                // Delete the temporary file after reading its data
                fs.unlinkSync(req.file.path);
            }

            // Validate required fields
            const requiredFields = ['Post', 'user'];
            for (const field of requiredFields) {
                if (!newPostData[field]) {
                    return res.status(400).json({
                        success: false,
                        error: `${field} is required`
                    });
                }
            }

            // Create a new post in the database
            const newPost = await Post.create(newPostData);

            // Respond with success and the created post
            res.status(201).json({
                success: true,
                post: newPost
            });
        } catch (error) {
            console.error('Error creating new post:', error);
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
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.likedBy.includes(userId)) {
            // If already liked, unlike the post
            post.likedBy.pull(userId);
        } else {
            // Otherwise, like the post
            post.likedBy.push(userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



exports.addComment = async (req, res) => {
    const { comment } = req.body;
    const postId = req.params.postId;

    try {
        const userId = req.user.id;  
        const username = req.user.username;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create comment object
        const newComment = {
            user:new mongoose.Types.ObjectId(userId),
            Username: username,
            comment: comment,
            likes: 0 // Initialize likes if needed
        };

        // Add comment to post
        post.likesAndComments.push(newComment);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        console.error('Error submitting comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


  exports.getLikesAndComments = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("user", "Username Year")
        .populate("likesAndComments.user", "Username RollNumber");
    
      console.log('Posts:', posts); // Add this line to check what is being fetched
    
      if (!posts) {
        return res.status(404).json({ message: "Posts not found" });
      }
    
      res.status(200).json({ data: posts });
    } catch (error) {
      console.error('Error fetching posts:', error); // Add this line to catch errors
      res.status(500).json({ message: error.message });
    }
    
  };
  