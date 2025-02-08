import { Game } from './Game.js';

// Bonne pratique : avoir une fonction appelée une fois
// que la page est prête, que le DOM est chargé, etc.
window.onload = init;

// Variables globales pour le jeu
let game, timerBar, levelDisplay;
let timeLeft = 60; // 60 secondes par niveau
const totalTime = 60;

async function init() {
    // On récupère les éléments du DOM
    const canvas = document.querySelector("#gameCanvas");
    timerBar = document.querySelector('.timer-bar');
    levelDisplay = document.getElementById('currentLevel');

    // On crée une instance du jeu
    game = new Game(canvas);
    
    // Configuration du jeu
    setupGameEvents();
    setupTimer();

    // On démarre le jeu
    game.demarrer();
}

function setupGameEvents() {
    game.onLevelComplete = () => {
        timeLeft = totalTime;
        timerBar.style.backgroundColor = '#4CAF50';
    };
}

function setupTimer() {
    function updateTimer() {
        const percentage = (timeLeft / totalTime) * 100;
        timerBar.style.width = `${percentage}%`;
        
        // Change la couleur en fonction du temps restant
        if (percentage > 60) {
            timerBar.style.backgroundColor = '#4CAF50'; // Vert
        } else if (percentage > 30) {
            timerBar.style.backgroundColor = '#FFC107'; // Jaune
        } else {
            timerBar.style.backgroundColor = '#F44336'; // Rouge
        }

        levelDisplay.textContent = game.niveau;

        if (timeLeft <= 0) {
            game.gameOver();
        } else {
            timeLeft--;
        }
    }

    setInterval(updateTimer, 1000);
}