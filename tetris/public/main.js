class Tetris {
  constructor(width, height, initialSpeed) {
    this.width = width;
    this.height = height;
    this.initialSpeed = initialSpeed;
    this.gameArray = new Array(this.height)
      .fill(0)
      .map(() => new Array(this.width).fill(0));
    this.initialized = false;
    this.gameOver = false;
    this.currentPieceType = null; // Track the type of the current piece
    this.currentPiece = null;
    this.currentColor = null;
    this.currentPosition = { x: 0, y: 0 };
    this.rotationIndex = 0; // Track the current rotation
    this.score = 0;
    this.level = 1; // Track the current level
    this.linesCleared = 0; // Track the total number of lines cleared
    this.speedIncrease = 0.1; // Speed increase per level
    this.linesPerLevel = 1; // Number of lines needed to level up
    this.shapes = {
      LINE: {
        shape: [[1, 1, 1, 1]],
        rotations: [
          [[1, 1, 1, 1]], // Original shape
          [[1], [1], [1], [1]], // Rotated 90 degrees
        ],
        color: "#00e9e1",
      },
      L: {
        shape: [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
        rotations: [
          [
            [1, 0],
            [1, 0],
            [1, 1],
          ], // Original shape
          [
            [1, 1, 1],
            [1, 0, 0],
          ], // Rotated 90 degrees
          [
            [1, 1],
            [0, 1],
            [0, 1],
          ], // Rotated 180 degrees
          [
            [0, 0, 1],
            [1, 1, 1],
          ], // Rotated 270 degrees
        ],
        color: "#e99f00",
      },
      L_REVERSE: {
        shape: [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
        rotations: [
          [
            [0, 1],
            [0, 1],
            [1, 1],
          ], // Original shape
          [
            [1, 0, 0],
            [1, 1, 1],
          ], // Rotated 90 degrees
          [
            [1, 1],
            [1, 0],
            [1, 0],
          ], // Rotated 180 degrees
          [
            [1, 1, 1],
            [0, 0, 1],
          ], // Rotated 270 degrees
        ],
        color: "#0001e5",
      },
      S: {
        shape: [
          [0, 1, 1],
          [1, 1, 0],
        ],
        rotations: [
          [
            [0, 1, 1],
            [1, 1, 0],
          ], // Original shape
          [
            [1, 0],
            [1, 1],
            [0, 1],
          ], // Rotated 90 degrees
        ],
        color: "#00ed00",
      },
      S_REVERSE: {
        shape: [
          [1, 1, 0],
          [0, 1, 1],
        ],
        rotations: [
          [
            [1, 1, 0],
            [0, 1, 1],
          ], // Original shape
          [
            [0, 1],
            [1, 1],
            [1, 0],
          ], // Rotated 90 degrees
        ],
        color: "#ed0003",
      },
      SQUARE: {
        shape: [
          [1, 1],
          [1, 1],
        ],
        rotations: [
          [
            [1, 1],
            [1, 1],
          ], // Square doesn't change when rotated
        ],
        color: "#eae740",
      },
      T: {
        shape: [
          [1, 1, 1],
          [0, 1, 0],
        ],
        rotations: [
          [
            [1, 1, 1],
            [0, 1, 0],
          ], // Original shape
          [
            [0, 1],
            [1, 1],
            [0, 1],
          ], // Rotated 90 degrees
          [
            [0, 1, 0],
            [1, 1, 1],
          ], // Rotated 180 degrees
          [
            [1, 0],
            [1, 1],
            [1, 0],
          ], // Rotated 270 degrees
        ],
        color: "#9e00ef",
      },
    };
  }

  async init() {
    if (this.initialized) return;
    this.canvas = document.getElementById("scene");
    this.ctx = this.canvas.getContext("2d");

    this.highscores = await fetch("/highscores");
    this.highscores = await this.highscores.json();
    this.updateHighscores(this.highscores.scores);

    // Set canvas size based on game board dimensions
    this.canvas.width = this.width * 30;
    this.canvas.height = this.height * 30;

    this.spawnPiece();
    this.render(); // Start the rendering loop
    this.gameLoop(); // Start the game logic loop
    this.initialized = true;
  }

  getSpeed() {
    return this.initialSpeed + (this.level - 1) * this.speedIncrease; // Increase speed by 0.1 per level
  }

  spawnPiece() {
    const keys = Object.keys(this.shapes);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.currentPiece = this.shapes[randomKey].shape;
    this.currentColor = this.shapes[randomKey].color;
    this.currentPieceType = randomKey; // Set the piece type
    this.currentPosition = { x: Math.floor(this.width / 2) - 1, y: 0 };
    this.rotationIndex = 0; // Reset rotation index

    // Check if the new piece can be placed
    if (
      !this.canMove(
        this.currentPiece,
        this.currentPosition.x,
        this.currentPosition.y,
      )
    ) {
      this.gameOver = true; // Trigger game over
      console.log("Game Over!"); // Debug log
      this.endGame(); // Call the game over logic
      return;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    this.drawGhostPiece(); // Draw the ghost piece
    this.drawPiece();
  }

  drawBoard() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.gameArray[y][x]) {
          this.ctx.fillStyle = this.gameArray[y][x]; // Use the stored color
          this.ctx.fillRect(x * 30, y * 30, 30, 30);
        }
      }
    }
  }

  drawPiece() {
    this.ctx.fillStyle = this.currentColor; // Use the piece's color
    for (let y = 0; y < this.currentPiece.length; y++) {
      for (let x = 0; x < this.currentPiece[y].length; x++) {
        if (this.currentPiece[y][x]) {
          this.ctx.fillRect(
            (this.currentPosition.x + x) * 30,
            (this.currentPosition.y + y) * 30,
            30,
            30,
          );
        }
      }
    }
  }

  drawGhostPiece() {
    const ghostPosition = { ...this.currentPosition };
    while (
      this.canMove(
        this.currentPiece,
        ghostPosition.x,
        ghostPosition.y + 1,
      )
    ) {
      ghostPosition.y++;
    }
    this.ctx.globalAlpha = 0.3; // Set transparency
    this.ctx.fillStyle = this.currentColor;
    for (let y = 0; y < this.currentPiece.length; y++) {
      for (let x = 0; x < this.currentPiece[y].length; x++) {
        if (this.currentPiece[y][x]) {
          this.ctx.fillRect(
            (ghostPosition.x + x) * 30,
            (ghostPosition.y + y) * 30,
            30,
            30,
          );
        }
      }
    }
    this.ctx.globalAlpha = 1; // Reset transparency
  }

  gameLoop() {
    if (this.gameOver) return; // Stop the game loop if the game is over
    this.moveDown(); // Move the piece down

    setTimeout(() => {
      this.gameLoop(); // Call the game loop recursively
    }, 1000 / this.getSpeed()); // Update at the current speed
  }

  rotatePiecePositive() {
    const rotations = this.shapes[this.currentPieceType].rotations;

    // Calculate the next rotation index
    const nextRotationIndex = (this.rotationIndex + 1) % rotations.length;
    const nextRotation = rotations[nextRotationIndex];

    // Check if the rotated piece can be placed
    if (
      this.canMove(
        nextRotation,
        this.currentPosition.x,
        this.currentPosition.y,
      )
    ) {
      this.currentPiece = nextRotation;
      this.rotationIndex = nextRotationIndex;
    }
  }

  rotatePieceNegative() {
    const rotations = this.shapes[this.currentPieceType].rotations;

    // Calculate the next rotation index
    const nextRotationIndex = (this.rotationIndex + rotations.length - 1) %
      rotations.length;
    const nextRotation = rotations[nextRotationIndex];

    // Check if the rotated piece can be placed
    if (
      this.canMove(
        nextRotation,
        this.currentPosition.x,
        this.currentPosition.y,
      )
    ) {
      this.currentPiece = nextRotation;
      this.rotationIndex = nextRotationIndex;
    }
  }

  endGame() {
    this.gameOver = true; // Set game over flag
    alert("Game Over! Your score: " + this.score); // Display game over message
    console.log("Final Score:", this.score); // Debug log

    this.setScore();

    document.getElementById("start").disabled = false;

    // Optionally, reset the game state for a new game
    // this.resetGame();
  }

  resetGame() {
    this.gameArray = new Array(this.height)
      .fill(0)
      .map(() => new Array(this.width).fill(0));
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.initialized = false;
    document.getElementById("score").textContent = this.score; // Reset score display
    this.init(); // Restart the game
  }

  lockPiece() {
    for (let y = 0; y < this.currentPiece.length; y++) {
      for (let x = 0; x < this.currentPiece[y].length; x++) {
        if (this.currentPiece[y][x]) {
          this.gameArray[this.currentPosition.y + y][
            this.currentPosition.x + x
          ] = this.currentColor; // Store the color
        }
      }
    }
    this.checkLines();
  }

  hardDrop() {
    while (
      this.canMove(
        this.currentPiece,
        this.currentPosition.x,
        this.currentPosition.y + 1,
      )
    ) {
      this.currentPosition.y++;
    }
    this.lockPiece();
    this.spawnPiece();
  }

  moveLeft() {
    if (
      this.canMove(
        this.currentPiece,
        this.currentPosition.x - 1,
        this.currentPosition.y,
      )
    ) {
      this.currentPosition.x--;
    }
  }

  moveRight() {
    if (
      this.canMove(
        this.currentPiece,
        this.currentPosition.x + 1,
        this.currentPosition.y,
      )
    ) {
      this.currentPosition.x++;
    }
  }

  moveDown() {
    if (
      this.canMove(
        this.currentPiece,
        this.currentPosition.x,
        this.currentPosition.y + 1,
      )
    ) {
      this.currentPosition.y++;
    } else {
      this.lockPiece();
      this.spawnPiece();
    }
  }

  canMove(piece, newX, newY) {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          if (
            boardX < 0 ||
            boardX >= this.width ||
            boardY >= this.height ||
            this.gameArray[boardY][boardX]
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  checkLines() {
    let linesCleared = 0; // Track the number of lines cleared in this move

    for (let y = this.height - 1; y >= 0; y--) {
      if (this.gameArray[y].every((cell) => cell !== 0)) {
        // Remove the completed line
        this.gameArray.splice(y, 1);
        // Add a new empty line at the top
        this.gameArray.unshift(new Array(this.width).fill(0));
        linesCleared++; // Increment the count of cleared lines
        y++; // Recheck the current row after shifting
      }
    }

    if (linesCleared > 0) {
      this.linesCleared += linesCleared; // Update total lines cleared
      this.updateScore(linesCleared); // Update the score based on lines cleared
      this.updateLevel(); // Check if the level should increase
    }
  }

  updateLevel() {
    if (this.linesCleared >= this.level * this.linesPerLevel) {
      this.level++; // Increase the level
      document.getElementById("level").textContent = this.level; // Update the level display
      console.log("Level Up! Current Level:", this.level); // Debug log
    }
  }

  updateScore(linesCleared) {
    const score = 100 * this.getSpeed() * Math.pow(2, linesCleared - 1); // Calculate the score
    this.score += score; // Add to the total score
    document.getElementById("score").textContent = this.score; // Update the score display
  }

  render() {
    this.draw();
    requestAnimationFrame(() => this.render()); // Continuously render at 60 FPS
  }

  updateHighscores(array) {
    const ol = document.getElementById("highscores");
    ol.innerHTML = ""; // Clear the list

    array.forEach((score) => {
      const li = document.createElement("li");
      li.innerText = score;
      ol.appendChild(li);
    });
  }

  async setScore() {
    const response = await fetch("/setScore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      cache: "default",
      _REDirect: "follow",
      credentials: "same-origin",
      referrerPolicy: "no-referrer-when-downgrade",
      body: JSON.stringify({
        score: Math.floor(Number(this.score)),
      }),
    });
    const { scores } = await response.json();
    this.updateHighscores(scores);
  }
}

const tetris = new Tetris(10, 20, 1);

document.getElementById("start").addEventListener("click", () => {
  tetris.resetGame();
  document.getElementById("start").disabled = true;
});

document.addEventListener("keydown", (e) => {
  if (tetris.gameOver) return; // Don't accept input if the game is over
  if (e.key === "ArrowLeft" || e.key === "a") tetris.moveLeft();
  if (e.key === "ArrowRight" || e.key === "d") tetris.moveRight();
  if (e.key === "ArrowDown" || e.key === "Shift" || e.key === "s") {
    tetris.moveDown();
  }
  if (e.key === " " || e.key === "Spacebar") tetris.hardDrop();
  if (e.key === "q") tetris.rotatePieceNegative();
  if (e.key === "e" || e.key === "ArrowUp") tetris.rotatePiecePositive();
});
