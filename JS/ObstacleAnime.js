import { ObjetGraphique } from './ObjetGraphique.js';

/**
 * Les ennemis qui bougent
 */
export class ObstacleAnime extends ObjetGraphique {
    constructor(x, y) {
        super(x, y, 30, 30);
        this.vitesse = 3;
        this.direction = 1;
        this.distance = 100;
        this.depart = { x, y };
    }

    update() {
        this.x += this.vitesse * this.direction;
        
        if (Math.abs(this.x - this.depart.x) > this.distance) {
            this.direction *= -1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
    }
}