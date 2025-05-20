document.addEventListener('DOMContentLoaded', function() {
    const taxSwitch = document.getElementById('taxSwitch');
    const originalPrices = document.getElementsByClassName('original-price');
    const taxPrices = document.getElementsByClassName('tax-price');

    // Check if there's a saved preference
    const showTax = localStorage.getItem('showTax') === 'true';
    taxSwitch.checked = showTax;
    updatePriceDisplay(showTax);

    taxSwitch.addEventListener('change', function() {
        updatePriceDisplay(this.checked);
        // Save preference
        localStorage.setItem('showTax', this.checked);
    });

    function updatePriceDisplay(showTax) {
        Array.from(originalPrices).forEach(price => {
            price.style.display = showTax ? 'none' : 'inline';
        });
        Array.from(taxPrices).forEach(price => {
            price.style.display = showTax ? 'inline' : 'none';
        });
    }
});
