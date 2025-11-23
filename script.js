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

// Download functionality
document.getElementById('download-btn').addEventListener('click', function() {
    const pdfUrl = 'assets/menu-da-venzi-2025.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'menu-da-venzi-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Facebook link - Update with actual URL
document.getElementById('facebook-btn').addEventListener('click', function(e) {
    // Uncomment and update with actual Facebook URL
    // e.preventDefault();
    // window.open('https://www.facebook.com/yourpage', '_blank');
    
    // For now, prevent default to show it's not configured
    e.preventDefault();
    console.log('Facebook link - Update with actual URL');
});

// Instagram link - Update with actual URL
document.getElementById('instagram-btn').addEventListener('click', function(e) {
    // Uncomment and update with actual Instagram URL
    // e.preventDefault();
    // window.open('https://www.instagram.com/yourpage', '_blank');
    
    // For now, prevent default to show it's not configured
    e.preventDefault();
    console.log('Instagram link - Update with actual URL');
});

// Website button is disabled (locked)
document.getElementById('website-btn').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Website link is locked');
});

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

