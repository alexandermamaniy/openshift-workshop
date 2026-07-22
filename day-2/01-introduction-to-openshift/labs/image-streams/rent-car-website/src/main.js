// Satos Rent-a-Car — main.js

// Mobile nav toggle
const menuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
  });
}

// Book button feedback
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Booking system coming soon!');
  });
});
