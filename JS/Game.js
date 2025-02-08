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
    const vitesseActuelle = Math.hypot(this.vitesseJoueur.x, this.vitesseJoueur.y);
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
        nouveauX = Math.max(0, Math.min(this.canvas.width - this.joueur.largeur, nouveauX));
    }
    if (nouveauY < 0 || nouveauY > this.canvas.height - this.joueur.hauteur) {
        this.vitesseJoueur.y *= -0.5;
        nouveauY = Math.max(0, Math.min(this.canvas.height - this.joueur.hauteur, nouveauY));
    }

    

  }




  /**
   * Dessiner les éléments du jeu
   */
  draw() {}
}
