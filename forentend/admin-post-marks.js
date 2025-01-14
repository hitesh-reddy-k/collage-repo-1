function getToken() {
    return localStorage.getItem('token');
  }



document.addEventListener('DOMContentLoaded', function() {
    const studentSearch = document.getElementById('student-search');
    const suggestions = document.getElementById('suggestions');
    const postMarksButton = document.getElementById('post-marks-button');
    const marksImageInput = document.getElementById('marks-image');
    const semesterInput = document.getElementById('semester');
    const reserverIdInput = document.getElementById('reserver-id');
  
    async function fetchRollNumbers(keyword) {
      try {
        const token = getToken();
        const response = await fetch(`https://collage-repo-1.vercel.app/rollnumbers?keyword=${keyword}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch roll numbers');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching roll numbers:', error);
        return [];
      }
    }
  
    function showRollNumberSuggestions(rollNumbers) {
      suggestions.innerHTML = '';
      if (rollNumbers.length > 0) {
        rollNumbers.forEach(rollNumber => {
          const suggestionItem = document.createElement('div');
          suggestionItem.className = 'suggestion-item';
          suggestionItem.textContent = rollNumber.RollNumber;
          suggestionItem.addEventListener('click', () => {
            studentSearch.value = rollNumber.RollNumber;
            suggestions.innerHTML = '';
  
            if (rollNumber._id) {
              reserverIdInput.value = rollNumber._id;
            } else {
              console.error('Invalid roll number data:', rollNumber);
              alert('Invalid roll number data. Please try again.');
            }
          });
          suggestions.appendChild(suggestionItem);
        });
      }
    }
  
    studentSearch.addEventListener('input', async (e) => {
      const query = e.target.value;
      if (query.length > 0) {
        const rollNumbers = await fetchRollNumbers(query);
        showRollNumberSuggestions(rollNumbers);
      } else {
        suggestions.innerHTML = '';
      }
    });
  
    postMarksButton.addEventListener('click', async () => {
      const rollNumber = studentSearch.value;
      const file = marksImageInput.files[0];
      const semester = semesterInput.value;
      const reserverId = reserverIdInput.value;
  
      console.log('RollNumber:', rollNumber);
      console.log('Semester:', semester);
      console.log('ReserverId:', reserverId);
  
      if (rollNumber && file && semester && reserverId) {
        const formData = new FormData();
        formData.append('rollNumber', rollNumber);
        formData.append('semester', semester);
        formData.append('reserversId', reserverId);
        formData.append('img', file);
  
        const token = getToken();
  
        try {
          const response = await fetch('https://collage-repo-1.vercel.app/marks/uploadmarks', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });
  
          if (response.ok) {
            alert(`Marks image for roll number ${rollNumber} posted successfully!`);
            studentSearch.value = '';
            marksImageInput.value = '';
            semesterInput.value = '';
            reserverIdInput.value = ''; // Clear reserver ID input
            alert("sucessfully posted")
          } else {
            const errorData = await response.json();
            console.log('Error response:', response);
            console.log('Error data:', errorData);
  
            if (errorData.error === 'Roll number, semester, and reserver ID are required') {
              alert('Please enter a roll number, semester, and reserver ID.');
              console.log(error)
            } else {
              alert('Failed to post marks image: ' + errorData.error);
            }
          }
        } catch (error) {
          console.error('Error posting marks image:', error);
        }
      } else {
        alert('Please enter a roll number, semester, and marks image.');
      }
    });
  });
  