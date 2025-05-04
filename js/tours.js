// tours.js - Gerenciamento dos pacotes turísticos com maior dinamicidade

// Variável para armazenar os dados dos pacotes
let toursData = [];

// Função para carregar os dados dos pacotes do arquivo JSON
async function loadTours() {
    try {
        // Em produção, carregaria de um arquivo JSON real
        const response = await fetch('data/tours.json');
        toursData = await response.json();
        
        // Renderiza os cards na página com animação sequencial
        renderTourCards();
        
        // Configura os eventos para os botões de visualização de detalhes
        setupTourEvents();
        
    } catch (error) {
        console.error('Erro ao carregar os pacotes turísticos:', error);
        document.getElementById('pacotes-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Não foi possível carregar os pacotes turísticos. Por favor, tente novamente mais tarde.
            </div>
        `;
    }
}

// Função para renderizar os cards dos pacotes com efeitos
function renderTourCards() {
    const container = document.getElementById('pacotes-container');
    
    // Limpa o container
    container.innerHTML = '';
    
    // Cria os cards para cada pacote com delay para efeito sequencial
    toursData.forEach((tour, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 200).toString());
        
        // Gera uma cor de borda dinâmica para cada card
        const borderColors = ['#fc8c04', '#5c0404', '#5094ac', '#bcaa84'];
        const borderColor = borderColors[index % borderColors.length];
        
        card.innerHTML = `
            <div class="card pacote-card" style="border-top: 4px solid ${borderColor}">
                <div class="overflow-hidden">
                    <img src="assets/images/${tour.imagens[0]}" class="card-img-top" alt="${tour.nome}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${tour.nome}</h5>
                    <p class="card-text">${tour.descricao.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-primary">A partir de <strong>${tour.valorBase}</strong></span>
                        <button class="btn btn-outline-primary ver-pacote" data-id="${tour.id}">
                            <i class="fas fa-camera-retro me-2"></i>Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Adiciona efeito de escalonamento nos cards quando o mouse passa por cima
    const cards = document.querySelectorAll('.pacote-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotate(2deg)';
            this.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.2)';
            this.querySelector('img').style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.querySelector('img').style.transform = '';
        });
    });
    
    // Adiciona pequena animação aleatória para cada card
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate__animated', 'animate__pulse');
                setTimeout(() => {
                    card.classList.remove('animate__animated', 'animate__pulse');
                }, 1000);
            }, index * 2000);
        });
    }, 3000);
}

