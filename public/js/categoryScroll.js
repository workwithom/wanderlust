document.addEventListener('DOMContentLoaded', function() {
    const categoryScroll = document.querySelector('.category-scroll');
    
    if (categoryScroll) {
        let isMouseDown = false;
        let startX;
        let scrollLeft;

        // Mouse wheel scrolling
        categoryScroll.addEventListener('wheel', function(e) {
            e.preventDefault();  // Prevent vertical scrolling
            
            // Scroll amount based on the wheel delta
            const scrollAmount = e.deltaY > 0 ? 100 : -100;
            categoryScroll.scrollLeft += scrollAmount;
        });

        // Mouse drag scrolling
        categoryScroll.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - categoryScroll.offsetLeft;
            scrollLeft = categoryScroll.scrollLeft;
        });

        categoryScroll.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });

        categoryScroll.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        categoryScroll.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - categoryScroll.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            categoryScroll.scrollLeft = scrollLeft - walk;
        });
    }
});
