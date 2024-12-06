import { randomString } from "timonjs";

export class Line {
    constructor(_this) {
        this.id = randomString(32);
        this.type = "LINE";
        this.color = _this.colors[Math.floor(Math.random() * _this.colors.length)]
        this.objects = [
            {
                number: 0,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)),
                    y: _this.getPositionY(_this.height) - 1
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2),
                    y: _this.height - 3
                },
                cube: _this.generateCube(this.color),
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
                    x: _this.getPositionX(Math.floor(_this.width / 2)),
                    y: _this.getPositionY(_this.height)
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2),
                    y: _this.height - 2
                },
                cube: _this.generateCube(this.color),
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
                    x: _this.getPositionX(Math.floor(_this.width / 2)),
                    y: _this.getPositionY(_this.height) + 1
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2),
                    y: _this.height - 1
                },
                cube: _this.generateCube(this.color),
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
                    x: _this.getPositionX(Math.floor(_this.width / 2)),
                    y: _this.getPositionY(_this.height) + 2
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2),
                    y: _this.height
                },
                cube: _this.generateCube(this.color),
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

export class Square {
    constructor(_this) {
        this.id = randomString(32);
        this.type = "SQUARE";
        this.color = _this.colors[Math.floor(Math.random() * _this.colors.length)]
        this.objects = [
            {
                number: 0,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)),
                    y: _this.getPositionY(_this.height) - 1
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2),
                    y: _this.height - 3
                },
                cube: _this.generateCube(this.color),
                isAppending: false,
                hasBlockRight: true,
                hasBlockLeft: false,
                trail: {
                    // to find the next element
                    x: 1, // go x right
                    y: 0 // go y up
                    // in the gameArray
                },
                head: null
            }, {
                number: 1,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)) + 1,
                    y: _this.getPositionY(_this.height) - 1
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2) + 1,
                    y: _this.height - 3
                },
                cube: _this.generateCube(this.color),
                isAppending: false, // Maybe false because no block below
                hasBlockRight: false,
                hasBlockLeft: true,
                trail: {
                    x: 0,
                    y: 1
                },
                head: {
                    x: -1,
                    y: 0
                }
            }, {
                number: 2,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)) + 1,
                    y: _this.getPositionY(_this.height)
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2) + 1,
                    y: _this.height - 2
                },
                cube: _this.generateCube(this.color),
                isAppending: true,
                hasBlockRight: false,
                hasBlockLeft: true,
                trail: {
                    x: -1,
                    y: 0
                },
                head: {
                    x: 0,
                    y: -1
                }
            }, {
                number: 3,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)),
                    y: _this.getPositionY(_this.height)
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2),
                    y: _this.height - 2
                },
                cube: _this.generateCube(this.color),
                isAppending: true,
                hasBlockRight: true,
                hasBlockLeft: false,
                trail: null,
                head: {
                    x: 1,
                    y: 0
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

export class L {
    constructor(_this, reverse) {
        this.id = randomString(32);
        this.isReversedL = reverse;
        this.type = this.isReversedL ? "L_REVERSE" : "L";
        this.color = _this.colors[Math.floor(Math.random() * _this.colors.length)]
        this.objects = [
            {
                number: 0,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)) + (this.isReversedL ? 1 : 0),
                    y: _this.getPositionY(_this.height) - 1
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2) + (this.isReversedL ? 1 : 0),
                    y: _this.height - 3
                },
                cube: _this.generateCube(this.color),
                isAppending: false,
                hasBlockRight: !this.isReversedL,
                hasBlockLeft: this.isReversedL,
                trail: {
                    // to find the next element
                    x: this.isReversedL ? -1 : 1, // go x right
                    y: 0 // go y up
                    // in the gameArray
                },
                head: null
            }, {
                number: 1,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)) + (this.isReversedL ? 0 : 1),
                    y: _this.getPositionY(_this.height) - 1
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2) + (this.isReversedL ? 0 : 1),
                    y: _this.height - 3
                },
                cube: _this.generateCube(this.color),
                isAppending: false,
                hasBlockRight: this.isReversedL,
                hasBlockLeft: !this.isReversedL,
                trail: {
                    x: 0,
                    y: 1
                },
                head: {
                    x: this.isReversedL ? 1 : -1,
                    y: 0
                }
            }, {
                number: 2,
                position: {
                    x: _this.getPositionX(Math.floor(_this.width / 2)) + (this.isReversedL ? 0 : 1),
                    y: _this.getPositionY(_this.height)
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2) + (this.isReversedL ? 0 : 1),
                    y: _this.height - 2
                },
                cube: _this.generateCube(this.color),
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
                    x: _this.getPositionX(Math.floor(_this.width / 2)) + (this.isReversedL ? 0 : 1),
                    y: _this.getPositionY(_this.height) + 1
                },
                gamePosition: {
                    x: Math.floor(_this.width / 2) + (this.isReversedL ? 0 : 1),
                    y: _this.height - 1
                },
                cube: _this.generateCube(this.color),
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