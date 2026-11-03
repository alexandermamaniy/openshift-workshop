// Cocold Coffee Shop — main.js

// Mobile nav toggle
const menuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
  });
}

// Order / Book buttons feedback
document.querySelectorAll('.btn-primary, .btn-book').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Ordering system coming soon!');
  });
});
