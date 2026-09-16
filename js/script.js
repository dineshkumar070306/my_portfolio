// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {

    // ===== Elements =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const backTop = document.getElementById('backTop');
    const sections = document.querySelectorAll('section');

    // ===== Hamburger Menu =====
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // ===== Close menu on link click =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== Sticky Navbar + Scroll Effect =====
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            backTop.classList.add('visible');
        } else {
            backTop.classList.remove('visible');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
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

    // ===== Back to Top =====
    backTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== Scroll Reveal =====
    const revealElements = document.querySelectorAll(
        '.project-card, .skill-category, .edu-card, .cert-card, .stat-card, .internship-card, .contact-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        revealObserver.observe(el);
    });

    document.addEventListener('scroll', function() {
        revealElements.forEach(el => {
            if (el.classList.contains('revealed')) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });

    // ===== Smooth scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Project card hover =====
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease';
        });
    });

    // =============================================
    // ===== RESUME DOWNLOAD - DIRECT PDF =====
    // =============================================

    const RESUME_PATH = 'assets/Dineshkumar_S_Resume.pdf';

    function downloadResume() {
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = RESUME_PATH;
        link.download = 'Dineshkumar_S_Resume.pdf';
        link.target = '_blank';
        
        // Check if file exists, then download directly
        fetch(RESUME_PATH, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // File exists - download the PDF
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showDownloadToast('✅ Resume PDF downloaded successfully!');
                } else {
                    // File not found - show error
                    showDownloadToast('❌ Resume PDF not found. Please check the file path.', 'error');
                }
            })
            .catch(() => {
                // Network error - show error
                showDownloadToast('❌ Failed to download resume. Please try again.', 'error');
            });
    }

    function showDownloadToast(message, type = 'success') {
        const existingToast = document.querySelector('.download-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'download-toast show';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const color = type === 'success' ? 'var(--accent-2)' : '#ff5f57';
        toast.innerHTML = `
            <i class="fas ${icon}" style="color: ${color};"></i>
            <span>${message}</span>
            <button class="close-toast" onclick="this.parentElement.remove()">&times;</button>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }
        }, 4000);
    }

    // ===== Add click listeners to all download buttons =====
    const downloadButtons = [
        'downloadResumeNav',
        'downloadResumeHero',
        'downloadResumeAbout',
        'downloadResumeContact'
    ];

    downloadButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                downloadResume();
            });
        }
    });

    // =============================================
    // ===== CONTACT FORM VALIDATION & EMAILJS =====
    // =============================================
    
    (function() {
        emailjs.init({
            publicKey: "x3oKRa7xkRK_uC4UU",
        });
    })();

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const sendBtn = document.getElementById('sendBtn');

    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const userMessage = document.getElementById('userMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    function validateName(name) {
        return /^[A-Za-z\s]{2,50}$/.test(name);
    }
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validatePhone(phone) {
        return /^[0-9]{10}$/.test(phone);
    }
    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    userName.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length > 0 && !validateName(value)) {
            this.classList.add('error'); this.classList.remove('success');
            nameError.textContent = 'Name should contain only alphabets (2-50 characters)';
            nameError.classList.add('visible');
        } else if (value.length > 0 && validateName(value)) {
            this.classList.remove('error'); this.classList.add('success');
            nameError.classList.remove('visible');
        } else {
            this.classList.remove('error', 'success');
            nameError.classList.remove('visible');
        }
    });

    userEmail.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length > 0 && !validateEmail(value)) {
            this.classList.add('error'); this.classList.remove('success');
            emailError.textContent = 'Please enter a valid email address (e.g., name@domain.com)';
            emailError.classList.add('visible');
        } else if (value.length > 0 && validateEmail(value)) {
            this.classList.remove('error'); this.classList.add('success');
            emailError.classList.remove('visible');
        } else {
            this.classList.remove('error', 'success');
            emailError.classList.remove('visible');
        }
    });

    userPhone.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        const value = this.value.trim();
        if (value.length > 0 && !validatePhone(value)) {
            this.classList.add('error'); this.classList.remove('success');
            phoneError.textContent = value.length !== 10 ? `Phone number must be exactly 10 digits (${value.length}/10)` : 'Phone number should contain only digits';
            phoneError.classList.add('visible');
        } else if (value.length > 0 && validatePhone(value)) {
            this.classList.remove('error'); this.classList.add('success');
            phoneError.classList.remove('visible');
        } else {
            this.classList.remove('error', 'success');
            phoneError.classList.remove('visible');
        }
    });

    userMessage.addEventListener('input', function() {
        const value = this.value.trim();
        if (value.length > 0 && value.length < 10) {
            this.classList.add('error'); this.classList.remove('success');
            messageError.textContent = `Message must be at least 10 characters (${value.length}/10)`;
            messageError.classList.add('visible');
        } else if (value.length >= 10) {
            this.classList.remove('error'); this.classList.add('success');
            messageError.classList.remove('visible');
        } else {
            this.classList.remove('error', 'success');
            messageError.classList.remove('visible');
        }
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = userName.value.trim();
        const email = userEmail.value.trim();
        const phone = userPhone.value.trim();
        const message = userMessage.value.trim();

        let isValid = true;
        let firstError = null;

        if (!name || !validateName(name)) {
            userName.classList.add('error'); userName.classList.remove('success');
            nameError.textContent = 'Name should contain only alphabets (2-50 characters)';
            nameError.classList.add('visible');
            isValid = false; if (!firstError) firstError = userName;
        } else {
            userName.classList.remove('error'); userName.classList.add('success');
            nameError.classList.remove('visible');
        }

        if (!email || !validateEmail(email)) {
            userEmail.classList.add('error'); userEmail.classList.remove('success');
            emailError.textContent = 'Please enter a valid email address';
            emailError.classList.add('visible');
            isValid = false; if (!firstError) firstError = userEmail;
        } else {
            userEmail.classList.remove('error'); userEmail.classList.add('success');
            emailError.classList.remove('visible');
        }

        if (!phone || !validatePhone(phone)) {
            userPhone.classList.add('error'); userPhone.classList.remove('success');
            phoneError.textContent = !phone ? 'Phone number is required' : `Phone number must be exactly 10 digits (${phone.length}/10)`;
            phoneError.classList.add('visible');
            isValid = false; if (!firstError) firstError = userPhone;
        } else {
            userPhone.classList.remove('error'); userPhone.classList.add('success');
            phoneError.classList.remove('visible');
        }

        if (!message || message.length < 10) {
            userMessage.classList.add('error'); userMessage.classList.remove('success');
            messageError.textContent = !message ? 'Message is required' : `Message must be at least 10 characters (${message.length}/10)`;
            messageError.classList.add('visible');
            isValid = false; if (!firstError) firstError = userMessage;
        } else {
            userMessage.classList.remove('error'); userMessage.classList.add('success');
            messageError.classList.remove('visible');
        }

        if (!isValid) {
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            showStatus('Please fix the errors before submitting.', 'error');
            return;
        }

        const now = new Date();
        const exactTime = now.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        sendBtn.textContent = 'Sending...';
        sendBtn.disabled = true;

        const templateParams = {
            from_name: name,
            from_email: email,
            from_phone: phone,
            from_time: exactTime,
            message: message,
            to_email: 'dinesh07032006@gmail.com'
        };

        emailjs.send(
            'xchp vxag oggz iyga',
            'template_52ofwhb',
            templateParams
        )
        .then(function(response) {
            showStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            [userName, userEmail, userPhone, userMessage].forEach(field => {
                field.classList.remove('success', 'error');
            });
        })
        .catch(function(error) {
            console.error('EmailJS Error:', error);
            showStatus('❌ Failed to send message. Please try again later.', 'error');
        })
        .finally(function() {
            sendBtn.textContent = 'Send Message';
            sendBtn.disabled = false;
        });
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        formStatus.style.display = 'block';

        clearTimeout(window.statusTimeout);
        window.statusTimeout = setTimeout(function() {
            formStatus.style.display = 'none';
        }, 6000);
    }

    console.log('🚀 Dineshkumar S Portfolio');
    console.log('💻 Built with HTML, CSS & Vanilla JS');
    console.log('📧 Contact form uses EmailJS with validation');
});