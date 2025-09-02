// Wrap everything in an IIFE to avoid global variable conflicts
(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {

        /* ===================== SLIDER ===================== */
        const sliderElements = document.querySelectorAll(".slide");
        const sliderButtons = document.querySelectorAll(".nav-buttons button");
        let currentSlideIndex = 0;

        // Only run slider if elements exist
        if (sliderElements.length > 0 && sliderButtons.length > 0) {
            function displaySlide(index) {
                sliderElements.forEach((s, i) => s.classList.toggle("active", i === index));
                sliderButtons.forEach((b, i) => b.classList.toggle("active", i === index));
                currentSlideIndex = index;
            }
            
            sliderButtons.forEach((btn, i) => btn.addEventListener("click", () => displaySlide(i)));
            
            // Auto-advance slides
            setInterval(() => displaySlide((currentSlideIndex + 1) % sliderElements.length), 4000);
            
            // Initialize first slide
            displaySlide(0);
        }

        /* ===================== PORTFOLIO FILTER ===================== */
        const portfolioFilterTabs = document.querySelectorAll('.filter-tab');
        const portfolioGalleryItems = document.querySelectorAll('.gallery-item');

        // Only run if elements exist
        if (portfolioFilterTabs.length > 0 && portfolioGalleryItems.length > 0) {
            portfolioFilterTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active from all tabs
                    portfolioFilterTabs.forEach(t => t.classList.remove('active'));
                    // Add active to clicked tab
                    this.classList.add('active');
                    
                    const filterValue = this.getAttribute('data-filter');
                    
                    portfolioGalleryItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');
                        
                        if (filterValue === 'all' || itemCategory === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
            
            // Initialize with print filter
            const printFilterTab = document.querySelector('[data-filter="print"]');
            if (printFilterTab) {
                setTimeout(() => printFilterTab.click(), 100);
            }
        }

        /* ===================== SHOW MORE/LESS FUNCTIONALITY ===================== */
        const showMoreButton = document.getElementById('showMoreBtn');
        const hiddenGalleryItems = document.querySelectorAll('.hidden-item');
        const portfolioGallery = document.querySelector('.gallery');

        if (showMoreButton && hiddenGalleryItems.length > 0) {
            const buttonText = showMoreButton.querySelector('.btn-text');
            const buttonIcon = showMoreButton.querySelector('.btn-icon');
            let isGalleryExpanded = false;

            showMoreButton.addEventListener('click', function() {
                isGalleryExpanded = !isGalleryExpanded;
                
                if (isGalleryExpanded) {
                    // Show hidden items with stagger effect
                    hiddenGalleryItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.classList.add('show');
                            }, 10);
                        }, index * 100);
                    });
                    
                    // Update button
                    if (buttonText) buttonText.textContent = 'Show Less Works';
                    showMoreButton.classList.add('expanded');
                    if (portfolioGallery) portfolioGallery.classList.add('expanded');
                    
                } else {
                    // Hide items
                    hiddenGalleryItems.forEach((item) => {
                        item.classList.remove('show');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 500);
                    });
                    
                    // Update button
                    if (buttonText) buttonText.textContent = 'Show More Works';
                    showMoreButton.classList.remove('expanded');
                    if (portfolioGallery) portfolioGallery.classList.remove('expanded');
                    
                    // Scroll back to portfolio section
                    const portfolioSection = document.querySelector('.portfolio-section') || document.querySelector('#portfolio');
                    if (portfolioSection) {
                        portfolioSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        }

        /* ===================== MAIN NAVBAR ACTIVE ===================== */
        const navigationLinks = document.querySelectorAll("#navbar .nav-link, .navbar .nav-link, nav .nav-link, .nav a");
        const pageSections = document.querySelectorAll("section[id], div[id]");

        // Only run if navbar and sections exist
        if (navigationLinks.length > 0 && pageSections.length > 0) {
            function updateNavigationActive() {
                try {
                    let scrollPosition = window.scrollY + 100; // Offset for better detection
                    let activeSection = '';
                    
                    // Find current section
                    pageSections.forEach(section => {
                        if (section.id && section.offsetTop <= scrollPosition) {
                            activeSection = section.id;
                        }
                    });
                    
                    // Handle bottom of page
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
                        const lastSection = [...pageSections].reverse().find(s => s.id);
                        if (lastSection) activeSection = lastSection.id;
                    }
                    
                    // Update active states
                    navigationLinks.forEach(link => {
                        const linkHref = link.getAttribute('href');
                        if (linkHref && linkHref.startsWith('#')) {
                            const targetId = linkHref.substring(1);
                            link.classList.toggle('active', targetId === activeSection);
                        }
                    });
                } catch (error) {
                    console.log('Navigation update error:', error);
                }
            }
            
            // Throttled scroll handler for better performance
            let isScrolling = false;
            function handleScrollEvent() {
                if (!isScrolling) {
                    requestAnimationFrame(() => {
                        updateNavigationActive();
                        isScrolling = false;
                    });
                    isScrolling = true;
                }
            }
            
            // Event listeners
            window.addEventListener('scroll', handleScrollEvent, { passive: true });
            window.addEventListener('resize', updateNavigationActive);
            window.addEventListener('load', updateNavigationActive);
            
            // Initial call
            setTimeout(updateNavigationActive, 100);
        }

        /* ===================== SMOOTH SCROLLING FOR LINKS ===================== */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const linkHref = this.getAttribute('href');
                if (linkHref === '#') return;
                
                const targetElement = document.querySelector(linkHref);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

    }); // End of DOMContentLoaded

})(); // End of IIFE