// Handle tag button selections
document.querySelectorAll('.tag-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

// Handle form submission
document.getElementById('onboardingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        jobTitle: document.getElementById('jobTitle').value,
        department: document.getElementById('department').value,
        location: document.getElementById('location').value,
        
        // Technical skills
        skills: {
            languages: getSelectedTags('programmingLanguages'),
            frameworks: getSelectedTags('frameworks'),
            cloudDevOps: getSelectedTags('cloudDevOps'),
            databases: getSelectedTags('databases')
        },
        
        // Flatten all skills for easy access
        allSkills: [
            ...getSelectedTags('programmingLanguages'),
            ...getSelectedTags('frameworks'),
            ...getSelectedTags('cloudDevOps'),
            ...getSelectedTags('databases')
        ],
        
        // Collect selected interests by category
        interests: {
            sports: getSelectedTags('sportsInterests'),
            food: getSelectedTags('foodInterests'),
            arts: getSelectedTags('artsInterests'),
            outdoor: getSelectedTags('outdoorInterests'),
            games: getSelectedTags('gamesInterests'),
            learning: getSelectedTags('learningInterests'),
            professional: getSelectedTags('professionalInterests'),
            travel: getSelectedTags('travelInterests')
        },
        
        // Flatten all interests for easy access
        allInterests: [
            ...getSelectedTags('sportsInterests'),
            ...getSelectedTags('foodInterests'),
            ...getSelectedTags('artsInterests'),
            ...getSelectedTags('outdoorInterests'),
            ...getSelectedTags('gamesInterests'),
            ...getSelectedTags('learningInterests'),
            ...getSelectedTags('professionalInterests'),
            ...getSelectedTags('travelInterests')
        ],
        
        availability: document.getElementById('availability').value,
        
        // Bio
        bio: document.getElementById('bio').value
    };
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(formData));
    
    // Show success message
    showSuccessMessage();
    
    // Redirect to main app after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});

// Helper function to get selected tags
function getSelectedTags(groupId) {
    const group = document.getElementById(groupId);
    const selectedButtons = group.querySelectorAll('.tag-btn.selected');
    return Array.from(selectedButtons).map(btn => btn.dataset.value);
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px 50px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    
    message.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
        <h2 style="color: #1e3c72; margin-bottom: 10px;">Profile Created!</h2>
        <p style="color: #666;">Redirecting to IBMeetingU...</p>
    `;
    
    document.body.appendChild(message);
}

// Add validation for required fields
document.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ff6b6b';
        
        setTimeout(() => {
            this.style.borderColor = '';
        }, 3000);
    });
});

// Made with Bob
