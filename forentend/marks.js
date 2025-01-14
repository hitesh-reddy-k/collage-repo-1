function getToken() {
    // This function retrieves a token from local storage (implement your logic)
    return localStorage.getItem('token');
  }
  
  function arrayBufferToBase64(buffer) {
    // This function converts an array buffer to a base64 string (helper function)
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  
  document.addEventListener('DOMContentLoaded', async function() {
    console.log("Marks page loaded");
    var loader = document.getElementById("loader");
    var memoContainer = document.getElementById("memoContainer");
  
    try {
      loader.style.display = 'block';
  
      const token = getToken();
      if (!token) {
        window.location.href = 'login.html';
        return;
      }
  
      // Fetch user details
      const response = await fetch('https://collage-repo-1.vercel.app/student/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
  
      const userData = await response.json();
      console.log('User Data:', userData);
  
      // Fetch marks data
      const marksResponse = await fetch('https://collage-repo-1.vercel.app//marks/marks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
  
      if (!marksResponse.ok) {
        throw new Error('Failed to fetch marks');
      }
  
      // Clone the response before calling json() to avoid the error
      const marksData = await marksResponse.clone().json();
      console.log('Marks Data:', marksData);
  
      if (marksData.success && marksData.data.length > 0) {
        marksData.data.forEach(memo => {
          // Check for existence of img property and valid semester
          if (memo.img && memo.semester !== undefined) {
            if (memo.img.data) {
              const base64String = arrayBufferToBase64(memo.img.data.data);
  
              const img = document.createElement("img");
              img.src = `data:${memo.img.contentType};base64,${base64String}`;
              img.alt = `${userData.users.Username} - Semester ${memo.semester}`;
              img.classList.add('memo-image');
  
              const memoCard = document.createElement('div');
              memoCard.classList.add('memo');
  
              const memoTitle = document.createElement('h2');
              memoTitle.textContent = `Semester ${memo.semester}`;
  
              memoCard.appendChild(memoTitle);
              memoCard.appendChild(img);
  
              memoContainer.appendChild(memoCard);
            } else {
              console.warn('Image data not found for semester', memo.semester);
            }
          } else {
            console.warn('Missing img property or undefined semester for memo object:', memo);
          }
        });
      } else {
        const noMarksMessage = document.createElement('h1');
        noMarksMessage.textContent = 'Your semester exams marks are not yet available.';
        memoContainer.appendChild(noMarksMessage);
      }
  
      loader.style.display = 'none';
  
    } catch (error) {
      console.error('Error fetching marks:', error);
      const errorMessage = document.createElement('h1');
      errorMessage.textContent = 'Failed to fetch semester exams data. Please try again later.';
      memoContainer.appendChild(errorMessage);
      loader.style.display = 'none'; 
    }
  });
  