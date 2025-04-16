document.addEventListener('DOMContentLoaded', function() {
    // Create animated background elements
    const background = document.querySelector('.background');
    
    // Create animated circles for background
    function createAnimatedBackground() {
        if (!background) return;
        
        // Clear any existing circles
        background.innerHTML = '';
        
        for (let i = 0; i < 12; i++) {
            const span = document.createElement('span');
            
            // Random size between 80px and 300px
            const size = Math.random() * 220 + 80;
            span.style.width = `${size}px`;
            span.style.height = `${size}px`;
            
            // Random position within viewport
            span.style.top = `${Math.random() * 100}%`;
            span.style.left = `${Math.random() * 100}%`;
            
            // Custom properties for animations
            span.style.setProperty('--duration', `${Math.random() * 30 + 20}s`);
            span.style.setProperty('--x', `${Math.random() * 50 - 25}px`);
            span.style.setProperty('--y', `${Math.random() * 50 - 25}px`);
            span.style.setProperty('--opacity', `${Math.random() * 0.3 + 0.1}`);
            
            // Set random animation
            const animations = ['pulse', 'float'];
            const randomAnim = animations[Math.floor(Math.random() * animations.length)];
            span.style.animation = `${randomAnim} var(--duration) ease-in-out infinite`;
            
            // Add to background
            background.appendChild(span);
        }
    }
    
    // Add futuristic UI elements to app cards
    function addHudElements() {
        const appCards = document.querySelectorAll('.app-card');
        
        appCards.forEach(card => {
            // Add HUD corner elements
            ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(position => {
                const corner = document.createElement('div');
                corner.className = `hud-corner hud-${position}`;
                card.appendChild(corner);
            });
            
            // For "Coming Soon" cards, add disabled styling
            if (card.querySelector('a[style*="pointer-events: none"]')) {
                card.classList.add('disabled-card');
            }
        });
    }
    
    // Add Stark-inspired tech design elements
    function addStarkTechElements() {
        // Add animated subtitle
        const subtitle = document.querySelector('p[style*="text-align: center"]');
        if (subtitle) {
            subtitle.className = 'page-subtitle';
        }
        
        // Add reactor glow to title
        const title = document.querySelector('h1');
        if (title) {
            title.classList.add('glow-text');
        }
        
        // Add timestamp to container as data attribute
        const container = document.querySelector('.container');
        if (container) {
            // Add timestamp in a futuristic format
            const now = new Date();
            const timestamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} / ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            container.setAttribute('data-timestamp', timestamp);
            
            // Add a small timestamp display to the bottom of the container
            const timestampDisplay = document.createElement('div');
            timestampDisplay.className = 'timestamp';
            timestampDisplay.style.cssText = 'position: absolute; bottom: 10px; right: 15px; font-size: 0.7rem; opacity: 0.6; color: var(--accent-primary);';
            timestampDisplay.textContent = timestamp;
            container.appendChild(timestampDisplay);
        }
    }
    
    // Initialize floating UI elements
    function initFloatingElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });
        
        // Select app cards and apply floating entrance
        const cards = document.querySelectorAll('.app-card');
        cards.forEach((card, index) => {
            // Set initial state
            card.style.transform = 'translateY(30px)';
            card.style.opacity = '0';
            card.style.transition = `all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) ${index * 0.1}s`;
            
            // Observe card
            observer.observe(card);
        });
    }
    
    // Add interactivity to app cards
    function enhanceCardInteractivity() {
        const appCards = document.querySelectorAll('.app-card');
        
        appCards.forEach(card => {
            // Add subtle tilt effect on mouse move
            card.addEventListener('mousemove', function(e) {
                if (window.innerWidth <= 768) return; // Skip on mobile
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within card
                const y = e.clientY - rect.top; // y position within card
                
                // Calculate tilt values (limited to small values for subtlety)
                const tiltX = ((y / rect.height) - 0.5) * 4; // tilt around X-axis
                const tiltY = ((x / rect.width) - 0.5) * -4; // tilt around Y-axis
                
                // Apply tilt and enhance shadow
                this.style.transform = `translateY(-8px) scale(1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                
                // Move highlight based on cursor position
                const highlight = this.querySelector('.highlight');
                if (highlight) {
                    highlight.style.opacity = '1';
                    highlight.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
            
            // Add highlight element for hover effect
            const highlight = document.createElement('div');
            highlight.className = 'highlight';
            highlight.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 1;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            card.appendChild(highlight);
            
            // Reset card style on mouse leave
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                const highlight = this.querySelector('.highlight');
                if (highlight) highlight.style.opacity = '0';
            });
        });
    }
    
    // Create background elements
    createAnimatedBackground();
    
    // Add HUD elements to cards
    addHudElements();
    
    // Add Stark-inspired tech design elements
    addStarkTechElements();
    
    // Initialize floating animations
    initFloatingElements();
    
    // Enhance card interactivity
    enhanceCardInteractivity();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Recreate background elements on resize for optimal positioning
        createAnimatedBackground();
    });
}); 