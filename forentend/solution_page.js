
function getToken() {
    return localStorage.getItem('token');
}


function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('postId');
}


document.addEventListener('DOMContentLoaded', () => {
    fetchPost();
});

// Function to fetch post data
async function fetchPost() {
    try {
        const postId = getPostIdFromUrl();
        const token = getToken();

        const response = await fetch(`https://collage-repo-1.vercel.app/question/posts/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        displayPost(data.data);
    } catch (error) {
        console.error('Error fetching post:', error);
    }
}

// Function to display the post data
function displayPost(post) {
    const problemStatementContainer = document.getElementById('problem-statement');
    const solutionCodeEditor = document.getElementById('solution-code');

    const username = post.user && post.user.Username ? post.user.Username : 'Unknown User';

    const problemContent = `
        <h2>${post.question}</h2>
        ${post.img ? '<img src="data:' + post.img.contentType + ';base64,' + arrayBufferToBase64(post.img.data.data) + '" alt="Post Image">' : ''}
        <p>Posted by: ${username}</p>
    `;

    problemStatementContainer.innerHTML = problemContent;
    solutionCodeEditor.value = post.solution;
}


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
