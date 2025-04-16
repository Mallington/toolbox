/**
 * Generate a placeholder image for apps
 * This creates a canvas element with the specified dimensions and fills it with a gradient background
 * @param {string} selector - CSS selector for the img element to replace with canvas
 * @param {string} text - Text to display on the image
 * @param {string} color1 - First gradient color
 * @param {string} color2 - Second gradient color
 */
function createPlaceholderImage(selector, text, color1, color2) {
    const imgElements = document.querySelectorAll(selector);
    
    imgElements.forEach(img => {
        // Skip SVG images that exist
        if (img.src.endsWith('.svg') && !img.hasAttribute('data-placeholder-needed')) {
            return;
        }
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        const width = img.width || 300;
        const height = img.height || 150;
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.borderRadius = getComputedStyle(img).borderRadius;
        
        // Get canvas context
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, color1 || '#3498db');
        gradient.addColorStop(1, color2 || '#2ecc71');
        
        // Fill background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text || 'Placeholder Image', width / 2, height / 2);
        
        // Replace image with canvas
        img.parentNode.replaceChild(canvas, img);
    });
}

// Apply to images when the DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // No need to check for SVG images - they exist now
}); 