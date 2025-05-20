// Handle navbar scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const searchBar = document.querySelector('.navbar-searchbar');
    let isAnimating = false;
    const SCROLL_THRESHOLD = 30;
    const ANIMATION_DURATION = 500;
    let scrollTimer = null;
    let animationFrame = null ;

    // Debounce function to limit scroll event handling
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle scroll with requestAnimationFrame for smooth animation
    const handleScroll = debounce(() => {
        // Cancel any pending animation frame
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        // Use requestAnimationFrame for smooth animation
        animationFrame = requestAnimationFrame(() => {
            if (isAnimating) return;

            const currentScroll = window.pageYOffset;

            // Clear any existing scroll timer
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }

            // If we're at the top, remove the scrolled class
            if (currentScroll <= SCROLL_THRESHOLD) {
                if (navbar.classList.contains('scrolled')) {
                    isAnimating = true;
                    navbar.classList.remove('scrolled');
                    scrollTimer = setTimeout(() => {
                        isAnimating = false;
                    }, ANIMATION_DURATION);
                }
            } else {
                if (!navbar.classList.contains('scrolled')) {
                    isAnimating = true;
                    navbar.classList.add('scrolled');
                    scrollTimer = setTimeout(() => {
                        isAnimating = false;
                    }, ANIMATION_DURATION);
                }
            }
        });
    }, 16); // Roughly 60fps

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Handle initial state
    if (window.pageYOffset > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
    }

    // Cleanup function to prevent memory leaks
    return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
});
