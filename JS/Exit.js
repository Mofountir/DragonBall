/**
 * Classe Exit: Dragon Ball
 */

import { ObjetGraphique } from './ObjetGraphique.js';

export class Exit extends ObjetGraphique {
    constructor(x, y) {
        super(x, y, 40, 40);
        this.angle = 0;
        this.brillance = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + 20, this.y + 20);
        this.angle += 0.02;
        this.brillance = Math.sin(this.angle) * 20;

        // Effet de brillance
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = this.brillance;

        // Dragon Ball
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        gradient.addColorStop(0, '#ffd700');
        gradient.addColorStop(1, '#ff9f1a');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        // Étoiles
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const etoileAngle = this.angle + (i * Math.PI / 2);
            const x = Math.cos(etoileAngle) * 8;
            const y = Math.sin(etoileAngle) * 8;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

}