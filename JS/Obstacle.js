import { ObjetGraphique } from './ObjetGraphique.js';

/**
 * Les obstacles (rochers)
 */
export class Obstacle extends ObjetGraphique {
    constructor(x, y) {
        super(x, y, 40, 40);
    }

    // Renommé de dessiner à draw
    draw(ctx) {
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x, this.y, this.largeur, this.hauteur);
    }
}