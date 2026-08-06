// Load matches from localStorage
let matches = JSON.parse(localStorage.getItem('matches')) || [];
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;
let currentChat = null;
let messages = JSON.parse(localStorage.getItem('messages')) || {};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadMatches();
    setupChatHandlers();
});

function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    const emptyMatches = document.getElementById('emptyMatches');
    const matchCount = document.getElementById('matchCount');
    
    if (matches.length === 0) {
        matchesList.style.display = 'none';
        emptyMatches.style.display = 'block';
        matchCount.textContent = '0 matches';
        return;
    }
    
    matchesList.style.display = 'flex';
    emptyMatches.style.display = 'none';
    matchCount.textContent = `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`;
    
    matchesList.innerHTML = '';
    
    matches.forEach((match, index) => {
        const matchCard = createMatchCard(match, index);
        matchesList.appendChild(matchCard);
    });
}

function createMatchCard(match, index) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    // Get last message if exists
    const chatKey = getChatKey(match.name);
    const lastMessage = messages[chatKey] && messages[chatKey].length > 0 
        ? messages[chatKey][messages[chatKey].length - 1].text 
        : 'Start a conversation!';
    
    card.innerHTML = `
        <img src="${match.image}" alt="${match.name}" class="match-avatar">
        <div class="match-info">
            <div class="match-name">${match.name}</div>
            <div class="match-title">${match.jobTitle}</div>
            <div class="match-preview">${lastMessage}</div>
        </div>
        <div class="match-badge">New</div>
    `;
    
    card.addEventListener('click', () => openChat(match));
    
    return card;
}

function openChat(match) {
    currentChat = match;
    const chatModal = document.getElementById('chatModal');
    const chatProfileImage = document.getElementById('chatProfileImage');
    const chatProfileName = document.getElementById('chatProfileName');
    const chatProfileTitle = document.getElementById('chatProfileTitle');
    
    chatProfileImage.src = match.image;
    chatProfileImage.alt = match.name;
    chatProfileName.textContent = match.name;
    chatProfileTitle.textContent = match.jobTitle;
    
    chatModal.style.display = 'flex';
    
    loadMessages(match);
    
    // Show conversation starters if no messages
    const chatKey = getChatKey(match.name);
    if (!messages[chatKey] || messages[chatKey].length === 0) {
        showConversationStarters(match);
    }
}

function loadMessages(match) {
    const chatMessages = document.getElementById('chatMessages');
    const chatKey = getChatKey(match.name);
    const chatHistory = messages[chatKey] || [];
    
    chatMessages.innerHTML = '';
    
    chatHistory.forEach(msg => {
        const messageEl = createMessageElement(msg);
        chatMessages.appendChild(messageEl);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessageElement(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    const avatar = msg.sender === 'user' 
        ? (userProfile?.image || 'images/default.png')
        : currentChat.image;
    
    messageDiv.innerHTML = `
        <img src="${avatar}" alt="" class="message-avatar">
        <div class="message-content">
            <div class="message-text">${msg.text}</div>
            <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
    `;
    
    return messageDiv;
}

function showConversationStarters(match) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Get user's interests
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    const userInterests = userProfile.allInterests || [];
    
    // Find common interests
    const commonInterests = match.allInterests.filter(interest =>
        userInterests.includes(interest)
    );
    
    // Create personalized starters based on common interests
    const starters = [];
    
    if (commonInterests.length > 0) {
        starters.push(`Hi ${match.name}! I saw we both enjoy ${commonInterests[0]}. Want to meet up?`);
        if (commonInterests.length > 1) {
            starters.push(`Hey! We should definitely try ${commonInterests[1]} together sometime!`);
        }
    }
    
    // Add activity-specific starters
    if (match.lookingFor && match.lookingFor.length > 0) {
        starters.push(`Hi! I'd love to join you for ${match.lookingFor[0].toLowerCase()}!`);
    }
    
    // Add general starters
    starters.push(`Hey ${match.name}! Would you like to grab coffee and chat about our interests?`);
    starters.push(`Hi! I'm always looking for new activity partners. Want to connect?`);
    
    // Limit to 4 starters
    const finalStarters = starters.slice(0, 4);
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'message-suggestions';
    suggestionsDiv.innerHTML = '<div style="width: 100%; color: #666; font-size: 13px; margin-bottom: 10px;">Suggested conversation starters:</div>';
    
    finalStarters.forEach(starter => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = starter;
        btn.addEventListener('click', () => {
            document.getElementById('chatInput').value = starter;
            suggestionsDiv.remove();
        });
        suggestionsDiv.appendChild(btn);
    });
    
    chatMessages.appendChild(suggestionsDiv);
}

function setupChatHandlers() {
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatInput = document.getElementById('chatInput');
    
    closeChatBtn.addEventListener('click', () => {
        document.getElementById('chatModal').style.display = 'none';
        currentChat = null;
    });
    
    sendMessageBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const messageText = chatInput.value.trim();
    
    if (!messageText || !currentChat) return;
    
    const message = {
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString()
    };
    
    // Save message
    const chatKey = getChatKey(currentChat.name);
    if (!messages[chatKey]) {
        messages[chatKey] = [];
    }
    messages[chatKey].push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    
    // Display message
    const chatMessages = document.getElementById('chatMessages');
    const messageEl = createMessageElement(message);
    chatMessages.appendChild(messageEl);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate response after a delay
    setTimeout(() => {
        simulateResponse();
    }, 1500);
}

function simulateResponse() {
    if (!currentChat) return;
    
    const responses = [
        "That sounds great! I'd love to connect.",
        "Thanks for reaching out! When would be a good time for you?",
        "I'm definitely interested! Let's schedule something.",
        "Absolutely! I'm free this week if you are.",
        "Great idea! I've been wanting to learn more about that too.",
        "Perfect timing! I was just thinking about this.",
        "I'd be happy to help! What specifically are you interested in?",
        "Thanks! I'm excited to collaborate on this."
    ];
    
    const response = {
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'other',
        timestamp: new Date().toISOString()
    };
    
    const chatKey = getChatKey(currentChat.name);
    messages[chatKey].push(response);
    localStorage.setItem('messages', JSON.stringify(messages));
    
    const chatMessages = document.getElementById('chatMessages');
    const messageEl = createMessageElement(response);
    chatMessages.appendChild(messageEl);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getChatKey(name) {
    return `chat_${name.toLowerCase().replace(/\s+/g, '_')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }
    
    // Show time
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Made with Bob
