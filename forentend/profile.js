async function getUserProfile() {
  // Retrieve userId and token from localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Check if the userId exists
  if (!userId) {
      console.error('User ID is missing');
      alert('Error: User ID is missing. Please log in again.');
      window.location.href = 'login.html'; // Redirect to login page
      return;
  }

  try {
      // Fetch user profile data from the server
      const response = await fetch(`http://localhost:3000/community/student/${userId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include authorization token
          },
      });

      // Check if the response is successful
      if (!response.ok) {
          throw new Error('Failed to fetch user profile. Please try again.');
      }

      // Parse response JSON
      const userData = await response.json();
      console.log('User Data:', userData);

      // Display the user profile
      displayUserProfile(userData);
  } catch (error) {
      // Handle errors
      console.error('Error fetching user profile:', error);
      alert('Error fetching user profile. Please try again later.');
  }
}

// Function to display the user profile
function displayUserProfile(userData) {
  const profileContainer = document.getElementById('profile-container');

  // Update profileContainer with user data
  profileContainer.innerHTML = `
      <div class="card">
          <button class="mail">
              <svg
                  class="lucide lucide-mail"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <rect rx="2" y="4" x="2" height="16" width="20"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
          </button>
          <div class="profile-pic">
              <img id="profile-image" src="${userData.profileImage || 'no-profile-picture-icon-12.jpg'}" alt="Profile Image">
          </div>
          <div class="bottom">
              <div class="content">
                  <span class="name">${userData.Username || 'Unknown User'}</span>
                  <span class="about-me">Roll-Number: ${userData.RollNumber || 'Undefined'}</span>
                  <span class="description">Description: ${userData.description || 'No description available.'}</span>
              </div>
              <div class="bottom-bottom">
                  <div class="social-links-container">
                      <a href="${userData.linkedIn || '#'}" target="_blank">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                              <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                          </svg>
                      </a>
                  </div>
                  <button class="button">Contact Me</button>
              </div>
          </div>
      </div>
  `;
}

// Handle 'Go Back' functionality
function goBack() {
  window.history.back();
}

// Call getUserProfile when the DOM is loaded
document.addEventListener('DOMContentLoaded', getUserProfile);
