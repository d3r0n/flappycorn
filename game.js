const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.text('unicorn', 'assets/unicorn.txt');  // ASCII unicorn
    this.load.text('pipe', 'assets/pipe.txt');        // ASCII pipe, could be a simple '|'
}

function create() {
    // Setup the ASCII art unicorn
    let unicornArt = this.cache.text.get('unicorn');
    this.unicorn = this.add.text(100, this.sys.game.config.height / 2, unicornArt, {
        font: '16px monospace',
        fill: '#ffffff'
    });
    this.physics.world.enable(this.unicorn);
    this.unicorn.body.setGravityY(1000);
    this.unicorn.body.setSize(40, 40, false);  // Adjust collision body if necessary

    // Unicorn flap input
    this.input.on('pointerdown', () => this.unicorn.body.setVelocityY(-400), this);

    // Obstacles setup
    this.pipes = this.add.group({ classType: Phaser.GameObjects.Text });
    this.time.addEvent({
        delay: 1500,
        callback: () => {
            let y = Math.random() > 0.5 ? 100 : 500;  // Randomly place top or bottom
            let pipeArt = this.cache.text.get('pipe');
            let pipe = this.pipes.create(800, y, pipeArt, {
                font: '18px monospace',
                fill: '#ff0000'
            });
            this.physics.world.enable(pipe);
            pipe.body.setVelocityX(-200);
            pipe.body.immovable = true;
            pipe.body.allowGravity = false;
        },
        loop: true
    });

    // Collision detection
    this.physics.add.collider(this.unicorn, this.pipes, () => this.scene.restart(), null, this);
}


function update() {
    if (this.unicorn.y > 600 || this.unicorn.y < 0) {
        this.scene.restart();  // Restart the game if the unicorn goes out of bounds
    }
}

function restartGame() {
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.restart(); // restart current scene
}