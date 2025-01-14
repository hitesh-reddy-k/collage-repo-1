function getToken() {
    return localStorage.getItem('token');
}

function getUserId() {
    return localStorage.getItem('userId');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUserInfoAndPosts();
});

async function fetchUserInfoAndPosts() {
    showLoader();
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

        // Correcting the _id access
        if (userData.user && userData.user._id) {
            localStorage.setItem('userId', userData.user._id);
        } else {
            console.error('User data is missing _id');
        }

        // Fetch posts
        const response = await fetch('https://collage-repo-1.vercel.app/community/posts', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching posts');
        }

        const data = await response.json();
        data.data.reverse();
        displayPosts(data.data, userData.user);
    } catch (error) {
        console.error('Error fetching user info or posts:', error);
    } finally {
        hideLoader();
    }
}

function displayPosts(posts, user) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        // Ensure post.user exists and has the necessary properties before using it
        if (!post.user || !post.user.Username) {
            console.error('Invalid post data:', post);
            return;  // Skip the post if the user data is missing
        }

        const userId = localStorage.getItem('userId');
        const isLikedByUser = post.likedBy.includes(userId);
        const likeButtonClass = isLikedByUser ? 'liked' : '';

        const postElement = document.createElement('div');
        postElement.classList.add('post');

        postsContainer.insertBefore(postElement, postsContainer.firstChild);
        const postContent = `
            <div class="post-header">
                <img src="no-profile-picture-icon-12.jpg" alt="${post.user.Username}'s profile picture" class="profile-picture">
                <a href="#" onclick="openUserProfile('${post.user._id}')"><span class="username">${post.user.Username}</span></a>
            </div>
            <p>${post.Post}</p>
            <p>${post.img ? '<img src="data:' + post.img.contentType + ';base64,' + arrayBufferToBase64(post.img.data.data) + '" alt="Post Image">' : ''}</p>
            <div class="likes-comments">
                <span><button class="like-button ${likeButtonClass}" onclick="toggleLike('${post._id}')">👍</button> ${post.likedBy.length} Likes</span>
                <span>💬 <a href="#" onclick="toggleComments('${post._id}')">${post.likesAndComments.length} Comments</a></span>
            </div>
            <div class="comments" id="comments-${post._id}" style="display: none;">
                ${post.likesAndComments.map(comment => `
                    <div class="comment">
                        <div class="comment-header">
                            <img src="no-profile-picture-icon-12.jpg" alt="${comment.user && comment.user.Username ? comment.user.Username : 'Unknown User'}'s profile picture" class="profile-picture">
                            <strong class="username" onclick="openUserProfile('${comment.user._id}')">${comment.user && comment.user.Username ? comment.user.Username : 'Unknown User'}</strong>
                        </div>
                        <p>${comment.comment}</p>
                    </div>
                `).join('')}
                <div class="add-comment">
                    <img src="no-profile-picture-icon-12.jpg" alt="${user.Username}'s profile picture" class="profile-picture">
                    <input type="text" placeholder="Add a comment..." id="comment-input-${post._id}">
                    <button onclick="submitComment('${post._id}')">Add comment</button>
                </div>
            </div>
        `;

        postElement.innerHTML = postContent;
        postElement.dataset.id = post._id;
        postsContainer.appendChild(postElement);
    });
}


// function openUserProfile(userId) {
//     // Save the post user's id (not the logged-in user's id)
//     localStorage.setItem('profileUserId', userId);
//     window.location.href = 'profile.html';  // Redirect to the profile page
// }

async function toggleLike(postId) {
    showLoader();
    try {
        const token = getToken();
        const response = await fetch(`https://collage-repo-1.vercel.app/community/post/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Error liking post');
            return;
        }

        const updatedPost = await response.json();
        updatePostLikesUI(postId, updatedPost.likedBy.length, updatedPost.likedBy.includes(localStorage.getItem('userId')));
    } catch (error) {
        console.error('Error liking post:', error);
    } finally {
        hideLoader();
    }
}

function updatePostLikesUI(postId, likeCount, isLikedByUser) {
    const likeButton = document.querySelector(`.post[data-id="${postId}"] .like-button`);
    likeButton.classList.toggle('liked', isLikedByUser);
    likeButton.nextSibling.textContent = `${likeCount} Likes`;
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

async function submitComment(postId) {
    showLoader();
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value.trim();
    const userId = localStorage.getItem('userId');

    if (commentText && userId) {
        try {
            const token = getToken();
            const response = await fetch(`https://collage-repo-1.vercel.app/community/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ comment: commentText })
            });

            if (!response.ok) {
                throw new Error('Error submitting comment');
            }

            commentInput.value = '';
            fetchUserInfoAndPosts(); // Refresh posts to show the new comment
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            hideLoader();
        }
    } else {
        console.error('Comment text or userId is missing');
        hideLoader();
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

// Loader display functions
function showLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'none';
}
