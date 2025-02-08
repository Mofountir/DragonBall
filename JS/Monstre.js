/**
 * Classe Monstre: Mijin Buu
 */


import { ObjetGraphique } from './ObjetGraphique.js';

export class Monstre extends ObjetGraphique {
    constructor(x, y) {
        super(x, y, 40, 40);
        this.vitesse = 5;
        this.positionDepart = { x, y };
        this.angleYeux = 0;
        this.effetCollision = {
            actif: false,
            echelle: 1,
            rotation: 0
        };
        this.aura = 0;
        this.angleAntenne = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.largeur/2, this.y + this.hauteur/2);

        // Effet de collision
        if (this.effetCollision.actif) {
            ctx.rotate(this.effetCollision.rotation);
            ctx.scale(this.effetCollision.echelle, this.effetCollision.echelle);
        }

        // Aura de ki
        if (this.aura > 0) {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30 + this.aura * 15);
            gradient.addColorStop(0, 'rgba(255, 192, 203, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 192, 203, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, 30 + this.aura * 15, 0, Math.PI * 2);
            ctx.fill();
        }

        // Corps principal (rose)
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        // Antenne de Buu
        this.angleAntenne += 0.05;
        const decalageAntenne = Math.sin(this.angleAntenne) * 2;
        ctx.strokeStyle = '#FFB6C1';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.quadraticCurveTo(
            decalageAntenne, -25,
            decalageAntenne, -35
        );
        ctx.stroke();

        // Boule de l'antenne
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(decalageAntenne, -35, 4, 0, Math.PI * 2);
        ctx.fill();

        // Yeux
        this.angleYeux += 0.1;
        const decalageYeux = Math.sin(this.angleYeux) * 2;
        
        // Contour des yeux (noir)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-7, decalageYeux - 2, 5, 0, Math.PI * 2);
        ctx.arc(7, decalageYeux - 2, 5, 0, Math.PI * 2);
        ctx.fill();

        // Blanc des yeux
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-7, decalageYeux - 2, 3, 0, Math.PI * 2);
        ctx.arc(7, decalageYeux - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Trous de vapeur
        ctx.fillStyle = '#FF69B4';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-10 + i * 10, -12, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Expression
        if (this.effetCollision.actif) {
            // Expression fâchée
            ctx.strokeStyle = '#FF69B4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-8, 8);
            ctx.lineTo(8, 8);
            ctx.stroke();
        } else {
            // Sourire maléfique
            ctx.strokeStyle = '#FF69B4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 5, 8, 0, Math.PI, false);
            ctx.stroke();
        }

        ctx.restore();
    }

    update() {
        if (this.effetCollision.actif) {
            this.effetCollision.echelle += (1 - this.effetCollision.echelle) * 0.2;
            this.effetCollision.rotation *= 0.8;
            
            if (Math.abs(this.effetCollision.echelle - 1) < 0.01) {
                this.effetCollision.actif = false;
                this.effetCollision.echelle = 1;
                this.effetCollision.rotation = 0;
            }
        }

        this.aura = Math.max(0, this.aura - 0.02);
    }

    declencherCollision() {
        this.effetCollision.actif = true;
        this.effetCollision.echelle = 1.3;
        this.effetCollision.rotation = (Math.random() - 0.5) * 0.5;
        this.aura = 1;
    }

    retourDepart() {
        this.x = this.positionDepart.x;
        this.y = this.positionDepart.y;
        this.declencherCollision();
    }
}