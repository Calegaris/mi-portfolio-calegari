document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox?.querySelector('.lightbox-content');
    const closeBtn = lightbox?.querySelector('.lightbox-close');

    function openLightbox(type, src) {
        if (!lightbox || !lightboxContent) return;
        lightboxContent.innerHTML = '';
        if (type === 'video') {
            const v = document.createElement('video');
            v.src = src;
            v.controls = true;
            v.autoplay = true;
            lightboxContent.appendChild(v);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            lightboxContent.appendChild(img);
        }
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        if (!lightbox || !lightboxContent) return;
        lightboxContent.innerHTML = '';
        lightbox.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.media-item').forEach(item => {
        item.addEventListener('click', () => {
            const video = item.classList.contains('video');
            const src = item.dataset.video || item.querySelector('img')?.src;
            openLightbox(video ? 'video' : 'image', src);
        });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

});