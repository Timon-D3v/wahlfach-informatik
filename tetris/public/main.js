import * as THREE from "three";
import { getElm, GETJson, timonjs_message, createElm, post } from "timonjs";

timonjs_message();


class Tetris {
    constructor(width, height, initialSpeed) {
        this.width = width;
        this.height = height;
        this.initialSpeed = initialSpeed;
    }

    async init() {
        this.canvas = getElm("scene");
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.x(), this.canvas.y());
        this.running = false;
        this.highscores = await GETJson("/highscores");
        this.score = 0;

        this.updateHighscores();

        this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        this.scene.add(this.cube);

        this.camera.position.z = 5;
        this.camera.lookAt(0, 0, 0);

        this.render();
    }

    start() {
        this.gameArray = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0));
        console.log(this.gameArray);
    }

    end() {
        this.setScore();
    }

    render() {
        requestAnimationFrame(this.render.bind(this));

        this.renderer.render(this.scene, this.camera);
    }

    update() {
        console.log("update");
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
}

const tetris = new Tetris(6, 12, 1);
tetris.init();
tetris.start();