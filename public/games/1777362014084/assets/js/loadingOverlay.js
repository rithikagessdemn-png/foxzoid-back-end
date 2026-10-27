// Loading Overlay Utility for Slow Operations
// Shows a loading screen during heavy operations like asset loading, network requests, etc.

function showLoading() {
  // Check if overlay already exists
  if (document.getElementById('loading-overlay')) return;
  
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    flex-direction: column;
  `;
  
  // Create body-background div
  const bodyBg = document.createElement('div');
  bodyBg.className = 'body-background';
  bodyBg.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  `;
  
  // Add logo image
  const logoImg = document.createElement('img');
  logoImg.src = '../../assets/loading_page/JULY2020.jpg';
  logoImg.alt = 'Game Logo';
  logoImg.style.cssText = `
    width: 200px;
    height: auto;
    margin-bottom: 20px;
  `;
  
  // Add Lottie animation
  const lottieElement = document.createElement('dotlottie-wc');
  lottieElement.setAttribute('src', 'https://lottie.host/d55136e2-48ab-41d2-b7ca-9b4f14a5ec36/nfe0FPq1v0.lottie');
  lottieElement.setAttribute('autoplay', '');
  lottieElement.setAttribute('loop', '');
  lottieElement.style.cssText = 'width: 300px; height: 300px;';
  
  // Create loader outline
  const loaderOutline = document.createElement('div');
  loaderOutline.className = 'loader-outline';
  loaderOutline.style.cssText = `
    width: 80%;
    max-width: 300px;
    height: 20px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    overflow: hidden;
    margin-top: 20px;
  `;
  
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'green';
  progressBar.style.cssText = `
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #22c55e);
    border-radius: 10px;
    animation: pulse 1.5s ease-in-out infinite;
  `;
  
  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;
  
  // Assemble the overlay
  loaderOutline.appendChild(progressBar);
  bodyBg.appendChild(logoImg);
  bodyBg.appendChild(lottieElement);
  bodyBg.appendChild(loaderOutline);
  overlay.appendChild(bodyBg);
  overlay.appendChild(style);
  
  // Add to document
  document.body.appendChild(overlay);
  
  // Load Lottie library if not already loaded
  if (!window.customElements.get('dotlottie-wc')) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js';
    document.head.appendChild(script);
  }
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showLoading, hideLoading };
}
