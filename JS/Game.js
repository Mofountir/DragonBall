import { Monstre } from "./Monstre.js";
import { Obstacle } from "./Obstacle.js";
import { ObstacleAnime } from "./ObstacleAnime.js";
import { Exit } from "./Exit.js";
import { EcouteurClavier } from "./EcouteurClavier.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Initialisation des éléments du jeu
    this.joueur = new Monstre(50, 50);
    this.dragonBall = new Exit(700, 500);
    this.niveau = 1;
    this.gameOverState = false;
    this.onLevelComplete = null;

    this.obstacles = [];
    this.ennemis = [];
    this.vitesseJoueur = { x: 0, y: 0 };
    this.friction = 0.85;
    this.acceleration = 1.2;

    // Initialisation de l'écouteur clavier
    this.ecouteurClavier = new EcouteurClavier();
  }

  /**
   * Met à jour les éléments du jeu
   */

  update() {
    if (this.gameOverState) return;

    // Update de la vitesse en utilisant l'écouteur clavier
    if (this.ecouteurClavier.estTouchePressee("ArrowLeft"))
      this.vitesseJoueur.x -= this.acceleration;
    if (this.ecouteurClavier.estTouchePressee("ArrowRight"))
      this.vitesseJoueur.x += this.acceleration;
    if (this.ecouteurClavier.estTouchePressee("ArrowUp"))
      this.vitesseJoueur.y -= this.acceleration;
    if (this.ecouteurClavier.estTouchePressee("ArrowDown"))
      this.vitesseJoueur.y += this.acceleration;

    // Friction
    this.vitesseJoueur.x *= this.friction;
    this.vitesseJoueur.y *= this.friction;

    // Limite de vitesse
    const vitesseMax = 8;
    const vitesseActuelle = Math.hypot(
      this.vitesseJoueur.x,
      this.vitesseJoueur.y
    );
    if (vitesseActuelle > vitesseMax) {
      const ratio = vitesseMax / vitesseActuelle;
      this.vitesseJoueur.x *= ratio;
      this.vitesseJoueur.y *= ratio;
    }

    // Nouvelle position
    let nouveauX = this.joueur.x + this.vitesseJoueur.x;
    let nouveauY = this.joueur.y + this.vitesseJoueur.y;

    // Collisions avec les bords
    if (nouveauX < 0 || nouveauX > this.canvas.width - this.joueur.largeur) {
      this.vitesseJoueur.x *= -0.5;
      nouveauX = Math.max(
        0,
        Math.min(this.canvas.width - this.joueur.largeur, nouveauX)
      );
    }
    if (nouveauY < 0 || nouveauY > this.canvas.height - this.joueur.hauteur) {
      this.vitesseJoueur.y *= -0.5;
      nouveauY = Math.max(
        0,
        Math.min(this.canvas.height - this.joueur.hauteur, nouveauY)
      );
    }

    // Collisions avec les obstacles
    let collision = false;
    for (const obstacle of this.obstacles) {
      if (
        this.checkCollision(
          {
            x: nouveauX,
            y: nouveauY,
            largeur: this.joueur.largeur,
            hauteur: this.joueur.hauteur,
          },
          obstacle
        )
      ) {
        collision = true;
        this.joueur.declencherCollision();
        this.vitesseJoueur.x *= -0.5;
        this.vitesseJoueur.y *= -0.5;
        break;
      }
    }

    if (!collision) {
      this.joueur.x = nouveauX;
      this.joueur.y = nouveauY;
    }

    // Update et collisions avec les ennemis
    for (const ennemi of this.ennemis) {
      ennemi.update();

      if (this.checkCollision(this.joueur, ennemi)) {
        this.joueur.retourDepart();
        this.vitesseJoueur = { x: 0, y: 0 };
      }
    }
    // Vérification Dragon Ball atteinte
    if (this.checkCollision(this.joueur, this.dragonBall)) {
      this.niveau++;
      this.joueur.retourDepart();
      this.vitesseJoueur = { x: 0, y: 0 };
      this.initLevel();
      if (this.onLevelComplete) this.onLevelComplete();
    }

    // Update des animations
    if (typeof this.joueur.update === "function") this.joueur.update();
    if (typeof this.dragonBall.update === "function") this.dragonBall.update();
  }

  /**
   * Initialiser un niveau
   */

  initLevel() {
    // Reset des tableaux
    this.obstacles = [];
    this.ennemis = [];

    // Création des obstacles
    const nombreObstacles = 5 + this.niveau * 2;
    for (let i = 0; i < nombreObstacles; i++) {
      const x = 100 + Math.random() * (this.canvas.width - 200);
      const y = 100 + Math.random() * (this.canvas.height - 200);

      if (!this.estTropProche(x, y)) {
        this.obstacles.push(new Obstacle(x, y));
      }
    }

    // Création des ennemis
    const nombreEnnemis = 2 + Math.floor(this.niveau * 1.5);
    for (let i = 0; i < nombreEnnemis; i++) {
      const x = 100 + Math.random() * (this.canvas.width - 200);
      const y = 100 + Math.random() * (this.canvas.height - 200);

      if (!this.estTropProche(x, y)) {
        const ennemi = new ObstacleAnime(x, y);
        ennemi.vitesse = 2 + this.niveau * 0.5;
        ennemi.distance = 100 + Math.random() * 100;
        this.ennemis.push(ennemi);
      }
    }

    // Position de la Dragon Ball
    do {
      this.dragonBall.x = 100 + Math.random() * (this.canvas.width - 200);
      this.dragonBall.y = 100 + Math.random() * (this.canvas.height - 200);
    } while (this.estTropProche(this.dragonBall.x, this.dragonBall.y));
  }

  // verifier les collisions
  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.largeur &&
      rect1.x + rect1.largeur > rect2.x &&
      rect1.y < rect2.y + rect2.hauteur &&
      rect1.y + rect1.hauteur > rect2.y
    );
  }

  /**
   * Vérifier si un point est trop proche des obstacles
   */
  estTropProche(x, y, distance = 100) {
    if (Math.hypot(x - this.joueur.x, y - this.joueur.y) < distance)
      return true;

    for (const obstacle of this.obstacles) {
      if (Math.hypot(x - obstacle.x, y - obstacle.y) < 60) return true;
    }

    for (const ennemi of this.ennemis) {
      if (Math.hypot(x - ennemi.x, y - ennemi.y) < 60) return true;
    }

    return false;
  }

  /**
   * Dessiner les éléments du jeu
   */
  draw() {
    // Fond
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Éléments du jeu
    this.obstacles.forEach((obstacle) => {
      if (typeof obstacle.draw === "function") {
        obstacle.draw(this.ctx);
      }
    });
    this.ennemis.forEach((ennemi) => {
      if (typeof ennemi.draw === "function") {
        ennemi.draw(this.ctx);
      }
    });
    if (typeof this.dragonBall.draw === "function") {
      this.dragonBall.draw(this.ctx);
    }
    if (typeof this.joueur.draw === "function") {
      this.joueur.draw(this.ctx);
    }
  }

  /**
   * Start & game over
   */

  gameOver() {
    this.gameOverState = true;
  }

  demarrer() {
    this.initLevel();
    const gameLoop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }
}
