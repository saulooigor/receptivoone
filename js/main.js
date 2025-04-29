// main.js - Funções principais do site

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o carregamento de pacotes
    if (typeof loadTours === 'function') {
        loadTours();
    }
    
    // Configurar botão de CTA no header
    setupCTAButton();
    
    // Inicializar botão de WhatsApp
    setupWhatsAppButton();
    
    // Configurar animações de scroll
    setupScrollAnimations();
});

// Função para configurar o botão CTA no header
function setupCTAButton() {
    const ctaButton = document.getElementById('header-cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.getElementById('pacotes').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
}

// Configuração do botão de WhatsApp flutuante
function setupWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsapp-button');
    if (whatsappButton) {
        const phoneNumber = '5500000000000'; // Número da empresa
        const whatsappLink = whatsappButton.querySelector('a');
        
        if (whatsappLink) {
            whatsappLink.href = `https://wa.me/${phoneNumber}?text=Olá! Estou interessado em conhecer os pacotes turísticos.`;
        }
        
        // Mostrar o botão após um scroll mínimo
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                whatsappButton.classList.add('visible');
            } else {
                whatsappButton.classList.remove('visible');
            }
        });
    }
}

// Animações de elementos conforme scroll da página
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        // Verifica se o navegador suporta IntersectionObserver
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.1 });
            
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback para navegadores que não suportam IntersectionObserver
            animatedElements.forEach(element => {
                element.classList.add('animated');
            });
        }
    }
}

// Função para pré-carregar o vídeo do header
function preloadHeaderVideo() {
    const headerVideo = document.getElementById('header-video');
    if (headerVideo) {
        // Verifica se está em um dispositivo móvel para otimizar carregamento
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Em dispositivos móveis, pode-se optar por uma imagem estática
            const headerElement = document.querySelector('.header-video');
            headerElement.style.backgroundImage = 'url(assets/images/header-background-mobile.jpg)';
            headerVideo.parentNode.removeChild(headerVideo);
        } else {
            // Em desktops, carrega o vídeo normalmente
            headerVideo.load();
        }
    }
}

// Chama a função de pré-carregamento do vídeo
preloadHeaderVideo();