

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        // Add text to the start screen
        this.add.text(400, 300, 'Click to Start', { font: '24px monospace', fill: '#ffffff' })
            .setOrigin(0.5, 0.5);

        // Handle click event to start the game
        this.input.on('pointerdown', () => {
            this.scene.start('MainScene'); // Assuming your main game scene is called 'MainScene'
        });
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

   preload() {
      this.load.text('unicorn', 'assets/unicorn.txt');  // ASCII unicorn
      this.load.text('pipe', 'assets/pipe.txt');        // ASCII pipe, could be a simple '|'
      this.load.image('flare0', 'assets/flare0.png');
  }

  // Function to create top and bottom pipes ensuring enough space for the unicorn
   createPipes() {
      const gap = 150;  // Minimum gap size for the unicorn to pass
      const pipeHeight = 600; // Height of each pipe, adjust as needed
      const pipeWidth = 40; // Width of the pipe based on the ASCII character width
      let position = Phaser.Math.Between(150, 450 ); // Ensure pipes fit on screen

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
      this.setupPipe(this, pipeTop);

      // Bottom pipe
      let pipeBottom = this.pipes.create(800, position + gap, pipeArt, {
          font: '18px monospace',
          fill: '#b22222'
      });
      this.setupPipe(this, pipeBottom);
  }
  

   create() {
      // Setup the ASCII art unicorn
      let unicornArt = this.cache.text.get('unicorn');
      this.unicorn = this.add.text(200, this.sys.game.config.height / 2, unicornArt, {
          font: '16px monospace',
          fill: '#ffffff'
      });
    this.physics.world.enable(this.unicorn);
      this.unicorn.body.setGravityY(1500);
      this.unicorn.body.setSize(40, 40, false);  // Adjust collision body if n

      // Unicorn flap input
      this.input.on('pointerdown', () => this.unicorn.body.setVelocityY(-500), this);


    // Initialize score and score text
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

    // Start a timer event to update the score every second
    this.time.addEvent({
        delay: 1000,  // Update score every second
        callback: () => {
            this.score += 1;  // Increment score
            this.scoreText.setText('Score: ' + this.score);  // Update displayed score
        },
        callbackScope: this,
        loop: true
    });


    // Initialize pipe speed and increase interval
    this.pipeSpeed = -500;  // Base speed of pipes moving left
    this.speedIncreaseInterval = 1000;  // Increase speed 

    // Timer to increase pipe speed
    this.time.addEvent({
        delay: this.speedIncreaseInterval,
        callback: () => {
            this.pipeSpeed -= 50;  // Make the pipe speed faster (more negative)
            console.log('New pipe speed:', this.pipeSpeed);
        },
        callbackScope: this,
        loop: true
    });

      // Pipe creation with random placement and spacing
      this.pipes = this.add.group({ classType: Phaser.GameObjects.Text });
      this.time.addEvent({
          delay: 1500,  // Adjust timing for better game flow
          callback: this.createPipes,
          callbackScope: this,
          loop: true
      });

    // Setup for the rainbow particles
    let flareArt =  this.textures.get('flare0');
    this.emitter = this.add.particles(-10,50, flareArt, {
      // frame: 'red',
      angle: { min: 180 , max:360   },
      speed: 200,
      scale: { start: 0.1, end: 0.3 },
       blendMode: 'ADD',
      gravityX: -3000,
      gravityY: 500,
    });

    this.emitter.startFollow(this.unicorn);  

      // Collision detection
      this.physics.add.collider(this.unicorn, this.pipes, () => this.scene.restart(), null, this);
  }

 

  // General setup for pipes to avoid redundancy
   setupPipe(that, pipe) {
      that.physics.world.enable(pipe);
      pipe.body.setVelocityX(that.pipeSpeed);
      pipe.body.immovable = true;
      pipe.body.allowGravity = false;
  }

   update() {
    if (this.unicorn.y > 600 || this.unicorn.y < 0) {
      this.registry.destroy(); // Optional: destroy registry
      this.events.off(); // Turn off all active events

      this.score = 0; // Reset score
      this.scoreText.setText('Score: ' + this.score); // Update score display

      this.scene.restart(); // Restart current scene
    }
  }

   restartGame() {
      this.registry.destroy(); // destroy registry
      this.events.off(); // disable all active events
      this.scene.restart(); // restart current scene
  }
}



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
  scene: [StartScene, MainScene] 
};

let game = new Phaser.Game(config);