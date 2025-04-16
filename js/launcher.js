document.addEventListener('DOMContentLoaded', function() {
    // Create animated background elements
    const background = document.querySelector('.background');
    
    // Create animated circles
    function createAnimatedBackground() {
        for (let i = 0; i < 15; i++) {
            const span = document.createElement('span');
            
            // Random size between 20px and 100px
            const size = Math.random() * 80 + 20;
            span.style.width = `${size}px`;
            span.style.height = `${size}px`;
            
            // Random position
            span.style.top = `${Math.random() * 100}%`;
            span.style.left = `${Math.random() * 100}%`;
            
            // Random opacity
            span.style.opacity = Math.random() * 0.3 + 0.1;
            
            // Add animation with random duration
            const duration = Math.random() * 20 + 10;
            span.style.animation = `float ${duration}s ease-in-out infinite`;
            
            // Add keyframe animation through CSS
            const keyframes = `
            @keyframes float {
                0% {
                    transform: translate(0, 0);
                }
                50% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px);
                }
                100% {
                    transform: translate(0, 0);
                }
            }`;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            background.appendChild(span);
        }
    }
    
    createAnimatedBackground();
    
    // Add hover effects to app cards
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });
}); 