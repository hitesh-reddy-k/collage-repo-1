function getToken() {
    return localStorage.getItem('token');
}

document.addEventListener('DOMContentLoaded', () => {
    showLoader();
    fetchLevelsAndPosts(); 
});

function showLoader() {
    document.querySelector('.loader').style.display = 'block';
}

function hideLoader() {
    document.querySelector('.loader').style.display = 'none';
    document.getElementById('posts-container').style.display = 'block';
}

async function fetchLevelsAndPosts(level = 'all') {
    try {
        const token = getToken();

        // Fetch levels
        const levelsResponse = await fetch('http://localhost:3000/question/levels', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!levelsResponse.ok) {
            throw new Error('Failed to fetch levels');
        }

        const levelsData = await levelsResponse.json();
        if (levelsData.success) {
            populateLevels(levelsData.levels); 
        }

        await fetchUserInfoAndPosts(level);
    } catch (error) {
        console.error('Error fetching levels or posts:', error);
    } finally {
        hideLoader();
    }
}

function populateLevels(levels) {
    const levelSelect = document.getElementById('level-select');
    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        levelSelect.appendChild(option);
    });
}

async function fetchUserInfoAndPosts(level = 'all') {
    try {
        const token = getToken();

        const userResponse = await fetch('http://localhost:3000/student/me', {
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
        console.log('User Data:', userData);  // Check the structure here

        // Check if userData contains the expected user object
        if (userData && userData.user) {
            // If _id exists, use it. Otherwise, store Username or fallback
            const userId = userData.user._id || userData.user.Username || 'default-user-id';
            localStorage.setItem('userId', userId);
        } else {
            throw new Error('User data is incomplete or not valid');
        }

        let url = 'http://localhost:3000/question/posts';
        if (level !== 'all') {
            url += `?level=${level}`;
        }

        // Fetch posts
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching posts');
        }

        const data = await response.json();
        displayPosts(data.data, userData.user);  // Adjusted to use the correct user object
        console.log(data);

    } catch (error) {
        console.error('Error fetching user info or posts:', error);
    } finally {
        hideLoader(); 
    }
}

// Function to display posts in the UI
function displayPosts(posts, user) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    posts.reverse().forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const postContent = `
            <p>${post.question}</p>
            <p>${post.img ? '<img src="data:' + post.img.contentType + ';base64,' + arrayBufferToBase64(post.img.data.data) + '" alt="Post Image">' : ''}</p>
            <div class="likes-comments">
                 <a href="solution_page.html?postId=${post._id}">View Solution</a>
            </div>
        `;

        postElement.innerHTML = postContent;
        postElement.dataset.id = post._id;
        postsContainer.prepend(postElement);
    });
}

function filterPosts() {
    const level = document.getElementById('level-select').value;
    fetchUserInfoAndPosts(level); 
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
