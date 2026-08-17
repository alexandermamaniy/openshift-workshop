// Professional profiles with technical skills and corporate tone
const profiles = [
    {
        name: "Abdul",
        age: 28,
        image: "images/abdul.png",
        jobTitle: "Senior Software Engineer",
        department: "Engineering",
        location: "Dublin, Ireland",
        distance: "1 mile away",
        bio: "Full-stack developer who debugs code by day and life by night. Passionate about clean code, scalable systems, and finding the perfect coffee-to-code ratio. Always up for technical discussions or a tennis match.",
        skills: {
            languages: ["Python", "JavaScript", "Go"],
            frameworks: ["Django", "React", "Node.js"],
            cloudDevOps: ["AWS", "Docker", "Kubernetes"],
            databases: ["PostgreSQL", "Redis"]
        },
        allSkills: ["Python", "JavaScript", "Go", "Django", "React", "Node.js", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis"],
        interests: {
            sports: ["Tennis", "Running", "Gym"],
            food: ["Coffee Chat", "Lunch Meetup"],
            professional: ["Startups", "Investing", "Networking Event"],
            learning: ["Workshop", "Skill Share"],
            outdoor: ["Hiking"]
        },
        allInterests: ["Tennis", "Running", "Gym", "Coffee Chat", "Lunch Meetup", "Startups", "Investing", "Networking Event", "Workshop", "Skill Share", "Hiking"],
        availability: "Weekday Evenings & Weekends",
        lookingFor: ["Tennis Partner", "Tech Meetups", "Coffee & Code Discussions"],
        funFact: "I once spent 6 hours debugging only to find a missing semicolon. Now I use TypeScript."
    },
    {
        name: "Alex",
        age: 26,
        image: "images/alex.png",
        jobTitle: "Product Manager",
        department: "Product",
        location: "Dublin, Ireland",
        distance: "2 miles away",
        bio: "Product manager who speaks both engineer and business fluently. Turning user stories into reality while maintaining my sanity with good coffee and better company. Let's discuss product strategy or explore the city!",
        skills: {
            languages: ["JavaScript", "Python", "SQL"],
            frameworks: ["React", "Node.js"],
            cloudDevOps: ["AWS", "CI/CD"],
            databases: ["PostgreSQL", "MongoDB"]
        },
        allSkills: ["JavaScript", "Python", "SQL", "React", "Node.js", "AWS", "CI/CD", "PostgreSQL", "MongoDB"],
        interests: {
            food: ["Coffee Chat", "Lunch Meetup", "Brunch", "Wine Tasting"],
            arts: ["Museum Visit", "Live Music", "Photography Walk"],
            professional: ["Startups", "Networking Event", "Happy Hour"],
            learning: ["Book Club", "Workshop"],
            travel: ["City Exploration", "Weekend Getaways"]
        },
        allInterests: ["Coffee Chat", "Lunch Meetup", "Brunch", "Wine Tasting", "Museum Visit", "Live Music", "Photography Walk", "Startups", "Networking Event", "Happy Hour", "Book Club", "Workshop", "City Exploration", "Weekend Getaways"],
        availability: "Lunch Hours & Weekends",
        lookingFor: ["Coffee Connections", "Product Discussions", "Weekend Explorers"],
        funFact: "My Jira board is color-coded. Yes, I'm that person."
    },
    {
        name: "Pushpak",
        age: 27,
        image: "images/pushpak.png",
        jobTitle: "Data Scientist",
        department: "AI/ML",
        location: "Dublin, Ireland",
        distance: "3 miles away",
        bio: "Data scientist who finds patterns in everything, including the best workout routines and board game strategies. When I'm not training models, I'm training at the gym. Let's optimize our fitness and friendship algorithms together!",
        skills: {
            languages: ["Python", "R", "SQL"],
            frameworks: ["TensorFlow", "PyTorch", "FastAPI"],
            cloudDevOps: ["AWS", "Docker", "Kubernetes"],
            databases: ["PostgreSQL", "MongoDB", "Elasticsearch"]
        },
        allSkills: ["Python", "R", "SQL", "TensorFlow", "PyTorch", "FastAPI", "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Elasticsearch"],
        interests: {
            sports: ["Gym", "Cycling", "Swimming", "Basketball"],
            games: ["Board Games", "Escape Room", "Trivia Night"],
            outdoor: ["Hiking", "Camping"],
            food: ["Cooking Class", "Brunch"],
            learning: ["Workshop", "Skill Share"],
            professional: ["Networking Event"]
        },
        allInterests: ["Gym", "Cycling", "Swimming", "Basketball", "Board Games", "Escape Room", "Trivia Night", "Hiking", "Camping", "Cooking Class", "Brunch", "Workshop", "Skill Share", "Networking Event"],
        availability: "Weekday Evenings",
        lookingFor: ["Gym Buddy", "Board Game Nights", "ML Enthusiasts"],
        funFact: "My neural network predicted I'd enjoy hiking. It was right. AI knows best."
    },
    {
        name: "Winnie",
        age: 25,
        image: "images/winnie.png",
        jobTitle: "UX Designer & Frontend Developer",
        department: "Design & Engineering",
        location: "Dublin, Ireland",
        distance: "4 miles away",
        bio: "Designer who codes and developer who designs. Obsessed with pixel-perfect UIs and user-centered experiences. When not pushing pixels, I'm pushing myself in yoga or exploring art galleries. Let's create beautiful connections!",
        skills: {
            languages: ["JavaScript", "TypeScript", "HTML", "CSS"],
            frameworks: ["React", "Vue.js", "Tailwind CSS"],
            cloudDevOps: ["AWS", "CI/CD"],
            databases: ["PostgreSQL", "MongoDB"]
        },
        allSkills: ["JavaScript", "TypeScript", "HTML", "CSS", "React", "Vue.js", "Tailwind CSS", "AWS", "CI/CD", "PostgreSQL", "MongoDB"],
        interests: {
            sports: ["Yoga", "Running", "Hiking"],
            arts: ["Art Gallery", "Theater", "Concert", "Photography Walk"],
            food: ["Coffee Chat", "Brunch", "Cooking Class"],
            outdoor: ["Park Walk", "Picnic"],
            learning: ["Book Club", "Language Exchange", "Workshop"],
            professional: ["Networking Event"],
            travel: ["Travel", "City Exploration"]
        },
        allInterests: ["Yoga", "Running", "Hiking", "Art Gallery", "Theater", "Concert", "Photography Walk", "Coffee Chat", "Brunch", "Cooking Class", "Park Walk", "Picnic", "Book Club", "Language Exchange", "Workshop", "Networking Event", "Travel", "City Exploration"],
        availability: "Flexible",
        lookingFor: ["Yoga Partner", "Design Discussions", "Art Gallery Visits"],
        funFact: "I have 47 shades of blue in my Figma library. Each one has a purpose."
    }
];

class TinderApp {
    constructor() {
        this.cardStack = document.getElementById('cardStack');
        this.currentIndex = 0;
        this.cards = [];
        this.history = [];
        this.matches = JSON.parse(localStorage.getItem('matches')) || [];
        this.userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;
        
        // Button references
        this.nopeBtn = document.getElementById('nopeBtn');
        this.likeBtn = document.getElementById('likeBtn');
        this.starBtn = document.getElementById('starBtn');
        this.boostBtn = document.getElementById('boostBtn');
        this.rewindBtn = document.getElementById('rewindBtn');
        
        // Filter button
        this.filterBtn = document.getElementById('filterBtn');
        this.matchesBtn = document.getElementById('matchesBtn');
        
        this.init();
    }
    
    init() {
        // Check if user has completed onboarding
        if (!this.userProfile) {
            this.showOnboardingPrompt();
            return;
        }
        
        this.loadCards();
        this.attachEventListeners();
        this.updateMatchCount();
    }
    
    showOnboardingPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'onboarding-prompt';
        prompt.innerHTML = `
            <div class="prompt-content">
                <h2>Welcome to IBMeetingU! 👋</h2>
                <p>Connect with professionals who share your interests and skills</p>
                <button onclick="window.location.href='onboarding.html'" class="prompt-btn">
                    Create Profile 🚀
                </button>
            </div>
        `;
        this.cardStack.appendChild(prompt);
    }
    
    loadCards() {
        // Clear existing cards
        this.cardStack.innerHTML = '';
        this.cards = [];
        
        // Filter profiles based on user preferences (if any)
        let filteredProfiles = this.filterProfiles(profiles);
        
        // Create cards in reverse order (last card on top)
        for (let i = filteredProfiles.length - 1; i >= 0; i--) {
            const card = this.createCard(filteredProfiles[i], i);
            this.cardStack.appendChild(card);
            this.cards.unshift(card);
        }
        
        // Show empty state if no cards
        if (filteredProfiles.length === 0) {
            this.showEmptyState();
        }
    }
    
    filterProfiles(profiles) {
        // Basic filtering - can be enhanced with user preferences
        return profiles.filter(profile => {
            // Don't show user's own profile
            if (this.userProfile && profile.name === this.userProfile.name) {
                return false;
            }
            // Don't show already matched profiles
            if (this.matches.some(match => match.name === profile.name)) {
                return false;
            }
            return true;
        });
    }
    
    createCard(profile, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.profile = JSON.stringify(profile);
        
        // Apply stacking effect
        const offset = Math.min(index * 3, 9);
        card.style.transform = `translateY(${offset}px) scale(${1 - index * 0.02})`;
        card.style.zIndex = profiles.length - index;
        
        // Create skill badges HTML (top 3 skills)
        const skillBadges = profile.allSkills.slice(0, 3).map(skill => 
            `<span class="skill-badge">${skill}</span>`
        ).join('');
        
        // Create interest badges (top 2 interests)
        const interestBadges = profile.allInterests.slice(0, 2).map(interest => 
            `<span class="interest-badge">${interest}</span>`
        ).join('');
        
        // Find common skills and interests with user
        const commonSkills = this.findCommonSkills(profile);
        const commonInterests = this.findCommonInterests(profile);
        const totalCommon = commonSkills.length + commonInterests.length;
        
        const commonText = totalCommon > 0 
            ? `<div class="common-interests">🎯 ${totalCommon} thing${totalCommon > 1 ? 's' : ''} in common</div>`
            : '';
        
        card.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}" class="card-image">
            <div class="card-info">
                <div class="card-header">
                    <div>
                        <span class="card-name">${profile.name}</span>
                        <span class="card-age">${profile.age}</span>
                    </div>
                    <div class="card-job">${profile.jobTitle}</div>
                </div>
                
                <div class="card-details">
                    <div class="card-detail">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        ${profile.distance}
                    </div>
                    
                    ${commonText}
                    
                    <div class="card-section-title">💻 Skills</div>
                    <div class="card-skills">
                        ${skillBadges}
                    </div>
                    
                    <div class="card-section-title">🎯 Interests</div>
                    <div class="card-interests">
                        ${interestBadges}
                    </div>
                    
                    <div class="card-bio">${profile.bio}</div>
                </div>
            </div>
            <div class="swipe-indicator like">CONNECT</div>
            <div class="swipe-indicator nope">PASS</div>
            
            <button class="info-btn" onclick="event.stopPropagation();">ℹ️</button>
        `;
        
        // Add click handler for info button
        const infoBtn = card.querySelector('.info-btn');
        infoBtn.addEventListener('click', () => this.showProfileDetails(profile));
        
        this.attachCardListeners(card);
        return card;
    }
    
    findCommonSkills(profile) {
        if (!this.userProfile || !this.userProfile.allSkills) return [];
        
        return profile.allSkills.filter(skill => 
            this.userProfile.allSkills.includes(skill)
        );
    }
    
    findCommonInterests(profile) {
        if (!this.userProfile || !this.userProfile.allInterests) return [];
        
        return profile.allInterests.filter(interest => 
            this.userProfile.allInterests.includes(interest)
        );
    }
    
    showProfileDetails(profile) {
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        
        // Find common skills and interests
        const commonSkills = this.findCommonSkills(profile);
        const commonInterests = this.findCommonInterests(profile);
        
        const commonSection = (commonSkills.length > 0 || commonInterests.length > 0) ? `
            <div class="modal-section highlight">
                <h3>🎯 You Both Have</h3>
                ${commonSkills.length > 0 ? `
                    <h4>Skills</h4>
                    <div class="modal-tags">
                        ${commonSkills.map(s => `<span class="modal-tag common">${s}</span>`).join('')}
                    </div>
                ` : ''}
                ${commonInterests.length > 0 ? `
                    <h4>Interests</h4>
                    <div class="modal-tags">
                        ${commonInterests.map(i => `<span class="modal-tag common">${i}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        ` : '';
        
        // Organize skills by category
        const skillsSection = `
            <div class="modal-section">
                <h3>💻 Technical Skills</h3>
                ${profile.skills.languages.length > 0 ? `
                    <h4>Languages</h4>
                    <div class="modal-tags">
                        ${profile.skills.languages.map(s => `<span class="modal-tag">${s}</span>`).join('')}
                    </div>
                ` : ''}
                ${profile.skills.frameworks.length > 0 ? `
                    <h4>Frameworks</h4>
                    <div class="modal-tags">
                        ${profile.skills.frameworks.map(s => `<span class="modal-tag">${s}</span>`).join('')}
                    </div>
                ` : ''}
                ${profile.skills.cloudDevOps.length > 0 ? `
                    <h4>Cloud & DevOps</h4>
                    <div class="modal-tags">
                        ${profile.skills.cloudDevOps.map(s => `<span class="modal-tag">${s}</span>`).join('')}
                    </div>
                ` : ''}
                ${profile.skills.databases.length > 0 ? `
                    <h4>Databases</h4>
                    <div class="modal-tags">
                        ${profile.skills.databases.map(s => `<span class="modal-tag">${s}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        // Organize interests by category
        const interestCategories = Object.entries(profile.interests)
            .filter(([_, interests]) => interests.length > 0)
            .map(([category, interests]) => {
                const categoryNames = {
                    sports: '🏃 Sports & Fitness',
                    food: '🍽️ Food & Dining',
                    arts: '🎨 Arts & Culture',
                    outdoor: '🌳 Outdoor Activities',
                    games: '🎮 Games & Entertainment',
                    learning: '📚 Learning & Development',
                    professional: '💼 Professional & Networking',
                    travel: '✈️ Travel & Adventure'
                };
                
                return `
                    <div class="interest-category">
                        <h4>${categoryNames[category]}</h4>
                        <div class="modal-tags">
                            ${interests.map(i => `<span class="modal-tag">${i}</span>`).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <img src="${profile.image}" alt="${profile.name}" class="modal-image">
                    <div class="modal-title">
                        <h2>${profile.name}, ${profile.age}</h2>
                        <p>${profile.jobTitle}</p>
                        <p>${profile.department}</p>
                        <p class="modal-location">📍 ${profile.location}</p>
                    </div>
                </div>
                
                <div class="modal-body">
                    <div class="modal-section">
                        <h3>About</h3>
                        <p>${profile.bio}</p>
                    </div>
                    
                    ${commonSection}
                    
                    ${skillsSection}
                    
                    <div class="modal-section">
                        <h3>🎯 Interests & Activities</h3>
                        ${interestCategories}
                    </div>
                    
                    <div class="modal-section">
                        <h3>🔍 Looking For</h3>
                        <div class="modal-tags">
                            ${profile.lookingFor.map(item => `<span class="modal-tag">${item}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>⏰ Availability</h3>
                        <p class="availability">${profile.availability}</p>
                    </div>
                    
                    <div class="modal-section fun-fact">
                        <h3>😄 Fun Fact</h3>
                        <p>${profile.funFact}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    attachCardListeners(card) {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;
        
        const onStart = (e) => {
            if (card !== this.cards[0]) return;
            
            isDragging = true;
            const touch = e.type.includes('touch') ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            card.style.transition = 'none';
        };
        
        const onMove = (e) => {
            if (!isDragging) return;
            
            const touch = e.type.includes('touch') ? e.touches[0] : e;
            currentX = touch.clientX - startX;
            currentY = touch.clientY - startY;
            
            const rotation = currentX / 20;
            card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
            
            // Show swipe indicators
            if (currentX > 50) {
                card.classList.add('swiping-right');
                card.classList.remove('swiping-left');
            } else if (currentX < -50) {
                card.classList.add('swiping-left');
                card.classList.remove('swiping-right');
            } else {
                card.classList.remove('swiping-right', 'swiping-left');
            }
        };
        
        const onEnd = () => {
            if (!isDragging) return;
            
            isDragging = false;
            card.style.transition = 'transform 0.3s ease';
            
            const threshold = 100;
            
            if (Math.abs(currentX) > threshold) {
                // Swipe detected
                const direction = currentX > 0 ? 'right' : 'left';
                this.swipeCard(card, direction);
            } else {
                // Return to center
                card.style.transform = '';
                card.classList.remove('swiping-right', 'swiping-left');
            }
            
            currentX = 0;
            currentY = 0;
        };
        
        // Mouse events
        card.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        
        // Touch events
        card.addEventListener('touchstart', onStart);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', onEnd);
    }
    
    swipeCard(card, direction) {
        const moveX = direction === 'right' ? 1000 : -1000;
        const rotation = direction === 'right' ? 45 : -45;
        
        card.classList.add('removing');
        card.style.transform = `translate(${moveX}px, -100px) rotate(${rotation}deg)`;
        card.style.opacity = '0';
        
        // Get profile data
        const profile = JSON.parse(card.dataset.profile);
        
        // If swiped right, add to matches
        if (direction === 'right') {
            this.addMatch(profile);
        }
        
        // Save to history
        this.history.push({
            card: card,
            direction: direction,
            profile: profile
        });
        
        setTimeout(() => {
            card.remove();
            this.cards.shift();
            
            // Update remaining cards
            this.updateCardStack();
            
            // Check if all cards are gone
            if (this.cards.length === 0) {
                this.showEmptyState();
            }
        }, 500);
    }
    
    addMatch(profile) {
        this.matches.push(profile);
        localStorage.setItem('matches', JSON.stringify(this.matches));
        this.updateMatchCount();
        this.showMatchNotification(profile);
    }
    
    showMatchNotification(profile) {
        const commonSkills = this.findCommonSkills(profile);
        const commonInterests = this.findCommonInterests(profile);
        const allCommon = [...commonSkills, ...commonInterests];
        
        const commonText = allCommon.length > 0 ? `
            <p class="match-common">You both have: ${allCommon.slice(0, 3).join(', ')}</p>
        ` : '';
        
        const notification = document.createElement('div');
        notification.className = 'match-notification';
        notification.innerHTML = `
            <div class="match-content">
                <h2>It's a Match! 🎉</h2>
                <div class="match-images">
                    <img src="${this.userProfile?.image || 'images/default.png'}" alt="You">
                    <div class="match-heart">❤️</div>
                    <img src="${profile.image}" alt="${profile.name}">
                </div>
                <p>You and ${profile.name} want to connect!</p>
                ${commonText}
                <div class="match-actions">
                    <button class="match-btn secondary" onclick="this.closest('.match-notification').remove()">
                        Keep Swiping
                    </button>
                    <button class="match-btn primary" onclick="window.location.href='matches.html'">
                        Send Message
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
    }
    
    updateMatchCount() {
        const matchesBtn = document.getElementById('matchesBtn');
        if (matchesBtn && this.matches.length > 0) {
            matchesBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="#2196F3" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                <span class="match-badge">${this.matches.length}</span>
            `;
        }
    }
    
    updateCardStack() {
        this.cards.forEach((card, index) => {
            const offset = Math.min(index * 3, 9);
            card.style.transform = `translateY(${offset}px) scale(${1 - index * 0.02})`;
            card.style.zIndex = this.cards.length - index;
        });
    }
    
    attachEventListeners() {
        this.nopeBtn.addEventListener('click', () => {
            if (this.cards.length > 0) {
                this.swipeCard(this.cards[0], 'left');
            }
        });
        
        this.likeBtn.addEventListener('click', () => {
            if (this.cards.length > 0) {
                this.swipeCard(this.cards[0], 'right');
            }
        });
        
        this.starBtn.addEventListener('click', () => {
            if (this.cards.length > 0) {
                this.showNotification('Super Connect! ⭐');
                this.swipeCard(this.cards[0], 'right');
            }
        });
        
        this.boostBtn.addEventListener('click', () => {
            this.showNotification('Profile Boosted! 🚀');
        });
        
        this.rewindBtn.addEventListener('click', () => {
            this.rewindLastSwipe();
        });
        
        // Filter button
        if (this.filterBtn) {
            this.filterBtn.addEventListener('click', () => {
                this.showFilterModal();
            });
        }
        
        // Matches button
        if (this.matchesBtn) {
            this.matchesBtn.addEventListener('click', () => {
                window.location.href = 'matches.html';
            });
        }
    }
    
    showFilterModal() {
        // Placeholder for filter functionality
        this.showNotification('Filter feature coming soon! 🔍');
    }
    
    rewindLastSwipe() {
        if (this.history.length === 0) {
            this.showNotification('No more actions to undo');
            return;
        }
        
        const lastAction = this.history.pop();
        
        // If it was a match, remove from matches
        if (lastAction.direction === 'right') {
            this.matches = this.matches.filter(m => m.name !== lastAction.profile.name);
            localStorage.setItem('matches', JSON.stringify(this.matches));
            this.updateMatchCount();
        }
        
        const card = this.createCard(lastAction.profile, 0);
        
        // Insert at the beginning
        this.cardStack.insertBefore(card, this.cardStack.firstChild);
        this.cards.unshift(card);
        
        // Animate in
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            this.updateCardStack();
        }, 10);
        
        // Remove empty state if present
        const emptyState = this.cardStack.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }
    
    showEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <h2>That's everyone nearby! 🎉</h2>
            <p>Check back later for new connections</p>
            <button class="empty-btn" onclick="window.location.reload()">
                Refresh
            </button>
        `;
        this.cardStack.appendChild(emptyState);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TinderApp();
});

// Made with Bob
