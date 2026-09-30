// Подсветка активной страницы
document.addEventListener("DOMContentLoaded", function() {
    let currentPage = window.location.pathname.split("/").pop();
    
    if (currentPage === "" || currentPage === "nnov-site/" || currentPage === "nnov-site") {
        currentPage = "index.html";
    }
    
    let links = document.querySelectorAll("nav a");
    
    links.forEach(link => {
        let href = link.getAttribute("href");
        
        if (href === currentPage) {
            link.style.backgroundColor = "#ffd700";
            link.style.color = "#0d5c2e";
        }
    });
    
    console.log("Сайт загружен!");
});

// ===== СЛАЙДЕР НА ГЛАВНОЙ =====
if (document.querySelector('.slider')) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const slider = document.querySelector('.slider');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    setInterval(() => {
        nextSlide();
    }, 5000);
}// ===== МОДАЛЬНЫЕ ОКНА ДЛЯ ДОСТОПРИМЕЧАТЕЛЬНОСТЕЙ =====
const attractionItems = document.querySelectorAll('.attraction-item');
const modals = document.querySelectorAll('.modal:not(.gallery-modal)');
const closeButtons = document.querySelectorAll('.modal-close:not(.gallery-close)');

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

if (attractionItems.length > 0) {
    attractionItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalId = item.getAttribute('data-modal');
            openModal(modalId);
        });
    });
}

if (closeButtons.length > 0) {
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
}

if (modals.length > 0) {
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                closeModal(modal);
            }
        });
        if (galleryModal && galleryModal.style.display === 'block') {
            closeGalleryModal();
        }
    }
});

// ===== ГАЛЕРЕЯ С ЛУПОЙ И СТРЕЛКАМИ =====
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryModal = document.getElementById('gallery-modal');
const galleryModalImg = document.getElementById('gallery-modal-img');
const galleryModalCaption = document.getElementById('gallery-modal-caption');
const galleryClose = document.querySelector('.gallery-close');
const prevGalleryBtn = document.querySelector('.prev-gallery');
const nextGalleryBtn = document.querySelector('.next-gallery');
const modalDotsContainer = document.querySelector('.gallery-modal-dots');

let currentImageIndex = 0;
let galleryImagesArray = [];

if (galleryItems.length > 0) {
    // Собираем все изображения из галереи
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('p').innerText;
        galleryImagesArray.push({
            src: img.src,
            alt: img.alt,
            caption: caption
        });
        
        // Добавляем точки
        if (modalDotsContainer) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-dot-index', index);
            dot.addEventListener('click', () => {
                openGalleryModal(index);
            });
            modalDotsContainer.appendChild(dot);
        }
        
        // Открытие по клику
        item.addEventListener('click', () => {
            openGalleryModal(index);
        });
    });
}

function openGalleryModal(index) {
    if (galleryImagesArray.length === 0) return;
    currentImageIndex = index;
    const image = galleryImagesArray[currentImageIndex];
    if (galleryModalImg) galleryModalImg.src = image.src;
    if (galleryModalCaption) galleryModalCaption.textContent = image.caption;
    if (galleryModal) galleryModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    updateModalDots();
}

function closeGalleryModal() {
    if (galleryModal) galleryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function nextGalleryImage() {
    if (galleryImagesArray.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % galleryImagesArray.length;
    const image = galleryImagesArray[currentImageIndex];
    if (galleryModalImg) galleryModalImg.src = image.src;
    if (galleryModalCaption) galleryModalCaption.textContent = image.caption;
    updateModalDots();
}

function prevGalleryImage() {
    if (galleryImagesArray.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + galleryImagesArray.length) % galleryImagesArray.length;
    const image = galleryImagesArray[currentImageIndex];
    if (galleryModalImg) galleryModalImg.src = image.src;
    if (galleryModalCaption) galleryModalCaption.textContent = image.caption;
    updateModalDots();
}

function updateModalDots() {
    if (!modalDotsContainer) return;
    const dots = modalDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentImageIndex);
    });
}

if (prevGalleryBtn) prevGalleryBtn.addEventListener('click', prevGalleryImage);
if (nextGalleryBtn) nextGalleryBtn.addEventListener('click', nextGalleryImage);
if (galleryClose) galleryClose.addEventListener('click', closeGalleryModal);
if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (galleryModal && galleryModal.style.display === 'block') {
        if (e.key === 'ArrowRight') nextGalleryImage();
        if (e.key === 'ArrowLeft') prevGalleryImage();
        if (e.key === 'Escape') closeGalleryModal();
    }
});