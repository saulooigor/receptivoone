// main.js - Funções principais do site (atualizado sem API Google Maps)

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a biblioteca AOS para animações no scroll
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
    
    // Adição de biblioteca de animações CSS
    const animateCSSLink = document.createElement('link');
    animateCSSLink.rel = 'stylesheet';
    animateCSSLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
    document.head.appendChild(animateCSSLink);
    
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
    
    // Configurar efeitos de hover
    if (typeof setupHoverEffects === 'function') {
        setupHoverEffects();
    }
    
    // Adicionar animações extras
    addExtraAnimations();
});

// Função para configurar o botão CTA no header
function setupCTAButton() {
    const ctaButton = document.getElementById('header-cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Adiciona animação ao botão antes de rolar
            ctaButton.classList.add('animate__animated', 'animate__rubberBand');
            
            setTimeout(() => {
                ctaButton.classList.remove('animate__animated', 'animate__rubberBand');
                
                // Rolagem suave com efeito
                document.getElementById('pacotes').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                
                // Destacar a seção de pacotes ao rolar até ela
                setTimeout(() => {
                    const pacotesSection = document.getElementById('pacotes');
                    pacotesSection.classList.add('highlight-section');
                    
                    setTimeout(() => {
                        pacotesSection.classList.remove('highlight-section');
                    }, 1000);
                }, 1000);
            }, 800);
        });
    }
}

// Configuração do botão de WhatsApp flutuante
function setupWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsapp-button');
    if (whatsappButton) {
        const phoneNumber = '31975157421'; // Número da empresa
        const whatsappLink = whatsappButton.querySelector('a');
        
        if (whatsappLink) {
            whatsappLink.href = `https://wa.me/${phoneNumber}?text=Olá! Estou interessado em conhecer os pacotes turísticos.`;
        }
        
        // Inicialmente esconde o botão
        whatsappButton.style.opacity = '0';
        whatsappButton.style.transform = 'scale(0.5) translateY(20px)';
        
        // Mostrar o botão após um scroll mínimo com animação
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                whatsappButton.style.opacity = '1';
                whatsappButton.style.transform = 'scale(1) translateY(0)';
                whatsappButton.classList.add('visible');
            } else {
                whatsappButton.style.opacity = '0';
                whatsappButton.style.transform = 'scale(0.5) translateY(20px)';
                whatsappButton.classList.remove('visible');
            }
        });
        
        // Adiciona um efeito de pulsar periódico
        setInterval(() => {
            if (whatsappButton.classList.contains('visible')) {
                whatsappButton.classList.add('animate__animated', 'animate__heartBeat');
                setTimeout(() => {
                    whatsappButton.classList.remove('animate__animated', 'animate__heartBeat');
                }, 1000);
            }
        }, 5000);
        
        // Adiciona efeito de clique
        whatsappButton.addEventListener('click', function(e) {
            // Sem preventDefault para permitir que o link funcione normalmente
            this.classList.add('animate__animated', 'animate__bounceOut');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__bounceOut');
            }, 1000);
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
                        
                        // Adiciona um efeito extra aleatório para alguns elementos
                        if (Math.random() > 0.7) {
                            const animations = ['bounce', 'pulse', 'rubberBand', 'flash'];
                            const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                            entry.target.classList.add('animate__animated', `animate__${randomAnim}`);
                            
                            setTimeout(() => {
                                entry.target.classList.remove('animate__animated', `animate__${randomAnim}`);
                            }, 1500);
                        }
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
            headerElement.style.backgroundSize = 'cover';
            headerElement.style.backgroundPosition = 'center';
            
            // Remove o vídeo para economizar recursos em dispositivos móveis
            if (headerVideo.parentNode) {
                headerVideo.parentNode.removeChild(headerVideo);
            }
        } else {
            // Em desktops, carrega o vídeo com configurações otimizadas
            headerVideo.setAttribute('playsinline', '');
            headerVideo.setAttribute('preload', 'auto');
            headerVideo.load();
            
            // Adiciona evento para verificar quando o vídeo começa a reproduzir
            headerVideo.addEventListener('playing', function() {
                // Adiciona efeito de fade-in quando o vídeo começa a reproduzir
                headerVideo.style.opacity = '0';
                setTimeout(() => {
                    headerVideo.style.transition = 'opacity 1.5s ease';
                    headerVideo.style.opacity = '1';
                }, 100);
            });
        }
    }
}

// Função para adicionar animações extras por toda a página
function addExtraAnimations() {
    // Animação do título principal na scroll
    const mainTitle = document.querySelector('h1');
    if (mainTitle) {
        window.addEventListener('scroll', () => {
            // Paralaxe simples - o título se move mais lentamente que o scroll
            const scrollValue = window.scrollY;
            if (scrollValue < window.innerHeight) {
                mainTitle.style.transform = `translateY(${scrollValue * 0.3}px)`;
                mainTitle.style.opacity = 1 - (scrollValue / (window.innerHeight * 0.7));
            }
        });
    }
    
    // Animação das imagens nos cards
    const cardImages = document.querySelectorAll('.pacote-card img');
    cardImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'saturate(1.5) brightness(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });
    
    // Adiciona animação ao mapa quando entra na viewport
    const mapaContainer = document.getElementById('pacote-mapa');
    if (mapaContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona efeito de pulse ao mapa
                    mapaContainer.classList.add('map-pulse');
                    // Para o efeito depois de alguns segundos
                    setTimeout(() => {
                        mapaContainer.classList.remove('map-pulse');
                    }, 3000);
                    
                    observer.unobserve(mapaContainer);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(mapaContainer);
    }
    
    // Adiciona efeito de hover nos badges de preço
    const priceBadges = document.querySelectorAll('.badge');
    priceBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Anima o logo periodicamente
    const logo = document.querySelector('.logo');
    if (logo) {
        setInterval(() => {
            logo.classList.add('animate__animated', 'animate__tada');
            setTimeout(() => {
                logo.classList.remove('animate__animated', 'animate__tada');
            }, 1000);
        }, 15000); // A cada 15 segundos
    }
    
    // Adiciona efeito de cursor personalizado para elementos interativos
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            document.body.style.cursor = 'pointer';
        });
        
        btn.addEventListener('mouseleave', function() {
            document.body.style.cursor = 'default';
        });
    });
    
    // Efeito de texto animado para o título da seção de pacotes
    const pacotesTitulo = document.querySelector('#pacotes h2');
    if (pacotesTitulo) {
        // Anima o título quando ele entra na viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pacotesTitulo.classList.add('animate__animated', 'animate__bounceIn');
                    observer.unobserve(pacotesTitulo);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(pacotesTitulo);
    }
    
    // Adiciona efeito ao elemento decorativo do mapa
    const mapPin = document.querySelector('.map-decorative-pin');
    if (mapPin) {
        setInterval(() => {
            mapPin.classList.add('animate__animated', 'animate__bounce');
            setTimeout(() => {
                mapPin.classList.remove('animate__animated', 'animate__bounce');
            }, 1000);
        }, 8000); // A cada 8 segundos
    }
}

// Chama a função de pré-carregamento do vídeo
preloadHeaderVideo();