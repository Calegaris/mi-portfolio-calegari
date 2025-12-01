document.addEventListener('DOMContentLoaded', () => {
    // Certificate filtering
    const emitterSelect = document.getElementById('emitter-select');
    const areaSelect = document.getElementById('area-select');
    const cards = document.querySelectorAll('.certificate-card');

    function filterCertificates() {
        const emitter = emitterSelect.value;
        const area = areaSelect.value;

        cards.forEach(card => {
            const matchEmitter = emitter === 'all' || card.dataset.emitter === emitter;
            const matchArea = area === 'all' || card.dataset.area === area;
            card.style.display = (matchEmitter && matchArea) ? 'block' : 'none';
        });
    }

    if (emitterSelect && areaSelect) {
        emitterSelect.addEventListener('change', filterCertificates);
        areaSelect.addEventListener('change', filterCertificates);
    }

    // Contact form submission
    const form = document.getElementById('contacto-form');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!email) {
                alert("Por favor, ingresá un correo electrónico válido.");
                form.email.focus();
                return;
            }
            if (!message) {
                alert("Por favor, escribí un mensaje.");
                form.message.focus();
                return;
            }

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' },
                });

                if (response.ok) {
                    form.style.display = 'none';
                    mensajeError.style.display = 'none';
                    mensajeExito.style.display = 'block';
                } else {
                    throw new Error('Error en la respuesta');
                }
            } catch (error) {
                mensajeExito.style.display = 'none';
                mensajeError.style.display = 'block';
            }
        });
    }

    // Mobile menu toggle
    const toggleBtn = document.getElementById('menu-toggle');
    const nav = document.querySelector('header nav');

    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    // Certificate modal (click image -> modal with zoom + pan)
    (function () {
        const modal = document.getElementById('cert-modal');
        const modalImg = document.getElementById('cert-modal-img');
        const closeButtons = modal ? modal.querySelectorAll('[data-close]') : [];
        let scale = 1;
        let minScale = 1;
        let maxScale = 4;
        let startX = 0;
        let startY = 0;
        let translateX = 0;
        let translateY = 0;
        let isPanning = false;

        function openModal(src, alt) {
            if (!modal) return;
            modal.classList.add('open');
            document.body.classList.add('modal-open');
            modal.setAttribute('aria-hidden', 'false');
            modalImg.src = src;
            modalImg.alt = alt || 'Certificado ampliado';
            // reset transform state
            scale = 1;
            translateX = 0;
            translateY = 0;
            applyTransform();
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.remove('open');
            document.body.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
            modalImg.src = '';
        }

        function applyTransform() {
            modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }

        // find certificate images and wire click
        const certImgs = document.querySelectorAll('.certificate-card img');
        certImgs.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                openModal(e.currentTarget.src, e.currentTarget.alt);
            });
        });

        // close on backdrop or close button
        closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
        if (modal) {
            modal.addEventListener('click', (e) => {
                // if user clicked the backdrop (not the img or controls) => close
                const content = modal.querySelector('.cert-modal-content');
                if (!content.contains(e.target)) closeModal();
            });
        }

        // wheel to zoom (while hovered over modal content)
        if (modal) {
            modal.querySelector('.cert-modal-inner').addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = -Math.sign(e.deltaY) * 0.15;
                const oldScale = scale;
                scale = Math.min(maxScale, Math.max(minScale, scale + delta));
                // zoom towards cursor (basic)
                const rect = modalImg.getBoundingClientRect();
                const offsetX = (e.clientX - rect.left) - rect.width / 2;
                const offsetY = (e.clientY - rect.top) - rect.height / 2;
                // adjust translate to give focus feeling
                translateX += offsetX * (1 - scale / oldScale) || 0;
                translateY += offsetY * (1 - scale / oldScale) || 0;
                applyTransform();
            }, { passive: false });

            // pointer-based panning
            const inner = modal.querySelector('.cert-modal-inner');
            // allow panning immediately when the modal opens (no need to double-click)
            inner.addEventListener('pointerdown', (e) => {
                isPanning = true;
                startX = e.clientX;
                startY = e.clientY;
                try { inner.setPointerCapture(e.pointerId); } catch (_) { }
                inner.style.cursor = 'grabbing';
                e.preventDefault();
            });

            inner.addEventListener('pointermove', (e) => {
                if (!isPanning) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                startX = e.clientX;
                startY = e.clientY;
                translateX += dx;
                translateY += dy;
                applyTransform();
            });

            function stopPan(e) {
                if (!isPanning) return;
                isPanning = false;
                try { inner.releasePointerCapture && inner.releasePointerCapture(e.pointerId); } catch (_) { }
                inner.style.cursor = 'grab';
            }

            inner.addEventListener('pointerup', stopPan);
            inner.addEventListener('pointercancel', stopPan);
            inner.addEventListener('pointerleave', stopPan);

            // double click to toggle zoom (desktop)
            inner.addEventListener('dblclick', (e) => {
                if (scale === 1) {
                    // zoom into point on double click
                    scale = 2.2;
                    const rect = modalImg.getBoundingClientRect();
                    const offsetX = (e.clientX - rect.left) - rect.width / 2;
                    const offsetY = (e.clientY - rect.top) - rect.height / 2;
                    translateX += offsetX * -0.5;
                    translateY += offsetY * -0.5;
                } else {
                    scale = 1;
                    translateX = 0;
                    translateY = 0;
                }
                applyTransform();
            });
        }
    })();
});