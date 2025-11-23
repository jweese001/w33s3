// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = target.offsetTop - navbarHeight - 1; // 1px offset to hide the border
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.overview-card, .feature-category, .demo-card, .tech-category, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter animation for hero stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 50);
}

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const text = stat.textContent;
                if (text.includes('1500')) {
                    stat.textContent = '0+';
                    animateCounter(stat, 1500);
                }
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Video play on hover (desktop only)
if (window.innerWidth > 768) {
    document.querySelectorAll('.demo-video video').forEach(video => {
        video.addEventListener('mouseenter', () => {
            if (video.paused) {
                video.play();
            }
        });
        
        video.addEventListener('mouseleave', () => {
            if (!video.paused) {
                video.pause();
            }
        });
    });
}

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 70;
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - navbarHeight - 30)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to page elements
    const elementsToAnimate = document.querySelectorAll('.hero-text, .section-header');
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Error handling for videos
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', (e) => {
        console.log('Video error:', e);
        const container = video.parentElement;
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #1f2937; color: white; flex-direction: column;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🎬</div>
                <div>Demo Video</div>
                <div style="font-size: 0.875rem; opacity: 0.7; margin-top: 0.5rem;">Video unavailable</div>
            </div>
        `;
    });
});

// Project Data Management
const projectData = [
    {
        id: 'seaborne-react',
        title: 'Seaborne React Application',
        status: 'In Development',
        description: 'A comprehensive React application built with TypeScript and Material-UI, featuring modern state management and responsive design patterns.',
        tags: ['react', 'typescript', 'material-ui'],
        technologies: ['React', 'TypeScript', 'Material-UI'],
        links: {
            details: '#seaborne-details',
            github: 'https://github.com/username/seaborne-react'
        }
    },
    {
        id: 'w33s3-portfolio',
        title: 'w33s3 Portfolio Platform',
        status: 'Completed',
        description: 'A modern portfolio website featuring custom Three.js integration, responsive design, and interactive animations showcasing healthcare technology work.',
        tags: ['javascript', 'threejs', 'webgl'],
        technologies: ['JavaScript', 'Three.js', 'WebGL'],
        links: {
            details: '#portfolio-details',
            github: 'https://github.com/username/w33s3-portfolio'
        }
    },
    {
        id: 'careprime-platform',
        title: 'CarePrime Digital Platform',
        status: 'Enterprise',
        description: 'Comprehensive digital patient engagement platform for healthcare providers, featuring secure communications, appointment management, and care coordination tools.',
        tags: ['healthcare', 'digital-engagement', 'platform'],
        technologies: ['Healthcare Tech', 'Digital Engagement', 'Platform Architecture'],
        links: {
            details: '#careprime-details',
            github: '#careprime-docs'
        }
    }
];

// Project Grid Management
function renderProjectGrid(projects = projectData) {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;
    
    projectGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-tags="${project.tags.join(',')}" data-project-id="${project.id}">
            <div class="project-header">
                <h3>${project.title}</h3>
                <div class="project-status">${project.status}</div>
            </div>
            <div class="project-description">
                <p>${project.description}</p>
            </div>
            <div class="project-tech">
                ${project.technologies.map(tech => 
                    `<span class="tech-tag" data-tech="${tech.toLowerCase().replace(/[\s\.]/g, '-')}">${tech}</span>`
                ).join('')}
            </div>
            <div class="project-links">
                <a href="${project.links.details}" class="project-link">View Details</a>
                <a href="${project.links.github}" class="project-github">GitHub</a>
            </div>
        </div>
    `).join('');
    
    // Re-initialize animations for new cards
    initializeProjectAnimations();
}

// Initialize project card animations
function initializeProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Project Filtering System
let currentFilter = 'all';

function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filterValue = e.target.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Apply filter
            filterProjects(filterValue);
            currentFilter = filterValue;
        });
    });
}

function filterProjects(filterValue) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags').toLowerCase().split(',');
        const shouldShow = filterValue === 'all' || tags.includes(filterValue.toLowerCase());
        
        if (shouldShow) {
            card.classList.remove('hidden');
            // Re-trigger intersection observer for visible cards
            setTimeout(() => {
                if (observer) {
                    observer.observe(card);
                }
            }, 100);
        } else {
            card.classList.add('hidden');
            if (observer) {
                observer.unobserve(card);
            }
        }
    });
}

// Initialize projects on page load
document.addEventListener('DOMContentLoaded', () => {
    // Don't render if grid already has content
    const existingCards = document.querySelectorAll('.project-card');
    if (existingCards.length === 0) {
        renderProjectGrid();
    }
    
    // Initialize filtering system
    initializeProjectFiltering();
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Enhanced accessibility
document.querySelectorAll('.nav-link, .btn-primary, .btn-secondary').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #2563eb';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Performance optimization: lazy load videos
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            video.load();
            videoObserver.unobserve(video);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('video').forEach(video => {
    videoObserver.observe(video);
});

// YouTube video embeds initialized
document.addEventListener('DOMContentLoaded', () => {
    console.log('YouTube video embeds loaded');
});