// Function to retrieve token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Function to retrieve userId from localStorage
function getUserId() {
    return localStorage.getItem('userId');
}

// Function to be executed when DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    await fetchUserInfoAndPosts();
    const newPostForm = document.getElementById('newPostForm');
    if (newPostForm) {
        newPostForm.addEventListener('submit', createPost);
    }
});

// Function to fetch user info and posts
async function fetchUserInfoAndPosts() {
    try {
        const token = getToken();

        // Fetch user info
        const userResponse = await fetch('https://collage-repo-1.vercel.app/student/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user details');
        }

        const userData = await userResponse.json();
        console.log('User Data:', userData);

        localStorage.setItem('userId', userData.users._id);

        // Fetch posts
        const response = await fetch('https://collage-repo-1.vercel.app/question/posts', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching posts');
        }

        const data = await response.json();
        displayPosts(data.data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching user info or posts:', error);
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        // Check if the user object and Username exist
        const username = post.user && post.user.Username? post.user.Username : 'Unknown User';

        const postContent = `
            <div class="post-header">
                <img src="no-profile-picture-icon-12.jpg" alt="${username}'s profile picture" class="profile-picture">
                <a href="#" onclick="openUserProfile('${post.user? post.user._id : '#'}')"><span class="username">${username}</span></a>
            </div>
            <h3>${post.Post}</h3>
            <p>${post.img? '<img src="data:' + post.img.contentType + ';base64,' + arrayBufferToBase64(post.img.data.data) + '" alt="Post Image">' : ''}</p>
            <div class="likes-comments">
                <span>💬 <a href="#" onclick="toggleComments('${post._id}')">${post.likesAndComments.length} Comments</a></span>
            </div>
            <div class="comments" id="comments-${post._id}" style="display: none;">
                ${post.likesAndComments.map(comment => `
                    <div class="comment">
                        <p><strong>${comment.user && comment.user.Username? comment.user.Username : 'Unknown User'}:</strong> ${comment.comment}</p>
                    </div>
                `).join('')}
                <div class="add-comment">
                    <input type="text" placeholder="Add a comment..." id="comment-input-${post._id}">
                    <button onclick="submitComment('${post._id}')">Add comment</button>
                </div>
            </div>
        `;

        postElement.innerHTML = postContent;
        postElement.dataset.id = post._id; // Add post ID as a data attribute
        postsContainer.appendChild(postElement);
    });
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'none'? 'block' : 'none';
    }
}

async function submitComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput? commentInput.value : '';

    if (!commentText.trim()) {
        alert('Comment cannot be empty.');
        return;
    }

    try {
        const response = await fetch(`https://collage-repo-1.vercel.app/question/posts/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ comment: commentText })
        });

        if (response.ok) {
            fetchUserInfoAndPosts(); // Refresh posts to show the new comment
        } else {
            console.error('Error submitting comment:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Function to create a new post
async function createPost(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('question', document.getElementById('postContent').value);  // Updated 'Post' to 'question'
    formData.append('level', document.getElementById('postLevel').value);
    formData.append('solution', document.getElementById('postSolution').value);

    const postImage = document.getElementById('postImage').files[0];
    if (postImage) {
        formData.append('img', postImage);
    }

    formData.append('user', getUserId());

    for (const [key, value] of formData.entries()) {
        console.log(key + ':', value);
    }

    try {
        const response = await fetch('https://collage-repo-1.vercel.app/question/create-post', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`  // Content-Type should not be set when using FormData
            },
            body: formData
        });

        if (response.ok) {
            document.getElementById('newPostForm').reset();
            fetchUserInfoAndPosts();
        } else {
            const errorData = await response.json();
            console.error('Error creating post:', errorData.message || response.statusText);
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
}
