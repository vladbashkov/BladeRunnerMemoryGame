class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        // 1. загрузить бэкграунд
        this.load.image('bladerunner', 'assets/sprites/background.jpg');
        this.load.image('card', 'assets/sprites/card.jpg');
        
        this.load.image('card1', 'assets/sprites/card1.jpg');
        this.load.image('card2', 'assets/sprites/card2.jpg');
        this.load.image('card3', 'assets/sprites/card3.jpg');
        this.load.image('card4', 'assets/sprites/card4.jpg');
        this.load.image('card5', 'assets/sprites/card5.jpg');

    }

    create() {
        // 2. вывести бэкграунд 
        this.createBackground();
        this.createCards();
        this.start();
    }

    start() {
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.initCrads();
        this.showCards();
    }

    restart() {
        let count = 0;
        let onCardMoveComplete = () => {
            ++count;
            if(count >= this.cards.length) {
                this.start(); 
            }

        };
        this.cards.forEach(card => {
            card.move({
                x: this.sys.game.config.width + card.width,
                y: this.sys.game.config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            })
        })
    }

    initCrads() {
        let positions = this.getCardsPositions();
        this.cards.forEach(card => {
            card.init(positions.pop());
        });
    }

    showCards() {
        this.cards.forEach(card => {
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay 
            })
        })
    }

    createBackground() {
        this.add.sprite(0, 0, 'bladerunner').setOrigin(0, 0);
    }

    createCards() {
        this.cards = [];

        for(let value of config.cards) {
            for(let i=0; i<2; i++) {
                this.cards.push(new Card(this, value));
            }
        }

        this.input.on("gameobjectdown", this.onCardClicked, this)
    }

    onCardClicked(pointer, card) {
        if(card.opened) {
            return false;
        }

        if(this.openedCard) {
            if(this.openedCard.value === card.value) {
                this.openedCard = null;
                ++this.openedCardsCount;
            } else {
                this.openedCard.close();
                this.openedCard = card;
            }
        } else {
            this.openedCard = card;
        }

        card.open();

        if(this.openedCardsCount === this.cards.length / 2) {
            this.restart();
        }
    }

    getCardsPositions() {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 10;
        let cardHeight = cardTexture.height + 10;
        let offsetX = ( this.sys.game.config.width - cardWidth * config.cols ) / 2 + cardWidth / 2;
        let offsetY = ( this.sys.game.config.height - cardHeight * config.rows ) / 2 + cardHeight / 2;
        let id = 0;

        for(let row = 0; row<config.rows; row++) {
            for(let col = 0; col<config.cols; col++) {
                positions.push({
                    delay: ++id * 150,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight
                })
            }
        }
        return Phaser.Utils.Array.Shuffle(positions);
    }
}
