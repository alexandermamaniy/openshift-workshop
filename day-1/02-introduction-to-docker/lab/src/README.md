# IBMeetingU - Social Discovery for Professionals

A social discovery app that helps professionals make meaningful friendships and activity-based connections after work. Think of it as LinkedIn for friendships, not jobs—helping professionals expand their social circles, combat loneliness, and turn shared interests into real-world connections.

## Features

✨ **Core Functionality**
- 🃏 Swipe-based discovery of like-minded professionals nearby
- 🎯 Interest-based matching (sports, food, arts, travel, etc.)
- 💬 Chat with matches and plan activities
- 📍 Location-based connections
- 🔄 Undo last swipe
- ⭐ Super Connect for priority matches
- 📱 Fully responsive mobile-first design

✨ **Profile Features**
- Comprehensive interest categories:
  - 🏃 Sports & Fitness (tennis, golf, running, yoga, gym)
  - 🍽️ Food & Dining (coffee, lunch, cooking, wine tasting)
  - 🎨 Arts & Culture (museums, concerts, theater)
  - 🌳 Outdoor Activities (hiking, camping, beach)
  - 🎮 Games & Entertainment (board games, escape rooms)
  - 📚 Learning & Development (book clubs, workshops)
  - 💼 Professional & Networking (startups, investing)
  - ✈️ Travel & Adventure
- Activity suggestions for meetups
- Availability scheduling
- Common interest highlighting

✨ **Connection Features**
- Match notifications with shared interests
- Chat interface with conversation starters
- Activity-based meeting suggestions
- Message persistence

## How to Use

### First Time Setup:
1. Open `onboarding.html` in your browser
2. Fill out your profile:
   - Basic info (name, email, job, location)
   - Select your interests across 8 categories
   - Set your availability
   - Add a bio
3. Click "Get Started" to begin

### Finding Connections:
1. **Browse Profiles**: View professionals with shared interests
2. **See Common Ground**: Highlighted shared interests on each card
3. **Swipe to Connect**:
   - Swipe right (or click ❤️) to connect
   - Swipe left (or click ✖️) to pass
   - Click ⭐ for Super Connect
4. **View Details**: Click ℹ️ to see full profile

### After Matching:
1. **Get Notified**: See your shared interests
2. **Start Chatting**: Use conversation starters
3. **Plan Activities**: Suggest meetups based on common interests
4. **Build Friendships**: Turn online connections into real-world friendships

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Swipe logic and interactivity
└── README.md       # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, animations, gradients, transforms
- **Vanilla JavaScript**: ES6+ features, DOM manipulation

### Key Features Implementation

**Swipe Detection**
- Mouse and touch event support
- Threshold-based swipe recognition
- Smooth animations using CSS transforms

**Card Stack**
- Dynamic card generation
- Stacking effect with scale and offset
- Z-index management for proper layering

**State Management**
- History tracking for undo functionality
- Profile data management
- Card lifecycle handling

## Customization

### Adding Your Own Profiles

Edit the `profiles` array in `script.js`:

```javascript
const profiles = [
    {
        name: "Your Name",
        age: 25,
        image: "path/to/image.jpg",
        location: "2 miles away",
        bio: "Your bio here"
    },
    // Add more profiles...
];
```

### Styling

Modify `styles.css` to change:
- Color scheme (gradient backgrounds)
- Card dimensions
- Button styles
- Animations

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Demo Images

The app uses sample images from Unsplash. Replace with your own images for production use.

## Future Enhancements

- [ ] Profile detail view
- [ ] Match notifications
- [ ] Chat functionality
- [ ] Filter preferences
- [ ] Backend integration
- [ ] User authentication

## License

Free to use for learning and personal projects.

---

## The Problem We Solve

Many professionals struggle with:
- 😔 Loneliness and isolation after relocating
- 🤝 Difficulty making friends outside of work
- 🎯 Finding people with similar interests
- ⏰ Limited time to explore social opportunities
- 🌍 Expanding social circles in new cities

## Our Solution

IBMeetingU makes it easy to:
- ✅ Discover professionals with shared interests nearby
- ✅ Connect based on activities you actually enjoy
- ✅ Turn matches into real-world meetups
- ✅ Build meaningful friendships, not just professional networks
- ✅ Combat loneliness through activity-based connections

**Note**: This is a social discovery platform for professionals. It demonstrates modern web development techniques including responsive design, touch interactions, and smooth animations.