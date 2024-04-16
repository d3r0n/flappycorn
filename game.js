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
    this.unicorn.body.setSize(40, 40, false);  // Adjust collision body if n

    // Unicorn flap input
    this.input.on('pointerdown', () => this.unicorn.body.setVelocityY(-400), this);

    // Pipe creation with random placement and spacing
    this.pipes = this.add.group({ classType: Phaser.GameObjects.Text });
    this.time.addEvent({
        delay: 2500,  // Adjust timing for better game flow
        callback: createPipes,
        callbackScope: this,
        loop: true
    });

    // Collision detection
    this.physics.add.collider(this.unicorn, this.pipes, () => this.scene.restart(), null, this);
}

// Function to create top and bottom pipes ensuring enough space for the unicorn
function createPipes() {
    const gap = 150;  // Minimum gap size for the unicorn to pass
    const pipeHeight = 200; // Height of each pipe, adjust as needed
    const pipeWidth = 40; // Width of the pipe based on the ASCII character width
    let position = Phaser.Math.Between(gap + pipeHeight, 600 - gap - pipeHeight); // Ensure pipes fit on screen

    // ASCII art for pipes, forming a rectangle
    let pipeArt = '';
    for (let i = 0; i < pipeHeight / 20; i++) { // Adjust the 20 based on your font size to match the height
        pipeArt += '█'.repeat(pipeWidth / 10) + '\n'; // Adjust the 10 based on your font size to match the width
    }

    // Top pipe
    let pipeTop = this.pipes.create(800, position - gap - pipeHeight, pipeArt, {
        font: '18px monospace',
        fill: '#b22222'
    });
    setupPipe(this, pipeTop);

    // Bottom pipe
    let pipeBottom = this.pipes.create(800, position + gap, pipeArt, {
        font: '18px monospace',
        fill: '#b22222'
    });
    setupPipe(this, pipeBottom);
}

// General setup for pipes to avoid redundancy
function setupPipe(that, pipe) {
    that.physics.world.enable(pipe);
    pipe.body.setVelocityX(-200);
    pipe.body.immovable = true;
    pipe.body.allowGravity = false;
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