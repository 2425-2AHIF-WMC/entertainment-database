const defaultFilme = [
    {
        id: "inception",
        titel: "Inception",
        bewertung: 8.8,
        beschreibung: "Ein Traum im Traum. Ein Meisterwerk von Christopher Nolan, das mit ausgeklügelter Handlung fasziniert.",
        bild: "https://th.bing.com/th/id/R.69344c61a4a6d287887154402b6ec44c?rik=NSh%2fkMDTJYJN9Q&riu=http%3a%2f%2fimages2.fanpop.com%2fimage%2fphotos%2f14300000%2fInception-inception-2010-14355479-1680-1050.jpg&ehk=d15hpS8Rply6BEkzuLI%2fbahZQFk5IL8MKCn8JQSGv5I%3d&risl=&pid=ImgRaw&r=0",
        dauer: 148,
        userRating: 0
    },
    {
        id: "shawshank",
        titel: "The Shawshank Redemption",
        bewertung: 9.3,
        beschreibung: "Ein episches Drama über Hoffnung und Freundschaft im Gefängnis Shawshank.",
        bild: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        dauer: 142,
        userRating: 0
    },
    {
        id: "darkknight",
        titel: "The Dark Knight",
        bewertung: 9.0,
        beschreibung: "Der dunkle Ritter stellt sich dem Chaos in Gotham - mit brillantem Heath Ledger als Joker.",
        bild: "https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
        dauer: 152,
        userRating: 0
    },
    {
        id: "parasite",
        titel: "Parasite",
        bewertung: 8.6,
        beschreibung: "Ein Süd-Koreanischer Thriller über Klassenunterschiede der besonderen Art.",
        bild: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        dauer: 132,
        userRating: 0
    },
    {
        id: "interstellar",
        titel: "Interstellar",
        bewertung: 8.6,
        beschreibung: "Episches Sci-Fi-Drama über eine Reise durch Raum und Zeit, um die Menschheit zu retten.",
        bild: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
        dauer: 169,
        userRating: 0
    }
];

let filme = [...defaultFilme];
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Funktion zum Rendern der Filme
function renderFilme() {
    const filmList = document.getElementById('film-list');
    filmList.innerHTML = '';
    filme.forEach(film => {
        const card = createFilmCard(film);
        filmList.appendChild(card);
    });
}

