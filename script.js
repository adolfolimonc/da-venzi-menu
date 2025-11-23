// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Load and render PDF
const pdfUrl = 'assets/menu-da-venzi-2025.pdf';
const container = document.querySelector('.pdf-container');

let pdfDoc = null;
let scale = 1.5;

function renderAllPages() {
    if (!pdfDoc) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Render all pages
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        pdfDoc.getPage(pageNum).then(function(page) {
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.className = 'pdf-page';
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            page.render(renderContext).promise.then(function() {
                container.appendChild(canvas);
            });
        });
    }
}

// Responsive scaling - fill viewport width
function adjustScale() {
    if (pdfDoc) {
        // Use viewport width for mobile-first approach
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        pdfDoc.getPage(1).then(function(page) {
            const viewport = page.getViewport({ scale: 1 });
            // Calculate scale to fill viewport width exactly
            scale = viewportWidth / viewport.width;
            renderAllPages();
        });
    }
}

// Load PDF
pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
    pdfDoc = pdf;
    // Wait for DOM to be ready and then adjust scale
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', adjustScale);
    } else {
        adjustScale();
    }
}).catch(function(error) {
    console.error('Error loading PDF:', error);
    container.innerHTML = '<p style="padding: 20px; text-align: center;">Error loading PDF. <a href="' + pdfUrl + '">Download the PDF</a>.</p>';
});

// Handle resize and orientation changes
window.addEventListener('resize', function() {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(adjustScale, 250);
});

// Handle orientation change on mobile
window.addEventListener('orientationchange', function() {
    setTimeout(adjustScale, 100);
});

// Function to open app or fallback to web
function openInAppOrWeb(appUrl, webUrl) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Try to open app using a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.src = appUrl;
        document.body.appendChild(iframe);
        
        // Check if page becomes hidden (app opened)
        let appOpened = false;
        const checkVisibility = function() {
            if (document.hidden) {
                appOpened = true;
            }
        };
        document.addEventListener('visibilitychange', checkVisibility);
        
        // Fallback: open web URL after delay if app didn't open
        setTimeout(function() {
            document.body.removeChild(iframe);
            document.removeEventListener('visibilitychange', checkVisibility);
            
            // If page is still visible after 1 second, app likely didn't open
            if (!document.hidden) {
                // Open web URL in new window
                window.open(webUrl, '_blank', 'noopener,noreferrer');
            }
        }, 1000);
    } else {
        // Desktop - just open web URL
        window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
}

// Wait for DOM to be ready before attaching event listeners
function initButtons() {
    // Download functionality
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfUrl = 'assets/menu-da-venzi-2025.pdf';
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'menu-da-venzi-2025.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Facebook and Instagram - try to open in mobile app first
    const facebookBtn = document.getElementById('facebook-btn');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openInAppOrWeb(facebookBtn.dataset.appUrl, facebookBtn.dataset.webUrl);
        });
    }

    const instagramBtn = document.getElementById('instagram-btn');
    if (instagramBtn) {
        instagramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openInAppOrWeb(instagramBtn.dataset.appUrl, instagramBtn.dataset.webUrl);
        });
    }
    
    // Website button is disabled (locked)
    const websiteBtn = document.getElementById('website-btn');
    if (websiteBtn) {
        websiteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Website link is locked');
        });
    }
}

// Initialize buttons when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtons);
} else {
    initButtons();
}

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

