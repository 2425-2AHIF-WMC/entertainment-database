const url = "http://localhost:3000/filme";

let filme = [];
let watchlist = [];

async function getMovies() {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
}

async function init() {
    try {
        filme = await getMovies();
        watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        renderFilme();
        renderWatchlist();
    } catch (error) {
        console.error("Fehler beim Laden der Filme:", error);
        document.getElementById('film-list').innerHTML = '<p>Filme konnten nicht geladen werden.</p>';
    }
}

function renderFilme() {
    const filmList = document.getElementById('film-list');
    filmList.innerHTML = '';
    filme.forEach(film => {
        const card = createFilmCard(film);
        filmList.appendChild(card);
    });
}

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
            <button class="add-watchlist-btn" data-id="${film.id}">
                ${watchlist.includes(film.id) ? 'Von Watchlist entfernen' : 'Zur Watchlist hinzufügen'}
            </button>
        </div>
    `;
    return card;
}

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

function addToWatchlist(filmId) {
    if (!watchlist.includes(filmId)) {
        watchlist.push(filmId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
        renderFilme();
    }
}

function removeFromWatchlist(filmId) {
    watchlist = watchlist.filter(id => id !== filmId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist();
    renderFilme();
}

document.getElementById('watchlistToggleBtn').addEventListener('click', () => {
    const watchlistPanel = document.getElementById('watchlistPanel');
    watchlistPanel.style.display = watchlistPanel.style.display === 'block' ? 'none' : 'block';
    renderWatchlist();
});

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
            film.userRating = rating;
            renderFilme();
        }
    }
});

document.getElementById('addFilmBtn').addEventListener('click', async () => {
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
            userRating: 0
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFilm)
            });
            if (!response.ok) throw new Error("Film konnte nicht gespeichert werden.");
            filme.push(newFilm);
            renderFilme();
            clearFilmInputs();
        } catch (error) {
            alert("Fehler beim Speichern des Films.");
            console.error(error);
        }
    } else {
        alert('Bitte fülle alle Felder aus.');
    }
});

function clearFilmInputs() {
    document.getElementById('titelInput').value = '';
    document.getElementById('bewertungInput').value = '';
    document.getElementById('beschreibungInput').value = '';
    document.getElementById('bildInput').value = '';
    document.getElementById('dauerInput').value = '';
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    filterAndRender(query);
    const formSection = document.getElementById('form-section');
    formSection.style.display = query ? 'none' : 'block';
});

function filterAndRender(query) {
    const filmList = document.getElementById('film-list');
    filmList.innerHTML = '';
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

// Start der App
init();
