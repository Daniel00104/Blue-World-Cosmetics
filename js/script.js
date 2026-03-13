//Script Styling for Navbar
const header = document.querySelector('header');
const hero = document.querySelector('.hero-section, .about-hero-section, .career-hero-section, .sustainability-hero-section, .our-business-hero-section, .foundation-hero-section, .cement-hero-section, .sugar-hero-section, .salt-hero-section, .fertilizer-hero-section, .infrastructure-hero-section, .tomato-hero-section, .rice-hero-section, .automotive-hero-section, .refinery-hero-section, .training-hero-section, .estate-hero-section, .mining-hero-section, .petrochemicals-hero-section, .logistics-hero-section, .maritime-hero-section, .investor-hero-section, .media-hero-section');

if (hero) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > hero.offsetHeight - 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// Hero Carousel Functionality
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlide = 0;
const totalSlides = slides.length;

// Function to show specific slide
function showSlide(index) {
  // Remove active class from all slides and dots
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Add active class to current slide and dot
  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

// Next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

// Previous slide
function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Event listeners for buttons
if (nextBtn) {
  nextBtn.addEventListener('click', nextSlide);
}

if (prevBtn) {
  prevBtn.addEventListener('click', prevSlide);
}

// Event listeners for dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// Auto-play carousel (optional - every 5 seconds)
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pause auto-play on hover
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
  carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });

  carouselContainer.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  });
}


const wrapper = document.querySelector(".video-wrapper");

if (wrapper) {
  const thumbnail = wrapper.querySelector(".thumbnail");
  const videoContainer = wrapper.querySelector(".video-container");
  const iframe = document.getElementById("videoFrame");
  const closeBtn = wrapper.querySelector(".close-btn");

  if (thumbnail && videoContainer && iframe && closeBtn) {
    thumbnail.addEventListener("click", () => {
      // Show video, hide thumbnail
      thumbnail.style.display = "none";
      videoContainer.style.display = "block";
      // Set iframe src with autoplay
      iframe.src = "https://www.youtube.com/embed/2r0EgK9uu0I?autoplay=1";
    });

    closeBtn.addEventListener("click", () => {
      // Hide video, show thumbnail
      videoContainer.style.display = "none";
      thumbnail.style.display = "block";
      // Stop video
      iframe.src = "";
    });
  }
}

