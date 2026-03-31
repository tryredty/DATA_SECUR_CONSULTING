window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageTransition').classList.add('hidden');
    }, 800);
    
    // Check cookie consent after page loads
    setTimeout(() => {
        checkCookieConsent();
    }, 1000);
});

// Cookie Management System (identique à l'original, avec adaptation des couleurs)
const cookieConsentBanner = document.getElementById('cookieConsent');
const cookieModal = document.getElementById('cookieModal');
const acceptAllCookiesBtn = document.getElementById('acceptAllCookies');
const refuseNonEssentialBtn = document.getElementById('refuseNonEssential');
const cookieSettingsBtn = document.getElementById('cookieSettings');
const closeCookieModalBtn = document.getElementById('closeCookieModal');
const saveCookiePreferencesBtn = document.getElementById('saveCookiePreferences');
const acceptAllInModalBtn = document.getElementById('acceptAllInModal');
const analyticsCookiesCheckbox = document.getElementById('analyticsCookies');
const preferenceCookiesCheckbox = document.getElementById('preferenceCookies');

function checkCookieConsent() {
    const cookieConsent = getCookie('cookie_consent');
    if (!cookieConsent) {
        setTimeout(() => {
            cookieConsentBanner.classList.add('active');
        }, 1500);
    } else {
        applyCookiePreferences();
    }
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function applyCookiePreferences() {
    const cookieConsent = getCookie('cookie_consent');
    const cookiePreferences = getCookie('cookie_preferences');
    if (cookieConsent === 'all') {
        loadAnalyticsCookies();
        loadPreferenceCookies();
    } else if (cookieConsent === 'essential') {
        // only essential
    } else if (cookieConsent === 'custom' && cookiePreferences) {
        const prefs = JSON.parse(cookiePreferences);
        if (prefs.analytics) loadAnalyticsCookies();
        if (prefs.preferences) loadPreferenceCookies();
    }
}

function loadAnalyticsCookies() {
    console.log('Analytics cookies loaded');
}

function loadPreferenceCookies() {
    console.log('Preference cookies loaded');
}

function acceptAllCookies() {
    setCookie('cookie_consent', 'all', 365);
    setCookie('cookie_preferences', JSON.stringify({ analytics: true, preferences: true }), 365);
    cookieConsentBanner.classList.remove('active');
    cookieModal.classList.remove('active');
    loadAnalyticsCookies();
    loadPreferenceCookies();
    showNotification('Vos préférences de cookies ont été enregistrées. Tous les cookies sont acceptés.');
}

function refuseNonEssentialCookies() {
    setCookie('cookie_consent', 'essential', 365);
    setCookie('cookie_preferences', JSON.stringify({ analytics: false, preferences: false }), 365);
    cookieConsentBanner.classList.remove('active');
    cookieModal.classList.remove('active');
    showNotification('Seuls les cookies essentiels sont activés.');
}

function saveCookiePreferences() {
    const analytics = analyticsCookiesCheckbox.checked;
    const preferences = preferenceCookiesCheckbox.checked;
    setCookie('cookie_consent', 'custom', 365);
    setCookie('cookie_preferences', JSON.stringify({ analytics, preferences }), 365);
    cookieConsentBanner.classList.remove('active');
    cookieModal.classList.remove('active');
    if (analytics) loadAnalyticsCookies();
    if (preferences) loadPreferenceCookies();
    showNotification('Vos préférences de cookies ont été enregistrées.');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent-purple);
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

acceptAllCookiesBtn.addEventListener('click', acceptAllCookies);
refuseNonEssentialBtn.addEventListener('click', refuseNonEssentialCookies);
acceptAllInModalBtn.addEventListener('click', acceptAllCookies);

cookieSettingsBtn.addEventListener('click', () => {
    cookieModal.classList.add('active');
    cookieConsentBanner.classList.remove('active');
    const cookiePreferences = getCookie('cookie_preferences');
    if (cookiePreferences) {
        const prefs = JSON.parse(cookiePreferences);
        analyticsCookiesCheckbox.checked = prefs.analytics || false;
        preferenceCookiesCheckbox.checked = prefs.preferences || false;
    } else {
        analyticsCookiesCheckbox.checked = false;
        preferenceCookiesCheckbox.checked = false;
    }
});

closeCookieModalBtn.addEventListener('click', () => {
    cookieModal.classList.remove('active');
    if (!getCookie('cookie_consent')) {
        setTimeout(() => {
            cookieConsentBanner.classList.add('active');
        }, 500);
    }
});

saveCookiePreferencesBtn.addEventListener('click', saveCookiePreferences);

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        if (link.getAttribute('href').startsWith('#') && link.getAttribute('href') !== '#') {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement && document.getElementById('mainPage').style.display !== 'none') {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('progressBar');
    
    // Header shadow
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top visibility
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    // Scroll progress calculation
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
});

// Back to top click
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Merci pour votre message! Notre équipe vous contactera dans les plus brefs délais.');
    this.reset();
});

document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    showNotification(`Merci pour votre inscription! Un email de confirmation a été envoyé à ${email}.`);
    this.reset();
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Smooth scrolling for anchor links
document.querySelectorAll('#mainPage a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#!') return;
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement && document.getElementById('mainPage').style.display !== 'none') {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Legal Pages Navigation
const showMentionsLegalesBtn = document.getElementById('showMentionsLegales');
const showPrivacyPolicyBtn = document.getElementById('showPrivacyPolicy');
const showCookiePolicyFooterBtn = document.getElementById('showCookiePolicyFooter');
const showCreditsBtn = document.getElementById('showCredits');
const openCookieSettingsFromPageBtn = document.getElementById('openCookieSettingsFromPage');
const backToLegalHomeBtns = document.querySelectorAll('.back-to-legal-home');
const mainPage = document.getElementById('mainPage');

function hideAllLegalPages() {
    document.querySelectorAll('.legal-page').forEach(page => {
        page.classList.remove('active');
    });
}

function showLegalPage(pageId) {
    document.getElementById('pageTransition').classList.remove('hidden');
    setTimeout(() => {
        mainPage.style.display = 'none';
        hideAllLegalPages();
        document.getElementById(pageId).classList.add('active');
        document.getElementById('pageTransition').classList.add('hidden');
        window.scrollTo(0, 0);
    }, 500);
}

showMentionsLegalesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLegalPage('mentionsLegalesPage');
});

showPrivacyPolicyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLegalPage('privacyPolicyPage');
});

showCookiePolicyFooterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLegalPage('cookiePolicyPage');
});

showCreditsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLegalPage('creditsPage');
});

openCookieSettingsFromPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cookieModal.classList.add('active');
});

backToLegalHomeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('pageTransition').classList.remove('hidden');
        setTimeout(() => {
            hideAllLegalPages();
            mainPage.style.display = 'block';
            document.getElementById('pageTransition').classList.add('hidden');
            window.scrollTo(0, 0);
        }, 500);
    });
});

// Link from cookie banner to policy
document.getElementById('showCookiePolicy').addEventListener('click', (e) => {
    e.preventDefault();
    showLegalPage('cookiePolicyPage');
});