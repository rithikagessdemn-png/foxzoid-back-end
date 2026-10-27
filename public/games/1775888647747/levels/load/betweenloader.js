// Get the target page from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const targetPage = urlParams.get('redirect');

if (targetPage) {
    const minLoadTime = 3000;
    const startTime = Date.now();
    
    // Preload the target page in background
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = targetPage;
    document.body.appendChild(iframe);
    
    // Wait for minimum load time
    setTimeout(() => {
        window.location.replace(targetPage);
    }, minLoadTime);
}
