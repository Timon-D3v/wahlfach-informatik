import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getElm, GETJson, timonjs_message, createElm, post, randomString, on } from "timonjs";

timonjs_message();


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
        this.gameObjectTypes = ["LINE", "L", "L_REVERSE", "S", "S_REVERSE", "SQUARE", "T"];
    }

    getPositionX(x) {
        return x - this.offset.x;
    }

    getPositionY(y) {
        return y - this.offset.y;
    }

    async init() {
        this.canvas = getElm("scene");
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, (this.height - this.extraRows) / 2, -(this.height - this.extraRows) / 2, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.x(), this.canvas.y());
        this.running = false;
        this.highscores = await GETJson("/highscores");
        this.score = 0;

        this.updateHighscores();

        this.camera.position.set(0.5, 0.5, 5);
        this.camera.lookAt(0.5, 0.5, 0);

        this.enableControls = false;
        this.controls = null;
        if (this.enableControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        }
        

        this.render();
    }

    start() {
        this.gameArray = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));
        this.gameLoopInterval = setInterval(this.gameLoop.bind(this), 1000 / this.initialSpeed);
        this.time = 0;
        this.running = true;
        this.score = 0;
        this.gameObjects = [];
        this.moveLeftCaller = on(document, "keydown", e => {
            if (e.key === "ArrowLeft" || e.key === "a") this.moveLeft();
        });
        this.moveRightCaller = on(document, "keydown", e => {
            if (e.key === "ArrowRight" || e.key === "d") this.moveRight();
        });
        // this.rotateRightCaller = on(document, "keydown", e => {
        //     if (e.key === "ArrowUp" || e.key === "W") this.rotateRight()
        // });
        // this.rotateLeftCaller = on(document, "keydown", e => {
        //     if (e.key === "ArrowDown" || e.key === "S") this.rotateLeft()
    }

    end() {
        this.gameLoopInterval = clearInterval(this.gameLoopInterval);
        this.setScore();
    }

    render() {
        requestAnimationFrame(this.render.bind(this));

        this.renderer.render(this.scene, this.camera);

        if (this.enableControls) {
            this.controls.update();
        }
    }

    update() {
        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;
                if (y === 0) {
                    this.gameArray[y][x].canMoveDown = false;
                    continue;
                }
                this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
            }
        }

        // Check if a object can move down
        for (let i = 0; i < this.gameObjects.length; i++) {
            let moveBlock = true;

            this.gameObjects[i].objects.forEach(obj => {
                if (!obj.canMoveDown && !obj.isAppending) {
                    moveBlock = false;
                }
            });

            console.log(moveBlock);

            if (moveBlock) {
                this.gameObjects[i].moveDown();
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
                        console.error("Something went wrong. Game ended.");
                    }
                }

                // this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
            }
        }

        // Check if a row is full
        // If a row is full, remove it and add a new row at the top
        // Increase the score
        // But skip the falling for one frame

        // Check for each block, if there is space to fall down
    }

    updateHighscores() {
        const ol = getElm("highscores");
        ol.html("");

        this.highscores.forEach(score => {
            const li = createElm("li");
            li.text(score);
            ol.append(li);
        });
    }

    async setScore() {
        const response = await post("/setScore", { score: this.score });
        this.updateHighscores(response);
    }

    generateCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: this.colors[Math.floor(Math.random() * this.colors.length)] });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(100, 100, 100);
        this.scene.add(cube);
        return cube;
    }

    gameLoop() {
        console.log(this.time, this.gameArray)
        this.running = this.checkForDeath();

        if (!this.running) return this.end();

        this.update();

        if (this.time % 10 === 0) {
            this.generateGameObject();
        }

        this.time++;
    }

    checkForDeath() {
        if (this.running === false) return false;

        // if there is a block at the top of the screen, check if is is able to fall
        // if it is not, return false => game over
        // if it is, return true => game continues

        return true;
    }

    generateGameObject() {
        // const type = this.gameObjectTypes[Math.floor(Math.random() * this.gameObjectTypes.length)];
        const type = "LINE";

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

    initLine() {
        const global = () => this;

        class Line {
            constructor() {
                this.id = randomString(32);
                this.type = "LINE";
                this.objects = [
                    {
                        number: 0,
                        position: {
                            x: global().getPositionX(Math.floor(global().width / 2)),
                            y: global().getPositionY(global().height) - 1
                        },
                        gamePosition: {
                            x: Math.floor(global().width / 2),
                            y: global().height - 3
                        },
                        cube: global().generateCube(),
                        isAppending: false
                    }, {
                        number: 1,
                        position: {
                            x: global().getPositionX(Math.floor(global().width / 2)),
                            y: global().getPositionY(global().height)
                        },
                        gamePosition: {
                            x: Math.floor(global().width / 2),
                            y: global().height - 2
                        },
                        cube: global().generateCube(),
                        isAppending: true
                    }, {
                        number: 2,
                        position: {
                            x: global().getPositionX(Math.floor(global().width / 2)),
                            y: global().getPositionY(global().height) + 1
                        },
                        gamePosition: {
                            x: Math.floor(global().width / 2),
                            y: global().height - 1
                        },
                        cube: global().generateCube(),
                        isAppending: true
                    }, {
                        number: 3,
                        position: {
                            x: global().getPositionX(Math.floor(global().width / 2)),
                            y: global().getPositionY(global().height) + 2
                        },
                        gamePosition: {
                            x: Math.floor(global().width / 2),
                            y: global().height
                        },
                        cube: global().generateCube(),
                        isAppending: true
                    }
                ]
        
                this.objects.forEach(obj => {
                    obj.id = this.id;
                    obj.cube.position.set(obj.position.x, obj.position.y, 0);
                });
            }
        
            moveLeft() {
                this.objects.forEach(obj => {
                    obj.position.x--;
                    obj.gamePosition.x--;
                    obj.cube.position.x = obj.position.x;
                });
            }
        
            moveRight() {
                this.objects.forEach(obj => {
                    obj.position.x++;
                    obj.gamePosition.x++;
                    obj.cube.position.x = obj.position.x;
                });
            }
        
            moveDown() {
                this.objects.forEach(obj => {
                    obj.position.y--;
                    obj.gamePosition.y--;
                    obj.cube.position.y = obj.position.y;
                });
            }
        
            rotateRight() {
                // rotate the current object
                // optional
            }
        
            rotateLeft() {
                // rotate the current object
                // optional
            }
        }

        const line = new Line();

        line.objects.forEach(obj => {
            this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] = obj;
        });

        this.gameObjects.push(line);

        return line;
    }

    initL(reverse = false) {
        
    }

    initS(reverse = false) {
        
    }

    initSquare() {
        
    }

    initT() {
        
    }

    moveLeft() {
        this.gameObjects[this.gameObjects.length - 1].moveLeft();
        // move the current object left
    }

    moveRight() {
        // move the current object right
        this.gameObjects[this.gameObjects.length - 1].moveRight();
    }

    rotateRight() {
        // rotate the current object
        // optional
    }

    rotateLeft() {
        // rotate the current object
        // optional
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

const tetris = new Tetris(6, 12, 1);
tetris.init();
tetris.start();