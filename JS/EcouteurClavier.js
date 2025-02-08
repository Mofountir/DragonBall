/**
 * Gère les entrées clavier du jeu
 */
export class EcouteurClavier {
    constructor() {
        this.touches = {};
        this.initialiserEcouteurs();
    }

    initialiserEcouteurs() {
        window.addEventListener('keydown', (e) => this.touches[e.key] = true);
        window.addEventListener('keyup', (e) => this.touches[e.key] = false);
    }

    estTouchePressee(touche) {
        return this.touches[touche] || false;
    }
}