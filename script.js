document.addEventListener('DOMContentLoaded', () => {
    const linkCards = document.querySelectorAll('.link-card');

    linkCards.forEach(card => {
        const url = card.dataset.url;
        const title = card.dataset.title;

        if (!url || !title) return;

        // Set the link's destination
        card.href = url;
        card.target = "_blank"; // Open in new tab
        card.rel = "noopener noreferrer";

        // --- Generate the card's inner HTML ---
        card.innerHTML = `
            <div class="card-preview"></div>
            <div class="card-info">
                <img class="card-favicon" alt="favicon">
                <div class="card-text">
                    <p class="card-title">${title}</p>
                    <p class="card-url"></p>
                </div>
            </div>
        `;

        const previewEl = card.querySelector('.card-preview');
        const faviconEl = card.querySelector('.card-favicon');
        const urlEl = card.querySelector('.card-url');

        try {
            const hostname = new URL(url).hostname;
            urlEl.textContent = hostname;

            // --- Fetch Favicon using Google's free service ---
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
            faviconEl.src = faviconUrl;

            // --- Fetch Screenshot using WordPress's free service ---
            // Note: This won't work for localhost or sites that block crawlers.
            if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
                 previewEl.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none" stroke="%23555" stroke-width="2"><path d="M100 300 L300 300 L350 250 L450 350 L500 300 L700 300" /><rect x="50" y="50" width="700" height="500" rx="20" ry="20" stroke-width="4"/></svg>')`;
                 previewEl.classList.add('loaded'); // Mark as loaded to hide spinner
            } else {
                const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=400&h=300`;
                
                // Create a temporary image to detect when it's loaded
                const img = new Image();
                img.onload = () => {
                    previewEl.style.backgroundImage = `url(${screenshotUrl})`;
                    previewEl.classList.add('loaded'); // Mark as loaded
                };
                img.onerror = () => {
                    // Handle cases where the screenshot fails
                    previewEl.classList.add('loaded'); // Hide spinner even on error
                };
                img.src = screenshotUrl;
            }
        } catch (error) {
            // Handle invalid URLs gracefully
            urlEl.textContent = 'Invalid URL';
            previewEl.classList.add('loaded');
            card.href = '#';
        }
    });
});