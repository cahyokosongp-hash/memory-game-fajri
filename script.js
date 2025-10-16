// Data kartu foto (duplikat untuk pair)
const animals = ['berangkat.jpeg', 'diam.jpeg', 'keseimbangan.jpeg', 'nanya.jpeg', 'setuju.jpeg', 'tawa.jpeg']; // Tambah jika perlu untuk level sulit

let board = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let score = 1000; // Skor dasar, bertambah 100 per match
let timerInterval;
let gameStarted = false;
let levelSize = 4; // Default sedang (4x4 = 8 pairs)

// Element references
const gameBoard = document.getElementById('gameBoard');
const levelSelect = document.getElementById('level');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const starsEl = document.getElementById('stars');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

levelSelect.addEventListener('change', (e) => {
    if (gameStarted) return; // Jangan ganti level saat main
    if (e.target.value === 'easy') levelSize = 2;
    else if (e.target.value === 'medium') levelSize = 4;
    else levelSize = 6;
});

// Fungsi mulai game
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    moves = 0;
    timer = 0;
    matchedPairs = 0;
    score = 1000; // Reset skor dasar
    flippedCards = [];
    updateDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = formatTime(timer);
        updateDisplay(); // Update skor real-time dengan timer
    }, 1000);
    
    initBoard();
}

// Fungsi reset
function resetGame() {
    gameStarted = false;
    clearInterval(timerInterval);
    timer = 0;
    moves = 0;
    matchedPairs = 0;
    score = 1000;
    flippedCards = [];
    timerEl.textContent = '00:00';
    movesEl.textContent = '0';
    starsEl.textContent = '1000';
    gameBoard.innerHTML = '';
    startBtn.textContent = 'Mulai';
}

// Inisialisasi board
function initBoard() {
    board = [];
    const pairsNeeded = (levelSize * levelSize) / 2;
    const selectedAnimals = animals.slice(0, pairsNeeded);
    const cards = [...selectedAnimals, ...selectedAnimals]; // Duplikat untuk pair
    shuffleArray(cards);
    
    gameBoard.style.gridTemplateColumns = `repeat(${levelSize}, 1fr)`;
    gameBoard.innerHTML = '';
    
    cards.forEach((animal, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.animal = animal;
        card.dataset.index = index;
        const img = document.createElement('img');
        img.src = animal;
        img.alt = animal.replace('.jpeg', '');
        img.style.display = 'none'; // Sembunyikan gambar awalnya
        card.appendChild(img);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Flip kartu
function flipCard(e) {
    if (flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched') || !gameStarted) return;

    this.classList.add('flipped');
    const img = this.querySelector('img');
    img.style.display = 'block'; // Tampilkan gambar saat flip
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        checkMatch();
        updateDisplay();
    }
}

// Cek match
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.animal === card2.dataset.animal) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++; // Tambah matched pairs
        updateDisplay(); // Update skor setelah match
        if (matchedPairs === (levelSize * levelSize) / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            const img1 = card1.querySelector('img');
            const img2 = card2.querySelector('img');
            img1.style.display = 'none';
            img2.style.display = 'none';
        }, 1000);
    }
    flippedCards = [];
}

// Akhiri game
function endGame() {
    gameStarted = false;
    clearInterval(timerInterval);
    // Hitung skor final: dasar + 100 per match - penalti moves
    let finalScore = Math.max(0, 1000 + (matchedPairs * 200) - (moves * 50));
    starsEl.textContent = Math.floor(finalScore);
    alert(`Selamat! Selesai dalam ${moves} langkah dan ${formatTime(timer)}. Skor: ${starsEl.textContent}`);
}

// Update display
function updateDisplay() {
    movesEl.textContent = moves;
    // Update skor real-time: dasar + 100 per match - penalti
    let tempScore = Math.max(0, 1000 + (matchedPairs * 200) - (moves * 50));
    starsEl.textContent = Math.floor(tempScore);
}

// Format waktu
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
