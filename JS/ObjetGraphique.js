/**
 * Classe de base pour tous les objets du jeu
 */
export class ObjetGraphique {
    constructor(x, y, largeur, hauteur) {
        this.x = x;
        this.y = y;
        this.largeur = largeur;
        this.hauteur = hauteur;
    }

    // Vérifie si deux objets se touchent
    toucheAutreObjet(autre) {
        return this.x < autre.x + autre.largeur &&
               this.x + this.largeur > autre.x &&
               this.y < autre.y + autre.hauteur &&
               this.y + this.hauteur > autre.y;
    }
}