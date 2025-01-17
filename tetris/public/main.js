import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import timon, { getElm, GETJson, createElm, post, on, errorLog, log } from "timonjs";
import { Line, Square, L } from "./objects.js";

timon.timonjs_message();
console.log("For working game please go to: https://dionyziz.com/graphics/canvas-tetris/");



// This tetris game cannot handle objects with cubes that are connected to more than two other cubes


class Tetris {
    constructor(width, height, initialSpeed) {
        this.extraRows = 3;
        this.width = width;
        this.height = height + this.extraRows;
        this.initialSpeed = initialSpeed;
        this.offset = {
            x: Math.floor(this.width / 2),
            y: Math.floor(this.height / 2 + 1)
        };
        this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080, 0x00ff7f, 0xff69b4, 0x1e90ff, 0x32cd32];
        // this.gameObjectTypes = ["LINE", "L", "L_REVERSE", "S", "S_REVERSE", "SQUARE", "T"];
        this.gameObjectTypes = ["SQUARE", "LINE", "L", "L_REVERSE"]
        this.events = {
            onEnd: new Event("TETRIS_ENDED"),
            onStart: new Event("TETRIS_STARTED"),
            runStart: new Event("TETRIS_RUN_START"),
        }
    }

    async init() {
        this.canvas = getElm("scene");
        this.scoreElement = getElm("score");
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, (this.height - this.extraRows) / 2, -(this.height - this.extraRows) / 2, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.running = false;
        this.enableControls = false;
        this.controls = this.enableControls ? new OrbitControls(this.camera, this.renderer.domElement) : null;
        this.score = 0;
        this.gameLoopInterval = null;
        this.controls = null;
        this.highscores = await GETJson("/highscores");



        this.renderer.setSize(this.canvas.x(), this.canvas.y());

        this.camera.position.set(0.5, 0.5, 5);
        this.camera.lookAt(0.5, 0.5, 0);

        this.render();

        this.updateHighscores(this.highscores.scores);

        this.moveLeftCaller = on(document, "keydown", e => {
            if (e.key === "ArrowLeft" || e.key === "a") this.moveLeft();
        });
        this.moveRightCaller = on(document, "keydown", e => {
            if (e.key === "ArrowRight" || e.key === "d") this.moveRight();
        });

        on(document, "TETRIS_RUN_START", () => this.start());
    }

    destroy() {
        this.end();
        this.clearScene();

        document.removeEventListener("TETRIS_RUN_START", this.start);
        document.removeEventListener("keydown", this.moveLeftCaller);
        document.removeEventListener("keydown", this.moveRightCaller);
    }

    start() {
        this.clearScene();
        this.speed = this.initialSpeed;
        this.time = 0;
        this.score = 0;
        this.gameObjects = [];
        this.running = true;
        this.gameArray = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));

        if (this.gameLoopInterval === null) {
            this.gameLoopInterval = setInterval(this.gameLoop.bind(this), 1000 / this.speed);
        } else {
            this.gameLoopInterval = clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            this.gameLoopInterval = setInterval(this.gameLoop.bind(this), 1000 / this.speed);
        }

        this.generateGameObject();
        // this.rotateRightCaller = on(document, "keydown", e => {
        //     if (e.key === "ArrowUp" || e.key === "W") this.rotateRight()
        // });
        // this.rotateLeftCaller = on(document, "keydown", e => {
        //     if (e.key === "ArrowDown" || e.key === "S") this.rotateLeft()
    }

    end() {
        this.gameLoopInterval = clearInterval(this.gameLoopInterval);
        this.setScore();
        log("Game ended");
        alert("Game ended");
    }

    render() {
        requestAnimationFrame(this.render.bind(this));

        this.renderer.render(this.scene, this.camera);

        if (this.enableControls) this.controls.update();
    }

    gameLoop() {
        console.log(this.time, this.gameArray);

        this.running = this.checkForDeath();
        if (!this.running) return this.end();

        this.update();

        this.checkForFullRows();

        this.time++;
    }

    update() {
        this.updateLegalMoves();

        // Check if a object can move down
        for (let i = 0; i < this.gameObjects.length; i++) {
            let moveBlock = true;

            this.gameObjects[i].objects.forEach(obj => {
                if (!obj.canMoveDown && !obj.isAppending) {
                    moveBlock = false;
                }
            });

            if (moveBlock) {
                this.gameObjects[i].moveDown();
            } else if (!moveBlock && i === this.gameObjects.length - 1) {
                // spawn new object
                return this.generateGameObject();
            }
        }

        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                const cube = this.gameArray[y][x];

                if (cube.gamePosition.y - 1 !== y || cube.gamePosition.x - 1 !== x) {
                    if (this.gameArray[cube.gamePosition.y - 1][cube.gamePosition.x - 1] === 0) {
                        this.gameArray[cube.gamePosition.y - 1][cube.gamePosition.x - 1] = cube;
                        this.gameArray[y][x] = 0;
                    } else {
                        this.running = false;
                        errorLog("Something went wrong. Game ended.");
                    }
                }
            }
        }

        this.updateLegalMoves();
    }

    updateLegalMoves() {
        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                if (y === 0) {
                    this.gameArray[y][x].canMoveDown = false;
                    continue;
                } else {
                    this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
                }

                if (x === 0) {
                    this.gameArray[y][x].canMoveLeft = false;
                } else {
                    this.gameArray[y][x].canMoveLeft = this.gameArray[y][x - 1] === 0;
                }

                if (x === this.width - 1) {
                    this.gameArray[y][x].canMoveRight = false;
                } else {
                    this.gameArray[y][x].canMoveRight = this.gameArray[y][x + 1] === 0;
                }
            }
        }
    }

    checkForFullRows() {
        const fullRows = [];

        for (let y = 0; y < this.gameArray.length; y++) {
            let fullRow = true;

            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) {
                    fullRow = false;
                }
            }

            if (fullRow) {
                fullRows.push(y);
            }
        }

        fullRows.forEach(y => {
            this.handleFullRow(y);
        });
    }

    checkForDeath() {
        if (this.running === false) return false;

        for (let x = 0; x < this.gameArray[this.height - this.extraRows - 1].length; x++) {
            const cube = this.gameArray[this.height - this.extraRows - 1][x];

            if (cube === 0) continue;

            if (!cube.canMoveDown && !cube.isAppending) return false;

            if (cube.isAppending) {
                // check if the block is in the last gameObject
                // if not, the position is invalid => game over
                const head = this.headGameObject(cube);

                if (!head.canMoveDown) return false;
            }
        }

        return true;
    }

    generateGameObject() {
        // This tetris game cannot handle objects with cubes that are connected to more than two other cubes
        // const type = this.gameObjectTypes[Math.floor(Math.random() * this.gameObjectTypes.length)];
        const type = "SQUARE";

        if (this.gameObjects.length % 5 === 0) {
            this.speed += 0.1 * (1 + this.speed / 10);
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            this.gameLoopInterval = setInterval(this.gameLoop.bind(this), 1000 / this.speed);
        }

        switch (type) {
            case "LINE":
                return this.initLine();
            case "L":
                return this.initL();
            case "L_REVERSE":
                return this.initL(true);
            case "S":
                return this.initS();
            case "S_REVERSE":
                return this.initS(true);
            case "SQUARE":
                return this.initSquare();
            case "T":
                return this.initT();
        }
    }

    generateCube(color = this.colors[Math.floor(Math.random() * this.colors.length)]) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(100, 100, 100);
        this.scene.add(cube);
        return cube;
    }

    handleFullRow(y) {
        const row = this.gameArray[y];
        let skip = false;

        row.forEach(cube => {
            if (this.headGameObject(cube).canMoveDown === true) skip = true;
        });

        // One ore more blocks are falling down
        if (skip) return;

        for (let x = 0; x < row.length; x++) {
            const cube = row[x];
            const head = cube.head === null ? null : this.gameArray[cube.gamePosition.y + cube.head.y - 1][cube.gamePosition.x + cube.head.x - 1];
            const trail = cube.trail === null ? null : this.gameArray[cube.gamePosition.y + cube.trail.y - 1][cube.gamePosition.x + cube.trail.x - 1];

            if (head !== null) {
                // handle the head
                // make it the new trail
                if (head.trail.x === 1) head.hasBlockRight = false;
                if (head.trail.x === -1) head.hasBlockLeft = false;
            }

            if (trail !== null) {
                // handle the trail
                // make it the new head
                if (trail.head.x === 1) trail.hasBlockRight = false;
                if (trail.head.x === -1) trail.hasBlockLeft = false;

                trail.isAppending = false;
            }

            if (cube.head !== null) head.trail = null;
            if (cube.trail !== null) trail.head = null;


            this.scene.remove(cube.cube);
            cube.cube.geometry.dispose();
            cube.cube.material.dispose();

            row[x] = 0;
            this.gameArray[y][x] = 0;
        }

        this.score += 100 * this.speed;
        this.scoreElement.text(Math.floor(this.score));
    }

    trailGameObject(object) {
        if (object.trail === null) return object;

        return this.trailGameObject(this.gameArray[object.gamePosition.y + object.trail.y - 1][object.gamePosition.x + object.trail.x - 1]);
    }

    headGameObject(object) {
        if (object.head === null) return object;

        console.log(`Number ${object.number}`, object.gamePosition.y + object.head.y - 1, object.gamePosition.x + object.head.x - 1);

        return this.headGameObject(this.gameArray[object.gamePosition.y + object.head.y - 1][object.gamePosition.x + object.head.x - 1]);
    }

    moveLeft() {
        if (this.gameObjects.length === 0) return;

        // Check if a object can move left
        const object = this.gameObjects[this.gameObjects.length - 1];
        let moveLeft = true;

        object.objects.forEach(obj => {
            console.log(obj)
            console.log("Real: ", !obj.canMoveLeft && !obj.hasBlockLeft);
            if (!obj.canMoveLeft && !obj.hasBlockLeft) {
                moveLeft = false;
            }
        });

        if (!moveLeft) return;

        const posArray = [];
        object.objects.forEach(obj => {
            posArray.push(obj.gamePosition);
        });

        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                const cube = this.gameArray[y][x];

                posArray.forEach(pos => {
                    if (cube.gamePosition.x === pos.x && cube.gamePosition.y === pos.y) {
                        this.gameArray[y][x] = 0;
                    }
                });
            }
        }

        object.moveLeft();

        object.objects.forEach(obj => {
            this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] = obj;
        });

        this.updateLegalMoves();
    }

    moveRight() {
        if (this.gameObjects.length === 0) return;

        // Check if a object can move left
        const object = this.gameObjects[this.gameObjects.length - 1];
        let moveRight = true;

        object.objects.forEach(obj => {
            if (!obj.canMoveRight && !obj.hasBlockRight) {
                moveRight = false;
            }
        });

        if (!moveRight) return;

        const posArray = [];
        object.objects.forEach(obj => {
            posArray.push(obj.gamePosition);
        });

        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                const cube = this.gameArray[y][x];

                posArray.forEach(pos => {
                    if (cube.gamePosition.x === pos.x && cube.gamePosition.y === pos.y) {
                        this.gameArray[y][x] = 0;
                    }
                });
            }
        }

        object.moveRight();

        object.objects.forEach(obj => {
            this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] = obj;
        });

        this.updateLegalMoves();
    }

    rotateRight() {
        // rotate the current object
        // optional
    }

    rotateLeft() {
        // rotate the current object
        // optional
    }

    getPositionX(x) {
        return x - this.offset.x;
    }

    getPositionY(y) {
        return y - this.offset.y;
    }

    clearScene() {
        // Loop through all children in the scene
        while (this.scene.children.length > 0) {
            const object = this.scene.children[0];
            
            // Remove the object from the scene
            this.scene.remove(object);
    
            // Dispose of geometry and material (if any)
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                // If the material is an array, dispose of each one
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
    
        log("Scene cleared!");
    }

    updateHighscores(array) {
        const ol = getElm("highscores");
        ol.html("");

        array.forEach(score => {
            const li = createElm("li");
            li.text(score);
            ol.append(li);
        });
    }

    async setScore() {
        const response = await post("/setScore", { score: Math.floor(this.score) });
        this.updateHighscores(response.scores);
    }

    initLine() {
        const line = new Line(this);

        line.objects.forEach(obj => {
            if (this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] !== 0) return this.end();
  
            this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] = obj;
        });

        this.gameObjects.push(line);

        this.updateLegalMoves();

        return line;
    }

    initL(reverse = false) {
        const l = new L(this, reverse);

        l.objects.forEach(obj => {
            if (this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] !== 0) return this.end();
  
            this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] = obj;
        });

        this.gameObjects.push(l);

        this.updateLegalMoves();

        return l;
    }

    initS(reverse = false) {
        
    }

    initSquare() {
        const square = new Square(this);

        console.log(square);

        square.objects.forEach(obj => {
            if (this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] !== 0) return this.end();
  
            this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] = obj;
        });

        this.gameObjects.push(square);

        this.updateLegalMoves();

        return square;
    }

    initT() {
        
    }
    
    // Add two invisible rows at the top for cubes like -| to spawn and three rows for | cubes to spawn
    // this.gameArray = [
    //     [0, 0, 0, 0, 0, 0], // only used if | spawn
    //     [0, 0, 0, 0, 0, 0], // used if | or -| or |-  or _| or |_ spawn + the stairs
    //     [0, 0, 0, 0, 0, 0], // used of all the above or 2x2 cubes spawn
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0],
    // ]
}

const tetris = new Tetris(6, 12, 1.5);
tetris.init();

getElm("start").on("click", () => {
    document.dispatchEvent(tetris.events.runStart);
});