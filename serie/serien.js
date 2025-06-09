// Beispiel-Serien mit Staffeln als Zahl
const defaultSerien = [
    {
        id: 's1',
        titel: "Breaking Bad",
        bewertung: 9.5,
        beschreibung: "Ein Chemielehrer wird zum Meth-Koch in dieser preisgekrönten Drama-Serie.",
        bild: "https://upload.wikimedia.org/wikipedia/en/6/61/Breaking_Bad_title_card.png",
        staffeln: 5,
        userRating: 0
    },
    {
        id: 's2',
        titel: "Game of Thrones",
        bewertung: 9.3,
        beschreibung: "Episches Fantasy-Drama um Machtkämpfe in den sieben Königreichen.",
        bild: "https://upload.wikimedia.org/wikipedia/en/d/d8/Game_of_Thrones_title_card.jpg",
        staffeln: 8,
        userRating: 0
    },
    {
        id: 's3',
        titel: "Stranger Things",
        bewertung: 8.8,
        beschreibung: "Mysteriöse Abenteuer und das Übernatürliche in einer Kleinstadt der 80er.",
        bild: "https://upload.wikimedia.org/wikipedia/en/f/f7/Stranger_Things_season_4.jpg",
        staffeln: 4,
        userRating: 0
    }
];

let serien = [...defaultSerien];
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function renderSerien() {
    const serieList = document.getElementById('serie-list');
    serieList.innerHTML = '';
    serien.forEach(serie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
                <img src="${serie.bild}" alt="${serie.titel}">
                <div class="card-content">
                    <h3 class="card-title">${serie.titel}</h3>
                    <p class="card-rating">Bewertung: ${serie.bewertung} ⭐</p>
                    <p class="card-seasons">Staffeln: ${serie.staffeln}</p>
                    <p class="card-description">${serie.beschreibung}</p>
                    <p>Deine Bewertung: </p>
                    <div class="stars" data-id="${serie.id}">
                        ${[1, 2, 3, 4, 5].map(i => `
                            <svg class="star ${serie.userRating >= i ? 'selected' : ''}" data-value="${i}" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.920 1.603-.920 1.902 0l1.286 3.966a1 1 0 00.95.690h4.175c.969 0 1.371 1.24.588 1.810l-3.380 2.455a1 1 0 00-.364 1.118l1.287 3.966c.300.921-.755 1.688-1.540 1.118l-3.380-2.455a1 1 0 00-1.175 0l-3.380 2.455c-.784.570-1.838-.197-1.540-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.340 9.393c-.783-.570-.380-1.810.588-1.810h4.175a1 1 0 00.950-.690l1.286-3.967z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <button class="add-watchlist-btn" data-id="${serie.id}">${watchlist.includes(serie.id) ? 'Von Watchlist entfernen' : 'Zur Watchlist hinzufügen'}</button>
                </div>
            `;
        serieList.appendChild(card);
    });
}

function renderWatchlist() {
    const watchlistElement = document.getElementById('watchlist');
    watchlistElement.innerHTML = '';
    if (watchlist.length === 0) {
        watchlistElement.innerHTML = '<li>Deine Watchlist ist leer.</li>';
        return;
    }
    watchlist.forEach(serieId => {
        const serie = serien.find(s => s.id === serieId);
        if (serie) {
            const li = document.createElement('li');
            li.className = 'watchlist-item';
            li.textContent = serie.titel;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', () => {
                removeFromWatchlist(serie.id);
            });
            li.appendChild(removeBtn);
            watchlistElement.appendChild(li);
        }
    });
}

function addToWatchlist(serieId) {
    if (!watchlist.includes(serieId)) {
        watchlist.push(serieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
        renderSerien();
    }
}

function removeFromWatchlist(serieId) {
    watchlist = watchlist.filter(id => id !== serieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist();
    renderSerien();
}

document.getElementById('watchlistToggleBtn').addEventListener('click', () => {
    const watchlistPanel = document.getElementById('watchlistPanel');
    watchlistPanel.style.display = watchlistPanel.style.display === 'block' ? 'none' : 'block';
    renderWatchlist();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-watchlist-btn')) {
        const serieId = e.target.getAttribute('data-id');
        if (watchlist.includes(serieId)) {
            removeFromWatchlist(serieId);
            e.target.textContent = 'Zur Watchlist hinzufügen';
        } else {
            addToWatchlist(serieId);
            e.target.textContent = 'Von Watchlist entfernen';
        }
    }

    if (e.target.classList.contains('star')) {
        const serieId = e.target.parentElement.getAttribute('data-id');
        const rating = parseInt(e.target.getAttribute('data-value'));
        const serie = serien.find(s => s.id === serieId);
        if (serie) {
            serie.userRating = rating; // Setze die Benutzerbewertung
            renderSerien(); // Aktualisiere die Serienkarten
        }
    }
});

document.getElementById('addSerieBtn').addEventListener('click', () => {
    const titelInput = document.getElementById('titelInput').value;
    const bewertungInput = parseFloat(document.getElementById('bewertungInput').value);
    const beschreibungInput = document.getElementById('beschreibungInput').value;
    const bildInput = document.getElementById('bildInput').value;
    const staffelnInput = parseInt(document.getElementById('staffelnInput').value);

    if (titelInput && !isNaN(bewertungInput) && beschreibungInput && bildInput && !isNaN(staffelnInput)) {
        const newSerie = {
            id: titelInput.toLowerCase().replace(/\s+/g, '-'),
            titel: titelInput,
            bewertung: bewertungInput,
            beschreibung: beschreibungInput,
            bild: bildInput,
            staffeln: staffelnInput,
            userRating: 0 // Initiale Benutzerbewertung
        };
        serien.push(newSerie);
        renderSerien();
        document.getElementById('titelInput').value = '';
        document.getElementById('bewertungInput').value = '';
        document.getElementById('beschreibungInput').value = '';
        document.getElementById('bildInput').value = '';
        document.getElementById('staffelnInput').value = '';
    } else {
        alert('Bitte fülle alle Felder aus.');
    }
});

// Initial render
renderSerien();
renderWatchlist();