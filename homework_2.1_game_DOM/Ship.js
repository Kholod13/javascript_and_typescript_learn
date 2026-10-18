class Ship {
    #id;
    #x;
    #y;
    #size;
    #color;

    constructor(x, y, size, color) {
        this.#id = document.createElement("div");
        this.#x = x;
        this.#y = y;
        this.#size = size;
        this.#color = color;
    }

    id(){
        return this.#id;
    }
    show(){
        this.#id.style = `position: absolute; width:${this.#size}px; height:${this.#size}px; top:${this.#y}px; left:${this.#x}px; background-color: ${this.#color}; display:block;`;
    }
    hide(){
        this.#id.style = `display:none;`;
    }
    move(x, y){
        this.hide();
        this.#x += x;
        this.#y += y;
        this.show();
    }
    positionX(){
        return this.#x;
    }
    positionY(){
        return this.#y;
    }
}

export default Ship;