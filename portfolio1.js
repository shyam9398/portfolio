// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        // Random colors
        const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
    }
}

// Animate skill bars on scroll
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillFill = entry.target.querySelector('.skill-fill');
                const width = skillFill.getAttribute('data-width');
                skillFill.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => observer.observe(item));
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Expose modal functions globally if needed (e.g., if used in inline HTML event handlers)
window.openModal = openModal;
window.closeModal = closeModal;

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            // const formData = new FormData(this); // Not strictly needed for simulation
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});


// Love counter functionality
function initializeLoveCounter() {
    const loveButton = document.getElementById('loveButton');
    const loveCount = document.getElementById('loveCount');
    const heartIcon = document.getElementById('heartIcon');
    
    if (!loveButton || !loveCount || !heartIcon) return; // Exit if elements are missing

    // Create unique device fingerprint
    function generateDeviceFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        // Create hash of fingerprint
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return 'device_' + Math.abs(hash);
    }
    
    const deviceId = generateDeviceFingerprint();
    const deviceLikedKey = 'portfolioDeviceLiked_' + deviceId;
    
    // Get stored love count from localStorage (shared across all devices)
    let currentCount = parseInt(localStorage.getItem('portfolioTotalLoveCount') || '0');
    loveCount.textContent = currentCount;
    
    // Check if THIS device has already liked
    const hasLiked = localStorage.getItem(deviceLikedKey) === 'true';
    
    if (hasLiked) {
        heartIcon.style.color = '#ff1744';
        heartIcon.classList.add('fas');
        heartIcon.classList.remove('far');
    } else {
        heartIcon.style.color = '#ffffff';
        heartIcon.classList.add('far');
        heartIcon.classList.remove('fas');
    }
    
    loveButton.addEventListener('click', function() {
        // Re-check if device has liked (in case of multiple tabs)
        const currentDeviceHasLiked = localStorage.getItem(deviceLikedKey) === 'true';
        
        if (!currentDeviceHasLiked) {
            // Device is liking for the first time
            currentCount++;
            loveCount.textContent = currentCount;
            
            // Store total count and mark this device as having liked
            localStorage.setItem('portfolioTotalLoveCount', currentCount.toString());
            localStorage.setItem(deviceLikedKey, 'true');
            
            // Change heart to filled and red
            heartIcon.style.color = '#ff1744';
            heartIcon.classList.add('fas');
            heartIcon.classList.remove('far');
            
            // Add animation effect
            heartIcon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                heartIcon.style.transform = 'scale(1)';
            }, 200);
            
            // Show thank you message
            const originalText = loveButton.innerHTML;
            loveButton.innerHTML = '<i class="fas fa-heart text-2xl" style="color: #ff1744;"></i><span class="text-lg font-bold">Thanks!</span>';
            setTimeout(() => {
                loveButton.innerHTML = `<i class="fas fa-heart text-2xl" style="color: #ff1744;"></i><span class="text-lg font-bold">${currentCount}</span>`;
            }, 1500);
        } else {
            // Device has already liked - show message
            const originalText = loveButton.innerHTML;
            loveButton.innerHTML = '<i class="fas fa-heart text-2xl" style="color: #ff1744;"></i><span class="text-sm">Already liked!</span>';
            setTimeout(() => {
                loveButton.innerHTML = `<i class="fas fa-heart text-2xl" style="color: #ff1744;"></i><span class="text-lg font-bold">${currentCount}</span>`;
            }, 1500);
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    animateSkills();
    setupSmoothScrolling();
    initializeLoveCounter();

    // Add some interactive button effects
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});