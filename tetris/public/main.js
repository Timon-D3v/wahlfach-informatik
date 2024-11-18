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
        this.events = {
            onEnd: new Event("TETRIS_ENDED"),
            onStart: new Event("TETRIS_STARTED"),
            runStart: new Event("TETRIS_RUN_START"),
        }

        on(document, "TETRIS_RUN_START", () => this.start());
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

        this.moveLeftCaller = on(document, "keydown", e => {
            if (e.key === "ArrowLeft" || e.key === "a") this.moveLeft();
        });
        this.moveRightCaller = on(document, "keydown", e => {
            if (e.key === "ArrowRight" || e.key === "d") this.moveRight();
        });
    }

    start() {
        this.clearScene();
        this.gameArray = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));
        this.gameLoopInterval = setInterval(this.gameLoop.bind(this), 1000 / this.initialSpeed);
        this.time = 0;
        this.running = true;
        this.score = 0;
        this.gameObjects = [];
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
        console.log("Game ended");
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
                } else {
                    this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
                }

                // can move left
                if (x === 0) {
                    this.gameArray[y][x].canMoveLeft = false;
                } else {
                    this.gameArray[y][x].canMoveLeft = this.gameArray[y][x - 1] === 0;
                }


                // can move right
                if (x === this.width - 1) {
                    this.gameArray[y][x].canMoveRight = false;
                } else {
                    this.gameArray[y][x].canMoveRight = this.gameArray[y][x + 1] === 0;
                }
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
                        console.error("Something went wrong. Game ended.");
                    }
                }

                // this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
            }
        }

        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                if (y === 0) {
                    this.gameArray[y][x].canMoveDown = false;
                    continue;
                } else {
                    this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
                }

                // can move left
                if (x === 0) {
                    this.gameArray[y][x].canMoveLeft = false;
                } else {
                    this.gameArray[y][x].canMoveLeft = this.gameArray[y][x - 1] === 0;
                }


                // can move right
                if (x === this.width - 1) {
                    this.gameArray[y][x].canMoveRight = false;
                } else {
                    this.gameArray[y][x].canMoveRight = this.gameArray[y][x + 1] === 0;
                }
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

    generateCube(color = this.colors[Math.floor(Math.random() * this.colors.length)]) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(100, 100, 100);
        this.scene.add(cube);
        return cube;
    }

    gameLoop() {
        console.log(this.time, this.gameArray);
        
        this.running = this.checkForDeath();
        if (!this.running) return this.end();

        this.update();


        // if (this.time % 12 === 0) { // alle 12 frames ein neues GameObject
        //     this.generateGameObject();
        // }

        this.time++;
    }

    checkForDeath() {
        if (this.running === false) return false;

        for (let x = 0; x < this.gameArray[this.height - this.extraRows - 1].length; x++) {
            const cube = this.gameArray[this.height - this.extraRows - 1][x];

            if (cube === 0) continue;

            console.log("cube", cube);
            console.log("cube.canMoveDown", !cube.canMoveDown && !cube.isAppending)

            if (!cube.canMoveDown && !cube.isAppending) return false;

            console.log("cube.isAppending", cube.isAppending)

            console.log("long:", this.gameObjects[this.gameObjects.length - 1].objects.includes(cube))

            if (cube.isAppending) {
                // check if the block is in the last gameObject
                // if not, the position is invalid => game over
                const head = this.headGameObject(cube);

                if (!head.canMoveDown) return false;
            }
        }

        // if there is a block at the top of the screen, check if is is able to fall
        // if it is not, return false => game over
        // if it is, return true => game continues

        return true;
    }

    trailGameObject(object) {
        if (object.trail === null) return object;

        return this.trailGameObject(this.gameArray[object.gamePosition.y + object.trail.y - 1][object.gamePosition.x + object.trail.x - 1]);
    }

    headGameObject(object) {
        if (object.head === null) return object;

        return this.headGameObject(this.gameArray[object.gamePosition.y + object.head.y - 1][object.gamePosition.x + object.head.x - 1]);
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
                this.color = global().colors[Math.floor(Math.random() * global().colors.length)]
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
                        cube: global().generateCube(this.color),
                        isAppending: false,
                        hasBlockRight: false,
                        hasBlockLeft: false,
                        trail: {
                            // to find the next element
                            x: 0, // go 0 to the right
                            y: 1 // go one up
                            // in the gameArray
                        },
                        head: null
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
                        cube: global().generateCube(this.color),
                        isAppending: true,
                        hasBlockRight: false,
                        hasBlockLeft: false,
                        trail: {
                            x: 0,
                            y: 1
                        },
                        head: {
                            x: 0,
                            y: -1
                        }
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
                        cube: global().generateCube(this.color),
                        isAppending: true,
                        hasBlockRight: false,
                        hasBlockLeft: false,
                        trail: {
                            x: 0,
                            y: 1
                        },
                        head: {
                            x: 0,
                            y: -1
                        }
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
                        cube: global().generateCube(this.color),
                        isAppending: true,
                        hasBlockRight: false,
                        hasBlockLeft: false,
                        trail: null,
                        head: {
                            x: 0,
                            y: -1
                        }
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
            if (this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] !== 0) return this.end();
  
            this.gameArray[obj.gamePosition.y - 1][obj.gamePosition.x - 1] = obj;
        });

        this.gameObjects.push(line);

        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                if (y === 0) {
                    this.gameArray[y][x].canMoveDown = false;
                    continue;
                } else {
                    this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
                }

                // can move left
                if (x === 0) {
                    this.gameArray[y][x].canMoveLeft = false;
                } else {
                    this.gameArray[y][x].canMoveLeft = this.gameArray[y][x - 1] === 0;
                }


                // can move right
                if (x === this.width - 1) {
                    this.gameArray[y][x].canMoveRight = false;
                } else {
                    this.gameArray[y][x].canMoveRight = this.gameArray[y][x + 1] === 0;
                }
            }
        }

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
        if (this.gameObjects.length === 0) return;

        // Check if a object can move left
        const object = this.gameObjects[this.gameObjects.length - 1];
        let moveLeft = true;

        object.objects.forEach(obj => {
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

        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                if (y === 0) {
                    this.gameArray[y][x].canMoveDown = false;
                    continue;
                } else {
                    this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
                }

                // can move left
                if (x === 0) {
                    this.gameArray[y][x].canMoveLeft = false;
                } else {
                    this.gameArray[y][x].canMoveLeft = this.gameArray[y][x - 1] === 0;
                }


                // can move right
                if (x === this.width - 1) {
                    this.gameArray[y][x].canMoveRight = false;
                } else {
                    this.gameArray[y][x].canMoveRight = this.gameArray[y][x + 1] === 0;
                }
            }
        }
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

        for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                if (y === 0) {
                    this.gameArray[y][x].canMoveDown = false;
                    continue;
                } else {
                    this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
                }

                // can move left
                if (x === 0) {
                    this.gameArray[y][x].canMoveLeft = false;
                } else {
                    this.gameArray[y][x].canMoveLeft = this.gameArray[y][x - 1] === 0;
                }


                // can move right
                if (x === this.width - 1) {
                    this.gameArray[y][x].canMoveRight = false;
                } else {
                    this.gameArray[y][x].canMoveRight = this.gameArray[y][x + 1] === 0;
                }
            }
        }
    }

    rotateRight() {
        // rotate the current object
        // optional
    }

    rotateLeft() {
        // rotate the current object
        // optional
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
    
        console.log("Scene cleared!");
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

getElm("start").on("click", () => {
    document.dispatchEvent(tetris.events.runStart);
});




// make this its own function
/*
for (let y = 0; y < this.gameArray.length; y++) {
            for (let x = 0; x < this.gameArray[y].length; x++) {
                if (this.gameArray[y][x] === 0) continue;

                if (y === 0) {
                    this.gameArray[y][x].canMoveDown = false;
                    continue;
                } else {
                    this.gameArray[y][x].canMoveDown = this.gameArray[y - 1][x] === 0;
                }

                // can move left
                if (x === 0) {
                    this.gameArray[y][x].canMoveLeft = false;
                } else {
                    this.gameArray[y][x].canMoveLeft = this.gameArray[y][x - 1] === 0;
                }


                // can move right
                if (x === this.width - 1) {
                    this.gameArray[y][x].canMoveRight = false;
                } else {
                    this.gameArray[y][x].canMoveRight = this.gameArray[y][x + 1] === 0;
                }
            }
        }
            */