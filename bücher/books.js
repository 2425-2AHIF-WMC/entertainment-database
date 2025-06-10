const defaultBuecher = [
    {
        id: 'b1',
        titel: "Der Alchimist",
        bewertung: 8.5,
        beschreibung: "Ein philosophisches Buch von Paulo Coelho über die Suche nach dem eigenen Glück.",
        bild: "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg",
        seiten: 208,
        userRating: 0
    },
    {
        id: 'b2',
        titel: "1984",
        bewertung: 9.0,
        beschreibung: "George Orwells dystopischer Roman über totalitäre Überwachung.",
        bild: "https://images-na.ssl-images-amazon.com/images/I/81WcnNQ-TBL.jpg",
        seiten: 328,
        userRating: 0
    },
    {
        id: 'b3',
        titel: "Der Herr der Ringe",
        bewertung: 9.5,
        beschreibung: "Das epische Fantasy-Abenteuer von J.R.R. Tolkien.",
        bild: "https://images-na.ssl-images-amazon.com/images/I/91dSMhdIzTL.jpg",
        seiten: 1178,
        userRating: 0
    }
];

let buecher = [...defaultBuecher];
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Funktion zum Rendern der Bücher
function renderBuecher() {
    const buchList = document.getElementById('buch-list');
    buchList.innerHTML = '';
    buecher.forEach(buch => {
        const card = createBuchCard(buch);
        buchList.appendChild(card);
    });
}
// Funktion zum Erstellen einer Buchkarte
function createBuchCard(buch) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${buch.bild}" alt="${buch.titel}">
        <div class="card-content">
            <h3 class="card-title">${buch.titel}</h3>
            <p class="card-rating">Bewertung: ${buch.bewertung} ⭐</p>
            <p class="card-pages">Seiten: ${buch.seiten}</p>
            <p class="card-description">${buch.beschreibung}</p>
            <p>Deine Bewertung: </p>
            <div class="stars" data-id="${buch.id}">
                ${[1, 2, 3, 4, 5].map(i => `
                    <svg class="star ${buch.userRating >= i ? 'selected' : ''}" data-value="${i}" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.920 1.603-.920 1.902 0l1.286 3.966a1 1 0 00.95.690h4.175c.969 0 1.371 1.24.588 1.810l-3.380 2.455a1 1 0 00-.364 1.118l1.287 3.966c.300.921-.755 1.688-1.540 1.118l-3.380-2.455a1 1 0 00-1.175 0l-3.380 2.455c-.784.570-1.838-.197-1.540-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.340 9.393c-.783-.570-.380-1.810.588-1.810h4.175a1 1 0 00.950-.690l1.286-3.967z"/>
                    </svg>
                `).join('')}
            </div>
            <button class="add-watchlist-btn" data-id="${buch.id}">${watchlist.includes(buch.id) ? 'Von Watchlist entfernen' : 'Zur Watchlist hinzufügen'}</button>
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
    watchlist.forEach(buchId => {
        const buch = buecher.find(b => b.id === buchId);
        if (buch) {
            const li = document.createElement('li');
            li.className = 'watchlist-item';
            li.textContent = buch.titel;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', () => {
                removeFromWatchlist(buch.id);
            });
            li.appendChild(removeBtn);
            watchlistElement.appendChild(li);
        }
    });
}

function addToWatchlist(buchId) {
    if (!watchlist.includes(buchId)) {
        watchlist.push(buchId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        renderWatchlist();
        renderBuecher();
    }
}

function removeFromWatchlist(buchId) {
    watchlist = watchlist.filter(id => id !== buchId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist();
    renderBuecher();
}

document.getElementById('watchlistToggleBtn').addEventListener('click', () => {
    const watchlistPanel = document.getElementById('watchlistPanel');
    watchlistPanel.style.display = watchlistPanel.style.display === 'block' ? 'none' : 'block';
    renderWatchlist();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-watchlist-btn')) {
        const buchId = e.target.getAttribute('data-id');
        if (watchlist.includes(buchId)) {
            removeFromWatchlist(buchId);
            e.target.textContent = 'Zur Watchlist hinzufügen';
        } else {
            addToWatchlist(buchId);
            e.target.textContent = 'Von Watchlist entfernen';
        }
    }

    if (e.target.classList.contains('star')) {
        const buchId = e.target.parentElement.getAttribute('data-id');
        const rating = parseInt(e.target.getAttribute('data-value'));
        const buch = buecher.find(b => b.id === buchId);
        if (buch) {
            buch.userRating = rating; // Setze die Benutzerbewertung
            renderBuecher(); // Aktualisiere die Buchkarten
        }
    }
});

document.getElementById('addBuchBtn').addEventListener('click', () => {
    const titelInput = document.getElementById('titelInput').value;
    const bewertungInput = parseFloat(document.getElementById('bewertungInput').value);
    const beschreibungInput = document.getElementById('beschreibungInput').value;
    const bildInput = document.getElementById('bildInput').value;
    const seitenInput = parseInt(document.getElementById('seitenInput').value);

    if (titelInput && !isNaN(bewertungInput) && beschreibungInput && bildInput && !isNaN(seitenInput)) {
        const newBuch = {
            id: titelInput.toLowerCase().replace(/\s+/g, '-'),
            titel: titelInput,
            bewertung: bewertungInput,
            beschreibung: beschreibungInput,
            bild: bildInput,
            seiten: seitenInput,
            userRating: 0 // Initiale Benutzerbewertung
        };
        buecher.push(newBuch);
        renderBuecher();
        document.getElementById('titelInput').value = '';
        document.getElementById('bewertungInput').value = '';
        document.getElementById('beschreibungInput').value = '';
        document.getElementById('bildInput').value = '';
        document.getElementById('seitenInput').value = '';
    } else {
        alert('Bitte fülle alle Felder aus.');
    }
});

// Suchfunktion
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
    const buchList = document.getElementById('buch-list');
    buchList.innerHTML = ''; // Leere die Buch-Liste
    const filteredBooks = buecher.filter(buch => buch.titel.toLowerCase().includes(query));

    if (filteredBooks.length === 0) {
        buchList.innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
        return;
    }

    filteredBooks.forEach(buch => {
        const card = createBuchCard(buch);
        buchList.appendChild(card);
    });
}
// Initial render
renderBuecher();
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


