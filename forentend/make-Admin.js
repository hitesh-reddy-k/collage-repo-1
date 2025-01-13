async function fetchRollNumbers(keyword) {
    const response = await fetch(`http://localhost:3000/marks/rollnumbers?keyword=${keyword}`);
    const rollNumbers = await response.json();
    return rollNumbers;
  }

  function showSuggestions(rollNumbers) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    rollNumbers.forEach(rollNumber => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = rollNumber.RollNumber;
      div.onclick = () => selectRollNumber(rollNumber._id, rollNumber.RollNumber);
      suggestionsContainer.appendChild(div);
    });
  }

  function selectRollNumber(userId, rollNumber) {
    document.getElementById('userId').value = userId;
    document.getElementById('rollNumber').value = rollNumber;
    document.getElementById('suggestions').innerHTML = '';
  }

  async function onRollNumberInput(event) {
    const keyword = event.target.value;
    if (keyword.length >= 2) {
      const rollNumbers = await fetchRollNumbers(keyword);
      showSuggestions(rollNumbers);
    } else {
      document.getElementById('suggestions').innerHTML = '';
    }
  }

  async function makeAdmin() {
    const userId = document.getElementById('userId').value;

    const response = await fetch(`http://localhost:3000/student/make-admin/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
      }
    });

    const result = await response.json();
    alert(result.message);
  }