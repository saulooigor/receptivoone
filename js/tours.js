// tours.js - Gerenciamento dos pacotes turísticos

// Variável para armazenar os dados dos pacotes
let toursData = [];

// Função para carregar os dados dos pacotes do arquivo JSON
async function loadTours() {
    try {
        // Em produção, carregaria de um arquivo JSON real
        const response = await fetch('data/tours.json');
        toursData = await response.json();
        
        // Renderiza os cards na página
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

// Função para renderizar os cards dos pacotes
function renderTourCards() {
    const container = document.getElementById('pacotes-container');
    
    // Limpa o container
    container.innerHTML = '';
    
    // Cria os cards para cada pacote
    toursData.forEach(tour => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4 animate-on-scroll';
        
        card.innerHTML = `
            <div class="card pacote-card">
                <img src="assets/images/${tour.imagens[0]}" class="card-img-top" alt="${tour.nome}">
                <div class="card-body">
                    <h5 class="card-title">${tour.nome}</h5>
                    <p class="card-text">${tour.descricao.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-primary">A partir de ${tour.valorBase}</span>
                        <button class="btn btn-outline-primary ver-pacote" data-id="${tour.id}">Ver Detalhes</button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
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
    document.getElementById('voltar-pacotes').addEventListener('click', function() {
        document.getElementById('pacotes').classList.remove('d-none');
        document.getElementById('detalhe-pacote').classList.add('d-none');
    });
    
    // Botão para reservar
    document.getElementById('reservar-btn').addEventListener('click', function() {
        const pacoteNome = document.getElementById('pacote-titulo').textContent;
        const mensagem = `Olá! Estou interessado no pacote "${pacoteNome}". Gostaria de mais informações e disponibilidade.`;
        const phoneNumber = '5500000000000'; // Substitua pelo número real da empresa
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensagem)}`, '_blank');
    });
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
    if (tour.videos && tour.videos.length > 0) {
        tour.videos.forEach(video => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `
                <video class="d-block w-100" controls>
                    <source src="assets/videos/${video}" type="video/mp4">
                    Seu navegador não suporta vídeos HTML5.
                </video>
            `;
            carouselInner.appendChild(item);
        });
    }
    
    // Atualiza a lista de itens inclusos
    const itensList = document.getElementById('pacote-itens');
    itensList.innerHTML = '';
    
    tour.incluso.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${item.item}
            <span class="badge ${item.valor === 'Incluso' ? 'bg-success' : 'bg-primary'} rounded-pill">${item.valor}</span>
        `;
        itensList.appendChild(li);
    });
    
    // Inicializa o mapa
    initMap(tour.localizacao);
    
    // Exibe a seção de detalhes e oculta a lista de pacotes
    document.getElementById('pacotes').classList.add('d-none');
    document.getElementById('detalhe-pacote').classList.remove('d-none');
    
    // Scroll para o topo da seção de detalhes
    document.getElementById('detalhe-pacote').scrollIntoView({ behavior: 'smooth' });
}

// Função para inicializar o mapa
function initMap(localizacao) {
    // Verifica se a API do Google Maps está carregada
    if (typeof google === 'undefined') {
        console.error('Google Maps API não está carregada.');
        return;
    }
    
    const mapElement = document.getElementById('pacote-mapa');
    const mapOptions = {
        center: { lat: localizacao.lat, lng: localizacao.lng },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    const map = new google.maps.Map(mapElement, mapOptions);
    
    // Adiciona um marcador na localização
    new google.maps.Marker({
        position: { lat: localizacao.lat, lng: localizacao.lng },
        map: map,
        title: localizacao.endereco
    });
}

// Exporta as funções para uso em outros arquivos
window.loadTours = loadTours;
window.initMap = initMap;