// Funktion zum Erstellen einer Filmkarte
function createFilmCard(film) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${film.bild}" alt="${film.titel}">
        <div class="card-content">
            <h3 class="card-title">${film.titel}</h3>
            <p class="card-rating">Bewertung: ${film.bewertung} ⭐</p>
            <p class="card-duration">Dauer: ${film.dauer} Minuten</p>
            <p class="card-description">${film.beschreibung}</p>
            <p>Deine Bewertung: </p>
            <div class="stars" data-id="${film.id}">
                ${[1, 2, 3, 4, 5].map(i => `
                    <svg class="star ${film.userRating >= i ? 'selected' : ''}" data-value="${i}" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.920 1.603-.920 1.902 0l1.286 3.966a1 1 0 00.95.690h4.175c.969 0 1.371 1.24.588 1.810l-3.380 2.455a1 1 0 00-.364 1.118l1.287 3.966c.300.921-.755 1.688-1.540 1.118l-3.380-2.455a1 1 0 00-1.175 0l-3.380 2.455c-.784.570-1.838-.197-1.540-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.340 9.393c-.783-.570-.380-1.810.588-1.810h4.175a1 1 0 00.950-.690l1.286-3.967z"/>
                    </svg>
                `).join('')}
            </div>
            <button class="add-watchlist-btn" data-id="${film.id}">${watchlist.includes(film.id) ? 'Von Watchlist entfernen' : 'Zur Watchlist hinzufügen'}</button>
        </div>
    `;
    return card;
}

// Funktion zum Rendern der Watchlist
function renderWatchlist() {
    const watchlistElement = document.getElementById('watchlist');
    watchlistElement.innerHTML = '';
    if (watchlist.length === 0) {
        watchlistElement.innerHTML = '<li>Deine Watchlist ist leer.</li>';
        return;
    }
    watchlist.forEach(filmId => {
        const film = filme.find(f => f.id === filmId);
        if (film) {
            const li = document.createElement('li');
            li.className = 'watchlist-item';
            li.textContent = film.titel;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', () => {
                removeFromWatchlist(film.id);
            });
            li.appendChild(removeBtn);
            watchlistElement.appendChild(li);
        }
    });
}

// Funktion zum Hinzufügen zur Watchlist
function addToWatchlist(filmId) {
    if (!watchlist.includes(filmId)) {
        watchlist.push(filmId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
        renderFilme();
    }
}

// Funktion zum Entfernen aus der Watchlist
function removeFromWatchlist(filmId) {
    watchlist = watchlist.filter(id => id !== filmId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist();
    renderFilme();
}

// Event-Listener für den Watchlist-Button
document.getElementById('watchlistToggleBtn').addEventListener('click', () => {
    const watchlistPanel = document.getElementById('watchlistPanel');
    watchlistPanel.style.display = watchlistPanel.style.display === 'block' ? 'none' : 'block';
    renderWatchlist();
});

// Event-Listener für die Film-Interaktionen
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-watchlist-btn')) {
        const filmId = e.target.getAttribute('data-id');
        if (watchlist.includes(filmId)) {
            removeFromWatchlist(filmId);
            e.target.textContent = 'Zur Watchlist hinzufügen';
        } else {
            addToWatchlist(filmId);
            e.target.textContent = 'Von Watchlist entfernen';
        }
    }

    if (e.target.classList.contains('star')) {
        const filmId = e.target.parentElement.getAttribute('data-id');
        const rating = parseInt(e.target.getAttribute('data-value'));
        const film = filme.find(f => f.id === filmId);
        if (film) {
            film.userRating = rating; // Setze die Benutzerbewertung
            renderFilme(); // Aktualisiere die Filmkarten
        }
    }
});

// Event-Listener für das Hinzufügen eines neuen Films
document.getElementById('addFilmBtn').addEventListener('click', () => {
    const titelInput = document.getElementById('titelInput').value;
    const bewertungInput = parseFloat(document.getElementById('bewertungInput').value);
    const beschreibungInput = document.getElementById('beschreibungInput').value;
    const bildInput = document.getElementById('bildInput').value;
    const dauerInput = parseInt(document.getElementById('dauerInput').value);

    if (titelInput && !isNaN(bewertungInput) && beschreibungInput && bildInput && !isNaN(dauerInput)) {
        const newFilm = {
            id: titelInput.toLowerCase().replace(/\s+/g, '-'),
            titel: titelInput,
            bewertung: bewertungInput,
            beschreibung: beschreibungInput,
            bild: bildInput,
            dauer: dauerInput,
            userRating: 0 // Initiale Benutzerbewertung
        };
        filme.push(newFilm);
        renderFilme();
        clearFilmInputs();
    } else {
        alert('Bitte fülle alle Felder aus.');
    }
});

// Funktion zum Leeren der Eingabefelder
function clearFilmInputs() {
    document.getElementById('titelInput').value = '';
    document.getElementById('bewertungInput').value = '';
    document.getElementById('beschreibungInput').value = '';
    document.getElementById('bildInput').value = '';
    document.getElementById('dauerInput').value = '';
}
// ... (der vorherige Code bleibt unverändert)

const searchInput = document.getElementById('searchInput');

// Event-Listener für die Suche
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    filterAndRender(query);
    // Blende das Formular aus, wenn der Benutzer mit dem Tippen beginnt
    const formSection = document.getElementById('form-section');
    formSection.style.display = query ? 'none' : 'block';
});

// Funktion zum Filtern und Rendern der Suchergebnisse
function filterAndRender(query) {
    const filmList = document.getElementById('film-list');
    filmList.innerHTML = ''; // Leere die Film-Liste
    const filteredFilme = filme.filter(film => film.titel.toLowerCase().includes(query));

    if (filteredFilme.length === 0) {
        filmList.innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
        return;
    }

    filteredFilme.forEach(film => {
        const card = createFilmCard(film);
        filmList.appendChild(card);
    });
}

// ... (der restliche Code bleibt unverändert)


// Initial render
renderFilme();
renderWatchlist();
// Optional: Add more bubbles dynamically
function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const size = Math.random() * 30 + 15; // Random size between 15-45px
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.animationDuration = (Math.random() * 8 + 10) + 's'; // Random duration 10-18s
    bubble.style.animationDelay = Math.random() * 5 + 's';

    document.querySelector('.bubble-container').appendChild(bubble);

    // Remove bubble after animation
    setTimeout(() => {
        bubble.remove();
    }, 20000);
}

// Create new bubbles every few seconds
setInterval(createBubble, 3000);
let currentUser  = null;
let isLoginMode = true;
let appData = null;