// Configurar eventos para os botões de visualização de detalhes
function setupTourEvents() {
    // Adiciona evento aos botões "Ver Detalhes"
    document.querySelectorAll('.ver-pacote').forEach(button => {
        button.addEventListener('click', function() {
            const tourId = this.getAttribute('data-id');
            showTourDetails(parseInt(tourId));
        });
    });
    
    // Botão para voltar à lista de pacotes
    const voltarBtn = document.getElementById('voltar-pacotes');
    if (voltarBtn) {
        voltarBtn.addEventListener('click', function() {
            // Efeito de transição suave
            document.getElementById('detalhe-pacote').style.opacity = 0;
            
            setTimeout(() => {
                document.getElementById('pacotes').classList.remove('d-none');
                document.getElementById('detalhe-pacote').classList.add('d-none');
                
                // Anima a entrada da seção de pacotes
                document.getElementById('pacotes').style.opacity = 0;
                document.getElementById('pacotes').style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    document.getElementById('pacotes').style.opacity = 1;
                    document.getElementById('pacotes').style.transform = 'translateY(0)';
                }, 100);
                
            }, 300);
        });
    }
    
    // Botão para reservar
    const reservarBtn = document.getElementById('reservar-btn');
    if (reservarBtn) {
        reservarBtn.addEventListener('click', function() {
            const pacoteNome = document.getElementById('pacote-titulo').textContent;
            const mensagem = `Olá! Estou interessado no pacote "${pacoteNome}". Gostaria de mais informações e disponibilidade.`;
            const phoneNumber = '31975157421'; // Substitua pelo número real da empresa
            
            // Efeito de clique
            this.classList.add('animate__animated', 'animate__rubberBand');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__rubberBand');
                window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensagem)}`, '_blank');
            }, 800);
        });
    }
}

// Função para exibir os detalhes de um pacote específico
function showTourDetails(tourId) {
    // Encontra o pacote pelo ID
    const tour = toursData.find(t => t.id === tourId);
    
    if (!tour) {
        console.error('Pacote não encontrado:', tourId);
        return;
    }
    
    // Atualiza os elementos da página com os detalhes do pacote
    document.getElementById('pacote-titulo').textContent = tour.nome;
    document.getElementById('pacote-descricao').textContent = tour.descricao;
    document.getElementById('pacote-valor').textContent = tour.valorBase;
    
    // Cria o carrossel de imagens
    const carouselInner = document.getElementById('carousel-inner-container');
    carouselInner.innerHTML = '';
    
    tour.imagens.forEach((imagem, index) => {
        const item = document.createElement('div');
        item.className = index === 0 ? 'carousel-item active' : 'carousel-item';
        item.innerHTML = `<img src="assets/images/${imagem}" class="d-block w-100" alt="Imagem do ${tour.nome}">`;
        carouselInner.appendChild(item);
    });
    
    // Adiciona vídeos ao carrossel, se existirem
    // Verifica se é um dispositivo móvel
    const isMobile = window.innerWidth <= 768;

    // Adiciona vídeos ao carrossel, se existirem
    if (tour.videos && tour.videos.length > 0) {
        tour.videos.forEach(video => {
            const item = document.createElement('div');
            item.className = 'carousel-item';

            // Configura o vídeo sem autoplay para dispositivos móveis
            const autoplayAttr = isMobile ? '' : 'autoplay';

            item.innerHTML = `
                <video class="d-block w-100" controls ${autoplayAttr} muted loop>
                    <source src="assets/videos/${video}" type="video/mp4">
                    Seu navegador não suporta vídeos HTML5.
                </video>
                ${isMobile ? '<div class="video-play-indicator"><i class="fas fa-play-circle"></i><p>Toque para reproduzir</p></div>' : ''}
            `;
            carouselInner.appendChild(item);

            // Adiciona evento de clique para reproduzir o vídeo em dispositivos móveis
            if (isMobile) {
                const videoEl = item.querySelector('video');
                const playIndicator = item.querySelector('.video-play-indicator');

                item.addEventListener('click', function() {
                    if (videoEl.paused) {
                        videoEl.play();
                        if (playIndicator) {
                            playIndicator.style.opacity = '0';
                        }
                    } else {
                        videoEl.pause();
                        if (playIndicator) {
                            playIndicator.style.opacity = '1';
                        }
                    }
                });
            }
        });
    }
    
    // Atualiza a lista de itens inclusos com animação
    const itensList = document.getElementById('pacote-itens');
    itensList.innerHTML = '';
    
    tour.incluso.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        li.style.transition = 'all 0.3s ease';
        li.style.transitionDelay = `${index * 100}ms`;
        
        li.innerHTML = `
            ${item.item}
            <span class="badge ${item.valor === 'Incluso' ? 'bg-success' : 'bg-primary'} rounded-pill">${item.valor}</span>
        `;
        itensList.appendChild(li);
        
        // Força o reflow para a animação funcionar
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
        }, 10);
    });
    
    // Atualiza o iframe do mapa com a localização específica do passeio
    updateMapIframe(tour.localizacao);
    
    // Esconde a seção de pacotes com fade out
    document.getElementById('pacotes').style.opacity = 0;
    document.getElementById('pacotes').style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        // Exibe a seção de detalhes e oculta a lista de pacotes
        document.getElementById('pacotes').classList.add('d-none');
        document.getElementById('detalhe-pacote').classList.remove('d-none');
        
        // Mostra a seção de detalhes com fade in
        document.getElementById('detalhe-pacote').style.opacity = 0;
        document.getElementById('detalhe-pacote').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.getElementById('detalhe-pacote').style.opacity = 1;
            document.getElementById('detalhe-pacote').style.transform = 'translateY(0)';
            
            // Inicia o carrossel
            const carousel = new bootstrap.Carousel(document.getElementById('pacote-carousel'), {
                interval: 3000,
                touch: true
            });
        }, 100);
        
    }, 300);
}

// Função para atualizar o iframe do Google Maps
function updateMapIframe(localizacao) {
    const mapContainer = document.getElementById('pacote-mapa');
    if (mapContainer) {
        // Define uma URL com as coordenadas para um iframe do Google Maps
        // Coordenadas podem ser usadas diretamente em uma URL do Google Maps
        const mapUrl = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3751.1018139985167!2d-44.134144924801205!3d-19.920113938000632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1spt-BR!2sbr!4v1746382491345!5m2!1spt-BR!2sbr`;
        
        // Cria o iframe com animação
        mapContainer.innerHTML = '';
        
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'map-loading-indicator';
        loadingIndicator.innerHTML = '<i class="fas fa-map-marked-alt fa-spin"></i><p>Carregando mapa...</p>';
        mapContainer.appendChild(loadingIndicator);
        
        setTimeout(() => {
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '15px';
            iframe.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
            iframe.style.opacity = '0';
            iframe.style.transition = 'opacity 0.5s ease';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.src = mapUrl;
            
            iframe.onload = function() {
                loadingIndicator.remove();
                iframe.style.opacity = '1';
            };
            
            mapContainer.appendChild(iframe);
        }, 800);
    }
}

// Função para animar as seções quando ficam visíveis
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Função para adicionar efeitos de hover aos botões e elementos interativos
function setupHoverEffects() {
    // Botões
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Links do footer
    const footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.color = '#f9d071';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.color = '';
        });
    });
}

// Exporta as funções para uso em outros arquivos
window.loadTours = loadTours;
window.animateOnScroll = animateOnScroll;
window.setupHoverEffects = setupHoverEffects;